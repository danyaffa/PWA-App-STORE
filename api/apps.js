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
  serverTimestamp,
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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  const firestore = getDb()
  if (!firestore) {
    return res.status(503).json({ error: 'Firebase not configured on server.' })
  }

  // ── GET /api/apps — list all published apps ────────────────────────────
  if (req.method === 'GET') {
    try {
      const snap = await getDocs(collection(firestore, 'apps'))
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return res.status(200).json(apps)
    } catch (e) {
      console.error('[api/apps] GET failed:', e.message)
      return res.status(500).json({ error: 'Failed to load apps.' })
    }
  }

  // ── POST /api/apps — save/update a published app ──────────────────────
  if (req.method === 'POST') {
    const app = req.body
    if (!app || !app.id) {
      return res.status(400).json({ error: 'App with id is required.' })
    }
    try {
      const ref = doc(firestore, 'apps', String(app.id))
      await setDoc(ref, { ...app, updatedAt: serverTimestamp() }, { merge: true })
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('[api/apps] POST failed:', e.message)
      return res.status(500).json({ error: 'Failed to save app.' })
    }
  }

  // ── DELETE /api/apps?id=<appId> — delete a published app ──────────────
  if (req.method === 'DELETE') {
    const appId = req.query.id
    if (!appId) {
      return res.status(400).json({ error: 'App id is required (?id=...).' })
    }
    try {
      await deleteDoc(doc(firestore, 'apps', String(appId)))
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('[api/apps] DELETE failed:', e.message)
      return res.status(500).json({ error: 'Failed to delete app.' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}
