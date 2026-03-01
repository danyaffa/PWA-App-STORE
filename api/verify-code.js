// Vercel Serverless Function — POST /api/verify-code
// Verifies the 6-digit code against the HMAC token returned by /api/send-code.
//
// Required env vars:
//   MGMT_SECRET — same secret used in send-code.js

import crypto from 'crypto'

const CODE_TTL = 10 * 60 * 1000 // 10 minutes

function hmacSign(code, email, ts) {
  const secret = process.env.MGMT_SECRET || 'default-dev-secret'
  return crypto
    .createHmac('sha256', secret)
    .update(`${code}:${email}:${ts}`)
    .digest('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, code, token, ts } = req.body || {}

  if (!email || !code || !token || !ts) {
    return res.status(400).json({ error: 'Missing fields.' })
  }

  // Check expiry
  const age = Date.now() - Number(ts)
  if (age < 0 || age > CODE_TTL) {
    return res.status(400).json({ error: 'Code expired. Please request a new one.' })
  }

  // Verify HMAC
  const expected = hmacSign(code.trim(), email.trim().toLowerCase(), ts)
  try {
    const a = Buffer.from(expected)
    const b = Buffer.from(token)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(400).json({ error: 'Incorrect code.' })
    }
  } catch {
    return res.status(400).json({ error: 'Incorrect code.' })
  }

  return res.status(200).json({ ok: true })
}
