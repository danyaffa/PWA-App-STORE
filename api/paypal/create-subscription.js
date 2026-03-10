// Vercel Serverless Function — POST /api/paypal/create-subscription
// Creates a PayPal subscription using a pre-created billing plan ID.

const PAYPAL_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error('PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set')
  }

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
  if (!data.access_token) {
    throw new Error(`PayPal token request failed: ${data.error || 'no access_token returned'}`)
  }
  return data.access_token
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { planId, email, name, returnUrl, cancelUrl } = req.body

    if (!planId) {
      return res.status(400).json({ error: 'Missing planId' })
    }

    const token = await getAccessToken()

    const subBody = {
      plan_id: planId,
      application_context: {
        brand_name: 'SafeLaunch',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl || `${req.headers.origin || 'https://pwa-app-store.com'}/payment?success=true`,
        cancel_url: cancelUrl || `${req.headers.origin || 'https://pwa-app-store.com'}/payment?cancelled=true`,
      },
    }

    if (email) {
      subBody.subscriber = {
        name: { given_name: name || 'Publisher' },
        email_address: email,
      }
    }

    const subRes = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(subBody),
    })

    const subscription = await subRes.json()

    if (!subRes.ok) {
      console.error('PayPal create-subscription error:', subscription)
      return res.status(500).json({ error: subscription.message || 'Failed to create subscription' })
    }

    const approveLink = subscription.links?.find(l => l.rel === 'approve')

    return res.status(200).json({
      id: subscription.id,
      status: subscription.status,
      approveUrl: approveLink?.href || null,
    })
  } catch (err) {
    console.error('create-subscription exception:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
