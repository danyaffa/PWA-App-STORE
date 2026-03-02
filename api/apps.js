// Vercel Serverless Function — /api/apps
// Server-side CRUD for published apps via Firestore.
// Bypasses all browser restrictions (incognito, IndexedDB, cookies).
//
// Required env vars (set in Vercel dashboard):
//   VITE_FIREBASE_API_KEY
//   VITE_FIREBASE_AUTH_DOMAIN
//   VITE_FIREBASE_PROJECT_ID

import { initializeApp, getApps } from 'firebase/app'
import {
  initializeFirestore,
  getFirestore,
  memoryLocalCache,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'

let db = null

function getDb() {
  if (db) return db

  const config = {
    apiKey:            process.env.VITE_FIREBASE_API_KEY || '',
    authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId:         process.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId:             process.env.VITE_FIREBASE_APP_ID || '',
  }

  if (!config.apiKey || !config.projectId) return null

  try {
    const app = getApps().length ? getApps()[0] : initializeApp(config)
    try {
      db = initializeFirestore(app, { localCache: memoryLocalCache() })
    } catch {
      db = getFirestore(app)
    }
    return db
  } catch (e) {
    console.error('[api/apps] Firebase init failed:', e.message)
    return null
  }
}

/**
 * Strip undefined/function/symbol values that Firestore rejects.
 * Returns a clean plain object safe for setDoc().
 */
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

/** Wrap a promise with a timeout to prevent serverless function hangs. */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore operation timed out (${ms}ms)`)), ms)
    ),
  ])
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  const firestore = getDb()
  if (!firestore) {
    return res.status(503).json({
      error: 'Firebase not configured on server. Set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in Vercel dashboard → Settings → Environment Variables.',
    })
  }

  // ── GET /api/apps — list all published apps ────────────────────────────
  if (req.method === 'GET') {
    try {
      const snap = await withTimeout(getDocs(collection(firestore, 'apps')), 9000)
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return res.status(200).json(apps)
    } catch (e) {
      console.error('[api/apps] GET failed:', e.message)
      return res.status(500).json({ error: `Failed to load apps: ${e.message}` })
    }
  }

  // ── POST /api/apps — save/update a published app ──────────────────────
  if (req.method === 'POST') {
    const app = req.body
    if (!app || !app.id) {
      return res.status(400).json({ error: 'App with id is required.' })
    }
    try {
      // Sanitize data to remove undefined/function values Firestore rejects.
      // Use plain Date instead of serverTimestamp() — more reliable on serverless cold starts.
      const data = sanitize(app)
      data.updatedAt = new Date().toISOString()
      const ref = doc(firestore, 'apps', String(app.id))
      await withTimeout(setDoc(ref, data, { merge: true }), 9000)
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('[api/apps] POST failed:', e.message)
      return res.status(500).json({ error: `Failed to save app: ${e.message}` })
    }
  }

  // ── DELETE /api/apps?id=<appId> — delete a published app ──────────────
  if (req.method === 'DELETE') {
    const appId = req.query.id
    if (!appId) {
      return res.status(400).json({ error: 'App id is required (?id=...).' })
    }
    try {
      await withTimeout(deleteDoc(doc(firestore, 'apps', String(appId))), 9000)
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('[api/apps] DELETE failed:', e.message)
      return res.status(500).json({ error: `Failed to delete app: ${e.message}` })
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}
