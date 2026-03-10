// Vercel Serverless Function — GET /api/review-stats
// Returns aggregate review count and average rating from Firestore.

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    initAdmin()
    const db = admin.firestore()
    const snap = await db.collection('reviews').get()

    let total = 0
    let sum = 0
    snap.forEach((doc) => {
      const r = doc.data().rating
      if (typeof r === 'number') {
        total++
        sum += r
      }
    })

    return res.status(200).json({
      success: true,
      count: total,
      average: total > 0 ? Math.round((sum / total) * 10) / 10 : null,
    })
  } catch (e) {
    console.error('review-stats error:', e)
    return res.status(500).json({ success: false, error: e.message })
  }
}
