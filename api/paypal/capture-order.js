// Vercel Serverless Function — POST /api/paypal/capture-order
// Captures a previously approved PayPal order.

const PAYPAL_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken() {
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
  return data.access_token
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' })
    }

    const token = await getAccessToken()

    const captureRes = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    const capture = await captureRes.json()

    if (!captureRes.ok) {
      console.error('PayPal capture-order error:', capture)
      return res.status(500).json({ error: 'Failed to capture order' })
    }

    return res.status(200).json({
      id: capture.id,
      status: capture.status,
      payer: capture.payer,
    })
  } catch (err) {
    console.error('capture-order exception:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
