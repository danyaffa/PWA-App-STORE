// Vercel Serverless Function — /api/apps
// Server-side CRUD for published apps via Firestore (Admin SDK).
// Works in incognito, any browser/device, and bypasses Firestore rules.
//
// REQUIRED Vercel env var (choose ONE):
//   FIREBASE_SERVICE_ACCOUNT_BASE64  (recommended)
//     - base64 of your service account JSON file
//   or
//   FIREBASE_SERVICE_ACCOUNT_JSON    (raw JSON string)
//
// Diagnostic: visit /api/health for a full status check.

import admin from 'firebase-admin'

function getServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (b64) {
    // Try base64 decode first
    try {
      const json = Buffer.from(b64, 'base64').toString('utf8')
      return { sa: JSON.parse(json), method: 'base64' }
    } catch (_) {
      // If base64 decode fails, try parsing as raw JSON (user may have pasted JSON directly)
      try {
        return { sa: JSON.parse(b64), method: 'base64-raw-json' }
      } catch (e2) {
        return { sa: null, method: 'base64', error: `Value is neither valid base64 nor raw JSON: ${e2.message}` }
      }
    }
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (raw) {
    try {
      return { sa: JSON.parse(raw), method: 'json' }
    } catch (e) {
      return { sa: null, method: 'json', error: `Failed to parse JSON service account: ${e.message}` }
    }
  }

  return { sa: null, method: 'none', error: 'No service account env var found.' }
}

function getAdminDb() {
  if (admin.apps.length) return { db: admin.firestore(), error: null }

  const { sa, method, error } = getServiceAccount()
  if (!sa) {
    return {
      db: null,
      error: error || 'Service account not configured.',
      detail: {
        FIREBASE_SERVICE_ACCOUNT_BASE64: process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ? 'SET' : 'NOT SET',
        FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? 'SET' : 'NOT SET',
        method,
        fix: 'Set FIREBASE_SERVICE_ACCOUNT_BASE64 in Vercel → Settings → Env Vars, then redeploy. Use /api/health to diagnose.',
      },
    }
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(sa),
    })
    return { db: admin.firestore(), error: null }
  } catch (e) {
    return {
      db: null,
      error: `Admin SDK init failed: ${e.message}`,
      detail: {
        method,
        projectId: sa.project_id || 'missing',
        clientEmail: sa.client_email || 'missing',
        fix: 'Service account may be invalid or from wrong project. Re-download from Firebase Console.',
      },
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  const { db, error, detail } = getAdminDb()
  if (!db) {
    console.error('[api/apps] Firebase Admin not available:', error, detail)
    return res.status(503).json({
      error: `Firebase Admin not configured: ${error}`,
      detail,
      diagnosticUrl: '/api/health',
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
      const hint = e?.message?.includes('PERMISSION_DENIED')
        ? 'Admin SDK should bypass rules — check service account project.'
        : e?.message?.includes('NOT_FOUND')
          ? 'Firestore database may not exist. Create it in Firebase Console.'
          : 'Check Vercel function logs. Visit /api/health for diagnostics.'
      return res.status(500).json({ error: `Failed to load apps: ${e?.message}`, hint })
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
      return res.status(500).json({ error: `Failed to save app: ${e?.message}` })
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
      return res.status(500).json({ error: `Failed to delete app: ${e?.message}` })
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}
