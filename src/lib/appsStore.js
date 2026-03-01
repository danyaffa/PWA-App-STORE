import { collection, getDocs, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db, isConfigured } from './firebase'

const LS_KEY = 'sl_published_apps'
const CAMPAIGN_KEY = 'sl_campaign'

let lastRemoteError = null

function safeParse(json, fallback) {
  try { return JSON.parse(json) } catch { return fallback }
}

export function getAppsStoreStatus() {
  return {
    firebaseEnabled: !!(isConfigured && db),
    lastRemoteError,
  }
}

function dedup(apps) {
  const seen = new Set()
  return apps.filter(a => {
    const id = a?.id
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

/* ── Server-side API (works in ANY browser, incognito included) ────────── */

async function apiLoadApps() {
  const res = await fetch('/api/apps')
  if (!res.ok) throw new Error(`API ${res.status}`)
  return await res.json()
}

async function apiSaveApp(app) {
  const res = await fetch('/api/apps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(app),
  })
  return res.ok
}

async function apiDeleteApp(appId) {
  const res = await fetch(`/api/apps?id=${encodeURIComponent(appId)}`, {
    method: 'DELETE',
  })
  return res.ok
}

/* ── Client-side Firebase (fallback) ───────────────────────────────────── */

async function fbLoadApps() {
  if (!isConfigured || !db) return null
  const snap = await getDocs(collection(db, 'apps'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

async function fbSaveApp(app) {
  if (!isConfigured || !db) return false
  const ref = doc(db, 'apps', String(app.id))
  await setDoc(ref, { ...app, updatedAt: serverTimestamp() }, { merge: true })
  return true
}

async function fbDeleteApp(appId) {
  if (!isConfigured || !db) return false
  await deleteDoc(doc(db, 'apps', String(appId)))
  return true
}

/* ── Public API ────────────────────────────────────────────────────────── */

export async function savePublishedApp(app) {
  // Always save to localStorage (instant UX)
  try {
    const existing = safeParse(localStorage.getItem(LS_KEY) || '[]', [])
    const next = [app, ...existing.filter(a => a?.id !== app?.id)]
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  } catch { /* ignore */ }

  // Try server API first (reliable), then client Firebase as fallback
  try {
    if (await apiSaveApp(app)) { lastRemoteError = null; return true }
  } catch (e) { lastRemoteError = e?.message || 'api_save_failed' }
  try {
    if (await fbSaveApp(app)) { lastRemoteError = null; return true }
  } catch (e) { lastRemoteError = e?.message || 'firebase_save_failed' }

  if (!isConfigured || !db) lastRemoteError = 'firebase_not_configured'
  console.warn('[appsStore] App saved to localStorage only.')
  return false
}

export async function loadPublishedApps() {
  // Start with localStorage (fast, synchronous)
  let local = []
  try {
    local = safeParse(localStorage.getItem(LS_KEY) || '[]', []).filter(a => a?.id)
  } catch { /* ignore */ }

  // Try server API first — works in incognito, any browser, any device
  try {
    const remote = await apiLoadApps()
    if (remote && remote.length) {
      lastRemoteError = null
      const merged = dedup([...remote, ...local])
      try { localStorage.setItem(LS_KEY, JSON.stringify(merged)) } catch { /* ignore */ }
      return merged
    }
  } catch (e) { lastRemoteError = e?.message || 'api_load_failed' }

  // Fallback: client-side Firebase
  try {
    const remote = await fbLoadApps()
    if (remote && remote.length) {
      lastRemoteError = null
      const merged = dedup([...remote, ...local])
      try { localStorage.setItem(LS_KEY, JSON.stringify(merged)) } catch { /* ignore */ }
      return merged
    }
  } catch (e) { lastRemoteError = e?.message || 'firebase_load_failed' }

  // Last resort: localStorage only
  if (!isConfigured || !db) lastRemoteError = 'firebase_not_configured'
  return local
}

export async function deletePublishedApp(appId) {
  // Remove from localStorage
  try {
    const existing = safeParse(localStorage.getItem(LS_KEY) || '[]', [])
    const next = existing.filter(a => a?.id !== appId)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  } catch { /* ignore */ }

  // Try server API first, then client Firebase
  try { if (await apiDeleteApp(appId)) return true } catch { /* ignore */ }
  try { if (await fbDeleteApp(appId)) return true } catch { /* ignore */ }

  return false
}

/* ── Campaign Banner ─────────────────────────────────────────────────────── */

const DEFAULT_CAMPAIGN = {
  active: false,
  headline: '',
  subtitle: '',
  ctaText: 'Browse Store',
  ctaLink: '/store',
}

export async function saveCampaign(campaign) {
  const data = { ...DEFAULT_CAMPAIGN, ...campaign }
  try { localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(data)) } catch { /* ignore */ }

  if (!isConfigured || !db) return false
  try {
    await setDoc(doc(db, 'config', 'campaign'), { ...data, updatedAt: serverTimestamp() })
    return true
  } catch (e) {
    console.error('[appsStore] Campaign save FAILED:', e.message)
    return false
  }
}

export async function loadCampaign() {
  let local = null
  try {
    local = safeParse(localStorage.getItem(CAMPAIGN_KEY), null)
  } catch { /* ignore */ }

  if (!isConfigured || !db) return local || DEFAULT_CAMPAIGN

  try {
    const snap = await getDoc(doc(db, 'config', 'campaign'))
    if (snap.exists()) {
      const remote = snap.data()
      try { localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(remote)) } catch { /* ignore */ }
      return remote
    }
  } catch (e) {
    console.error('[appsStore] Campaign load FAILED:', e.message)
  }
  return local || DEFAULT_CAMPAIGN
}
