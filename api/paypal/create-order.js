// Vercel Serverless Function — POST /api/paypal/create-order
// Secrets (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET) are set in Vercel env vars
// (no VITE_ prefix, so they are NEVER exposed to the browser).

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
    const { amount, currency = 'USD', description = 'SafeLaunch Purchase' } = req.body

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const token = await getAccessToken()

    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: currency, value: String(amount) },
            description,
          },
        ],
        application_context: {
          brand_name: 'SafeLaunch',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
        },
      }),
    })

    const order = await orderRes.json()

    if (!orderRes.ok) {
      console.error('PayPal create-order error:', order)
      return res.status(500).json({ error: 'Failed to create order' })
    }

    return res.status(200).json({ id: order.id })
  } catch (err) {
    console.error('create-order exception:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
