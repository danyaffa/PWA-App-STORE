// Lightweight analytics — tracks views, installs, and searches.
// Stores in Firestore when configured, otherwise uses localStorage.

import { db, isConfigured } from './firebase.js'

const LOCAL_KEY = 'sl_analytics'

function getLocalAnalytics() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') }
  catch { return {} }
}

function saveLocalAnalytics(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

/**
 * Track an app page view.
 */
export async function trackView(appId) {
  if (isConfigured && db) {
    try {
      const { doc, updateDoc, increment } = await import('firebase/firestore')
      await updateDoc(doc(db, 'analytics', appId), {
        views: increment(1),
        lastViewed: new Date().toISOString(),
      }).catch(async () => {
        // Document doesn't exist yet, create it
        const { setDoc } = await import('firebase/firestore')
        await setDoc(doc(db, 'analytics', appId), {
          views: 1,
          installs: 0,
          lastViewed: new Date().toISOString(),
        })
      })
    } catch { /* silent fail */ }
  }

  // Always track locally too
  const data = getLocalAnalytics()
  if (!data[appId]) data[appId] = { views: 0, installs: 0 }
  data[appId].views += 1
  saveLocalAnalytics(data)
}

/**
 * Track an app install.
 */
export async function trackInstall(appId) {
  if (isConfigured && db) {
    try {
      const { doc, updateDoc, increment } = await import('firebase/firestore')
      await updateDoc(doc(db, 'analytics', appId), {
        installs: increment(1),
        lastInstalled: new Date().toISOString(),
      }).catch(() => {})
    } catch { /* silent fail */ }
  }

  const data = getLocalAnalytics()
  if (!data[appId]) data[appId] = { views: 0, installs: 0 }
  data[appId].installs += 1
  saveLocalAnalytics(data)
}

/**
 * Track an app open (user clicks "Open App").
 */
export async function trackOpenApp(appId) {
  if (isConfigured && db) {
    try {
      const { doc, updateDoc, increment } = await import('firebase/firestore')
      await updateDoc(doc(db, 'analytics', appId), {
        opens: increment(1),
        lastOpened: new Date().toISOString(),
      }).catch(() => {})
    } catch { /* silent fail */ }
  }

  const data = getLocalAnalytics()
  if (!data[appId]) data[appId] = { views: 0, installs: 0, opens: 0 }
  data[appId].opens = (data[appId].opens || 0) + 1
  saveLocalAnalytics(data)
}

/**
 * Track a search query.
 */
export async function trackSearch(query) {
  if (!query || query.length < 2) return

  if (isConfigured && db) {
    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
      await addDoc(collection(db, 'searchQueries'), {
        query: query.toLowerCase().trim(),
        createdAt: serverTimestamp(),
      })
    } catch { /* silent fail */ }
  }
}
