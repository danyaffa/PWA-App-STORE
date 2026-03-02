// Vercel Serverless Function — /api/apps
// Server-side CRUD for published apps via Firestore (Admin SDK).
// Works in incognito, any browser/device, and bypasses Firestore rules.
//
// REQUIRED Vercel env var (choose ONE):
//   FIREBASE_SERVICE_ACCOUNT_BASE64  (recommended)
//     - base64 of your service account JSON file
//   or
//   FIREBASE_SERVICE_ACCOUNT_JSON    (raw JSON string)

import admin from 'firebase-admin'

function getServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (b64) {
    const json = Buffer.from(b64, 'base64').toString('utf8')
    return JSON.parse(json)
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (raw) return JSON.parse(raw)

  return null
}

function getAdminDb() {
  if (admin.apps.length) return admin.firestore()

  const sa = getServiceAccount()
  if (!sa) return null

  admin.initializeApp({
    credential: admin.credential.cert(sa),
  })

  return admin.firestore()
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  const db = getAdminDb()
  if (!db) {
    return res.status(503).json({
      error:
        'Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_BASE64 (recommended) or FIREBASE_SERVICE_ACCOUNT_JSON in Vercel.',
    })
  }

  // ── GET /api/apps — list all published apps ────────────────────────────
  if (req.method === 'GET') {
    try {
      const snap = await db.collection('apps').get()
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return res.status(200).json(apps)
    } catch (e) {
      console.error('[api/apps] GET failed:', e?.message || e)
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
      const ref = db.collection('apps').doc(String(app.id))
      await ref.set(
        {
          ...app,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      )
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('[api/apps] POST failed:', e?.message || e)
      return res.status(500).json({ error: 'Failed to save app.' })
    }
  }

  // ── DELETE /api/apps?id=<appId> — delete a published app ──────────────
  if (req.method === 'DELETE') {
    const appId = req.query?.id
    if (!appId) {
      return res.status(400).json({ error: 'App id is required (?id=...).' })
    }

    try {
      await db.collection('apps').doc(String(appId)).delete()
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('[api/apps] DELETE failed:', e?.message || e)
      return res.status(500).json({ error: 'Failed to delete app.' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}
