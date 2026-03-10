// Vercel Serverless Function — GET /api/paypal/health
// Returns PayPal configuration status (never exposes secrets).

export default function handler(req, res) {
  const hasClientId = !!process.env.PAYPAL_CLIENT_ID
  const hasSecret = !!process.env.PAYPAL_CLIENT_SECRET
  const hasWebhookId = !!process.env.PAYPAL_WEBHOOK_ID
  const env = process.env.PAYPAL_ENV || '(not set — defaults to sandbox)'

  const ready = hasClientId && hasSecret

  return res.status(ready ? 200 : 503).json({
    ready,
    env,
    PAYPAL_CLIENT_ID: hasClientId ? '✓ set' : '✗ MISSING',
    PAYPAL_CLIENT_SECRET: hasSecret ? '✓ set' : '✗ MISSING',
    PAYPAL_WEBHOOK_ID: hasWebhookId ? '✓ set' : '✗ MISSING (optional)',
    message: ready
      ? 'PayPal is configured and ready.'
      : 'PayPal credentials are missing. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel Environment Variables.',
  })
}
