// Vercel Serverless Function — GET /api/health
// Diagnostic endpoint: reports env-var status and Firebase Admin connectivity.
// Visit https://www.pwa-app-store.com/api/health to check deployment health.

import admin from 'firebase-admin'

function checkServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON

  if (!b64 && !raw) {
    return {
      found: false,
      method: 'none',
      hint: 'Set FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_SERVICE_ACCOUNT_JSON in Vercel → Settings → Environment Variables, then redeploy.',
    }
  }

  // Try to parse and validate structure
  try {
    let sa
    if (b64) {
      const json = Buffer.from(b64, 'base64').toString('utf8')
      sa = JSON.parse(json)
    } else {
      sa = JSON.parse(raw)
    }

    const requiredFields = ['type', 'project_id', 'private_key', 'client_email']
    const missing = requiredFields.filter(f => !sa[f])

    if (missing.length) {
      return {
        found: true,
        method: b64 ? 'base64' : 'json',
        valid: false,
        error: `Service account JSON is missing fields: ${missing.join(', ')}`,
        hint: 'Re-download the service account key from Firebase Console → Project Settings → Service accounts → Generate new private key.',
      }
    }

    return {
      found: true,
      method: b64 ? 'base64' : 'json',
      valid: true,
      projectId: sa.project_id,
      clientEmail: sa.client_email,
    }
  } catch (e) {
    return {
      found: true,
      method: b64 ? 'base64' : 'json',
      valid: false,
      error: `Failed to parse service account: ${e.message}`,
      hint: b64
        ? 'The base64 value may be corrupted. Re-run: base64 -w 0 path/to/serviceAccountKey.json'
        : 'The JSON string may be malformed. Paste the raw JSON content of the downloaded key file.',
    }
  }
}

async function checkFirestoreConnection() {
  try {
    if (!admin.apps.length) {
      const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      let sa
      if (b64) {
        sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
      } else if (raw) {
        sa = JSON.parse(raw)
      } else {
        return { connected: false, error: 'No service account configured.' }
      }
      admin.initializeApp({ credential: admin.credential.cert(sa) })
    }

    const db = admin.firestore()
    const snap = await db.collection('apps').limit(1).get()
    return {
      connected: true,
      appsCount: snap.size,
      message: snap.empty
        ? 'Connected to Firestore but "apps" collection is empty. Publish an app from the Dashboard first.'
        : `Connected! Found apps in Firestore.`,
    }
  } catch (e) {
    const msg = e.message || String(e)
    let hint = 'Check Vercel function logs for full stack trace.'

    if (msg.includes('PERMISSION_DENIED') || msg.includes('permission')) {
      hint = 'Admin SDK should bypass rules. Check that the service account belongs to the correct Firebase project.'
    } else if (msg.includes('NOT_FOUND') || msg.includes('database')) {
      hint = 'Firestore database may not be created yet. Go to Firebase Console → Firestore → Create database.'
    } else if (msg.includes('UNAUTHENTICATED') || msg.includes('credential')) {
      hint = 'Service account key may be revoked or from wrong project. Generate a fresh key from Firebase Console.'
    }

    return { connected: false, error: msg, hint }
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const sa = checkServiceAccount()
  let firestore = { skipped: true, reason: 'Service account not valid.' }

  if (sa.found && sa.valid) {
    firestore = await checkFirestoreConnection()
  }

  const allGood = sa.found && sa.valid && firestore.connected

  const result = {
    status: allGood ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks: {
      serviceAccount: sa,
      firestore,
    },
    envVars: {
      FIREBASE_SERVICE_ACCOUNT_BASE64: process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ? 'SET' : 'NOT SET',
      FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? 'SET' : 'NOT SET',
      VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || 'NOT SET',
    },
    help: allGood
      ? 'Everything looks good! /api/apps should work in incognito.'
      : 'Fix the issues above, then redeploy. Visit /api/health again to verify.',
  }

  return res.status(allGood ? 200 : 503).json(result)
}
