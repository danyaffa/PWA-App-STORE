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

/** Strip undefined/function/symbol values before sending to API or Firestore. */
function sanitize(obj) {
  if (obj === null || obj === undefined) return null
  if (Array.isArray(obj)) return obj.map(sanitize).filter(v => v !== undefined)
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const clean = {}
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined && typeof v !== 'function' && typeof v !== 'symbol') {
        clean[k] = sanitize(v)
      }
    }
    return clean
  }
  return obj
}

/** Fetch with a timeout to prevent hanging requests. */
function fetchWithTimeout(url, opts = {}, ms = 12000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(timer))
}

/** Retry a fn up to `times` with exponential backoff (1s, 2s, 4s). */
async function withRetry(fn, times = 3) {
  let lastErr
  for (let i = 0; i < times; i++) {
    try { return await fn() } catch (e) { lastErr = e }
    if (i < times - 1) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)))
  }
  throw lastErr
}

/* ── Server-side API (works in ANY browser, incognito included) ────────── */

async function apiLoadApps() {
  const res = await fetchWithTimeout('/api/apps')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `API ${res.status}`)
  }
  return await res.json()
}

async function apiSaveApp(app) {
  const clean = sanitize(app)
  const res = await fetchWithTimeout('/api/apps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clean),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `API ${res.status}`)
  }
  return true
}

/** Save app with retry + exponential backoff (handles transient failures). */
async function apiSaveAppWithRetry(app) {
  return withRetry(() => apiSaveApp(app), 3)
}

async function apiDeleteApp(appId) {
  const res = await fetchWithTimeout(`/api/apps?id=${encodeURIComponent(appId)}`, {
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
  const clean = sanitize(app)
  const ref = doc(db, 'apps', String(app.id))
  await setDoc(ref, { ...clean, updatedAt: serverTimestamp() }, { merge: true })
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

  const errors = []

  // Try server API first (with retry for transient failures), then client Firebase as fallback
  try {
    if (await apiSaveAppWithRetry(app)) { lastRemoteError = null; return true }
  } catch (e) {
    const msg = e?.message || 'api_save_failed'
    errors.push(`API: ${msg}`)
    lastRemoteError = msg
  }
  try {
    if (await fbSaveApp(app)) { lastRemoteError = null; return true }
  } catch (e) {
    const msg = e?.message || 'firebase_save_failed'
    errors.push(`Firestore: ${msg}`)
    lastRemoteError = msg
  }

  if (!isConfigured || !db) {
    lastRemoteError = 'firebase_not_configured'
    errors.push('Firebase not configured')
  }
  console.error('[appsStore] Cloud save FAILED. App is localStorage-only (invisible in incognito).', errors.join(' | '))
  console.error('[appsStore] FIX: Go to Firebase Console → Firestore → Rules and deploy the rules from firestore.rules')
  return false
}

/**
 * Push all localStorage apps to Firestore.
 * Returns { synced: number, failed: number, errors: string[] }
 */
export async function syncAllAppsToCloud() {
  let local = []
  try {
    local = safeParse(localStorage.getItem(LS_KEY) || '[]', []).filter(a => a?.id)
  } catch { /* ignore */ }

  if (!local.length) return { synced: 0, failed: 0, errors: ['No local apps to sync.'] }

  let synced = 0
  let failed = 0
  const errors = []

  for (const app of local) {
    // Try API first (with retry for transient failures)
    try {
      if (await apiSaveAppWithRetry(app)) { synced++; continue }
    } catch (e) {
      errors.push(`${app.name || app.id} API: ${e?.message}`)
    }
    // Try client Firebase as fallback
    try {
      if (await fbSaveApp(app)) { synced++; continue }
    } catch (e) {
      errors.push(`${app.name || app.id} Firestore: ${e?.message}`)
    }
    failed++
  }

  return { synced, failed, errors }
}

export async function loadPublishedApps() {
  // Start with localStorage (fast, synchronous)
  let local = []
  try {
    local = safeParse(localStorage.getItem(LS_KEY) || '[]', []).filter(a => a?.id)
  } catch { /* ignore */ }

  // Try server API first (with retry) — works in incognito, any browser, any device
  try {
    const remote = await withRetry(() => apiLoadApps(), 2)
    if (remote && remote.length) {
      lastRemoteError = null
      const merged = dedup([...remote, ...local])
      try { localStorage.setItem(LS_KEY, JSON.stringify(merged)) } catch { /* ignore */ }
      // Sync local-only apps to remote (retries previously failed saves)
      syncLocalOnlyApps(local, remote)
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
      syncLocalOnlyApps(local, remote)
      return merged
    }
  } catch (e) { lastRemoteError = e?.message || 'firebase_load_failed' }

  // Last resort: localStorage only
  if (!isConfigured || !db) lastRemoteError = 'firebase_not_configured'
  return local
}

/* Re-push local-only apps that never made it to Firestore (fire-and-forget) */
function syncLocalOnlyApps(local, remote) {
  if (!local.length) return
  const remoteIds = new Set(remote.map(a => a?.id))
  const missing = local.filter(a => a?.id && !remoteIds.has(a.id))
  for (const app of missing) {
    apiSaveAppWithRetry(app)
      .then(ok => { if (!ok) return fbSaveApp(app) })
      .catch(() => fbSaveApp(app).catch(() => {}))
  }
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
