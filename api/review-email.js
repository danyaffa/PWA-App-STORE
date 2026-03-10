// Vercel Serverless Function — POST /api/review-email
// Saves a user review to Firestore and optionally sends an email notification.

import admin from 'firebase-admin'
import nodemailer from 'nodemailer'

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { rating, text, email, appName } = req.body || {}

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, error: 'Invalid rating (1-5).' })
  }

  try {
    initAdmin()
    const db = admin.firestore()

    await db.collection('reviews').add({
      rating,
      text: typeof text === 'string' ? text.slice(0, 2000) : '',
      email: typeof email === 'string' ? email.slice(0, 320) : '',
      appName: typeof appName === 'string' ? appName.slice(0, 200) : '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    // Send optional email notification
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const notifyEmail = process.env.REVIEW_NOTIFY_EMAIL

    if (smtpHost && smtpUser && smtpPass && notifyEmail) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      })

      await transporter.sendMail({
        from: smtpUser,
        to: notifyEmail,
        subject: `New review: ${rating}/5 — ${appName || 'App'}`,
        text: `Rating: ${rating}/5\nComment: ${text || '(none)'}\nEmail: ${email || '(none)'}`,
      })
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error('review-email error:', e)
    return res.status(500).json({ success: false, error: e.message })
  }
}
