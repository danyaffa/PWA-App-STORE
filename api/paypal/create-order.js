// Vercel Serverless Function — POST /api/paypal/create-order
// Secrets (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET) are set in Vercel env vars
// (no VITE_ prefix, so they are NEVER exposed to the browser).

const PAYPAL_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function getAccessToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error('PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set in Vercel Environment Variables')
  }

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString('base64')

  const tokenUrl = `${PAYPAL_BASE}/v1/oauth2/token`
  let res
  try {
    res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })
  } catch (fetchErr) {
    throw new Error(`Cannot reach PayPal (${tokenUrl}): ${fetchErr.message}`)
  }

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error(`PayPal returned non-JSON response (HTTP ${res.status})`)
  }

  if (!res.ok) {
    throw new Error(`PayPal auth failed (HTTP ${res.status}): ${data.error_description || data.error || JSON.stringify(data)}`)
  }

  if (!data.access_token) {
    throw new Error(`PayPal token request failed: ${data.error || 'no access_token returned'}`)
  }
  return data.access_token
}

export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, currency = 'USD', description = 'SafeLaunch Purchase' } = req.body || {}

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
            amount: { currency_code: currency, value: Number(amount).toFixed(2) },
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
      console.error('PayPal create-order error:', JSON.stringify(order, null, 2))
      const detail = order?.details?.[0]?.description || order?.message || 'Failed to create order'
      return res.status(orderRes.status || 500).json({ error: detail })
    }

    return res.status(200).json({ id: order.id })
  } catch (err) {
    console.error('create-order exception:', err)
    const message = err.message || 'Internal server error'
    const status = message.includes('must be set') ? 503 : 500
    return res.status(status).json({ error: message })
  }
}
