// Vercel Serverless Function — POST /api/send-code
// Sends a 6-digit verification code to the provided email via SMTP.
//
// Required env vars (set in Vercel dashboard, NOT prefixed with VITE_):
//   SMTP_HOST          — e.g. smtp.gmail.com
//   SMTP_PORT          — e.g. 587
//   SMTP_USER          — e.g. you@gmail.com
//   SMTP_PASS          — e.g. app-specific password
//   SMTP_FROM          — (optional) sender address, defaults to SMTP_USER
//   MGMT_SECRET        — random string used to HMAC-sign the code

import nodemailer from 'nodemailer'
import crypto from 'crypto'

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

  const { email } = req.body || {}
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' })
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const ts = Date.now()
  const token = hmacSign(code, email.trim().toLowerCase(), ts)

  // Build SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email.trim(),
      subject: 'SafeLaunch Management — Verification Code',
      text: `Your SafeLaunch management verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="margin:0 0 8px;">SafeLaunch Management</h2>
          <p style="color:#6b7280;">Your verification code is:</p>
          <div style="font-size:2.5rem;font-weight:800;letter-spacing:0.15em;padding:20px 0;text-align:center;">${code}</div>
          <p style="color:#6b7280;font-size:0.85rem;">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
        </div>
      `,
    })

    return res.status(200).json({ ok: true, token, ts })
  } catch (err) {
    console.error('SMTP send failed:', err)
    return res.status(500).json({ error: 'Failed to send email. Check SMTP env vars.' })
  }
}
