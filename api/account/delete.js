// Vercel Serverless Function — POST /api/account/delete
// Deletes a user's account: cancels PayPal subscription + removes Firestore data.
// Requires Firebase Auth ID token in Authorization header.

import admin from 'firebase-admin'

function initAdmin() {
  if (admin.apps.length) return
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  let sa
  if (b64) {
    try {
      sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
    } catch {
      sa = JSON.parse(b64)
    }
  } else if (raw) {
    sa = JSON.parse(raw)
  } else {
    throw new Error('No Firebase service account configured.')
  }
  admin.initializeApp({ credential: admin.credential.cert(sa) })
}

const PAYPAL_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getPayPalToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) return null
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString('base64')
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token || null
}

async function cancelPayPalSubscription(subscriptionId) {
  const token = await getPayPalToken()
  if (!token) return { skipped: true, reason: 'PayPal not configured' }
  const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: 'User requested account deletion' }),
  })
  // 204 = success, 422 = already cancelled
  if (res.status === 204 || res.status === 422) return { cancelled: true }
  return { cancelled: false, status: res.status }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req, res) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    initAdmin()
    const db = admin.firestore()

    // Verify Firebase Auth token
    const authHeader = req.headers.authorization || ''
    const idToken = authHeader.replace(/^Bearer\s+/i, '')
    if (!idToken) {
      return res.status(401).json({ error: 'Missing authorization token. Please log in.' })
    }

    let decoded
    try {
      decoded = await admin.auth().verifyIdToken(idToken)
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' })
    }

    const uid = decoded.uid
    const email = decoded.email || ''

    // 1. Find user's apps and delete them
    const appsSnap = await db.collection('apps').where('developerId', '==', uid).get()
    const batch = db.batch()
    const appIds = []
    appsSnap.forEach(doc => {
      appIds.push(doc.id)
      batch.delete(doc.ref)
    })

    // 2. Delete scan reports for those apps
    for (const appId of appIds) {
      const reportsSnap = await db.collection('scanReports').where('appId', '==', appId).get()
      reportsSnap.forEach(doc => batch.delete(doc.ref))
    }

    // 3. Delete user profile doc
    const userDoc = db.collection('users').doc(uid)
    const userSnap = await userDoc.get()
    let subscriptionId = null
    if (userSnap.exists) {
      subscriptionId = userSnap.data()?.paypalSubscriptionId || null
      batch.delete(userDoc)
    }

    // Also check by email
    if (email) {
      const byEmail = await db.collection('users').where('email', '==', email).get()
      byEmail.forEach(doc => {
        if (!subscriptionId) subscriptionId = doc.data()?.paypalSubscriptionId || null
        batch.delete(doc.ref)
      })
    }

    // 4. Commit all Firestore deletes
    await batch.commit()

    // 5. Cancel PayPal subscription if exists
    let paypalResult = { skipped: true, reason: 'No subscription found' }
    if (subscriptionId) {
      paypalResult = await cancelPayPalSubscription(subscriptionId)
    }

    // 6. Delete Firebase Auth user
    try {
      await admin.auth().deleteUser(uid)
    } catch (authErr) {
      console.warn('Could not delete Firebase Auth user:', authErr.message)
    }

    console.log(`Account deleted: uid=${uid}, email=${email}, apps=${appIds.length}, paypal=${JSON.stringify(paypalResult)}`)

    return res.status(200).json({
      success: true,
      deleted: {
        apps: appIds.length,
        user: true,
        paypal: paypalResult,
      },
    })
  } catch (err) {
    console.error('account/delete error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
