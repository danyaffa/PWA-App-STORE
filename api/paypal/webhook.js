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

async function verifyWebhookSignature(req, eventBody) {
  const transmissionId = req.headers['paypal-transmission-id']
  const transmissionTime = req.headers['paypal-transmission-time']
  const certUrl = req.headers['paypal-cert-url']
  const authAlgo = req.headers['paypal-auth-algo']
  const transmissionSig = req.headers['paypal-transmission-sig']
  const webhookId = process.env.PAYPAL_WEBHOOK_ID

  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig || !webhookId) {
    return false
  }

  const token = await getAccessToken()

  const verifyRes = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: eventBody,
    }),
  })

  const result = await verifyRes.json()
  return verifyRes.ok && result.verification_status === 'SUCCESS'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const eventBody = req.body || {}

    const hasSignatureHeaders = Boolean(req.headers['paypal-transmission-id'])
    const webhookIdConfigured = Boolean(process.env.PAYPAL_WEBHOOK_ID)

    if (webhookIdConfigured) {
      // When webhook verification is configured, require valid signature headers
      if (!hasSignatureHeaders) {
        console.warn('PayPal webhook: Missing signature headers — rejecting (PAYPAL_WEBHOOK_ID is configured)')
        return res.status(400).json({ error: 'Missing webhook signature headers' })
      }
      const isValid = await verifyWebhookSignature(req, eventBody)
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid webhook signature' })
      }
    } else {
      console.warn('PayPal webhook: PAYPAL_WEBHOOK_ID not set — signature verification skipped')
    }

    console.log('PayPal webhook received:', {
      id: eventBody.id,
      eventType: eventBody.event_type,
      resourceId: eventBody.resource?.id,
    })

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('paypal webhook exception:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
