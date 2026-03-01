import { collection, getDocs, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db, isConfigured } from './firebase'

const LS_KEY = 'sl_published_apps'
const CAMPAIGN_KEY = 'sl_campaign'

function safeParse(json, fallback) {
  try { return JSON.parse(json) } catch { return fallback }
}

export async function savePublishedApp(app) {
  // Always save locally (instant UX)
  try {
    const existing = safeParse(localStorage.getItem(LS_KEY) || '[]', [])
    const next = [app, ...existing.filter(a => a?.id !== app?.id)]
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  } catch { /* ignore */ }

  // If Firebase is not configured, we can only save locally
  if (!isConfigured || !db) {
    console.warn('[appsStore] Firebase not configured — app saved to localStorage only. Set VITE_FIREBASE_* env vars to enable global persistence.')
    return false
  }

  try {
    const ref = doc(db, 'apps', String(app.id))
    await setDoc(ref, { ...app, updatedAt: serverTimestamp() }, { merge: true })
    return true
  } catch (e) {
    console.error('[appsStore] Firebase save FAILED:', e.message)
    return false
  }
}

export async function loadPublishedApps() {
  // Start with local (fast)
  let local = []
  try {
    local = safeParse(localStorage.getItem(LS_KEY) || '[]', []).filter(a => a?.id)
  } catch { /* ignore */ }

  // If Firebase is not configured, local is all we can do
  if (!isConfigured || !db) {
    console.warn('[appsStore] Firebase not configured — loading from localStorage only.')
    return local
  }

  try {
    const snap = await getDocs(collection(db, 'apps'))
    const remote = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    // Merge: remote first so it's canonical across devices
    const merged = [...remote, ...local]
    const seen = new Set()
    return merged.filter(a => {
      const id = a?.id
      if (!id) return false
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
  } catch (e) {
    console.error('[appsStore] Firebase load FAILED, using localStorage only:', e.message)
    return local
  }
}

export async function deletePublishedApp(appId) {
  // Remove from localStorage
  try {
    const existing = safeParse(localStorage.getItem(LS_KEY) || '[]', [])
    const next = existing.filter(a => a?.id !== appId)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  } catch { /* ignore */ }

  // Remove from Firestore so it disappears for ALL users/browsers
  if (!isConfigured || !db) return false
  try {
    await deleteDoc(doc(db, 'apps', String(appId)))
    return true
  } catch (e) {
    console.error('[appsStore] Firebase delete FAILED:', e.message)
    return false
  }
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
