import { useMemo } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './PayPalSetup.module.css'

const steps = [
  'Create or open your app in the PayPal Developer Dashboard.',
  'Copy your Sandbox or Live Client ID and Client Secret.',
  'Set VITE_PAYPAL_CLIENT_ID and VITE_PAYPAL_ENV in your frontend env.',
  'Set PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV, and PAYPAL_WEBHOOK_ID in Vercel.',
  'Create a webhook in PayPal and subscribe to checkout events (capture completed, denied, refunded).',
  'Use the webhook URL from this page and save the Webhook ID in PAYPAL_WEBHOOK_ID.',
]

const subscribedEvents = [
  'CHECKOUT.ORDER.APPROVED',
  'PAYMENT.CAPTURE.COMPLETED',
  'PAYMENT.CAPTURE.DENIED',
  'PAYMENT.CAPTURE.REFUNDED',
  'PAYMENT.CAPTURE.REVERSED',
]

export default function PayPalSetup() {
  const origin = useMemo(() => {
    if (typeof window === 'undefined') return 'https://your-domain.com'
    return window.location.origin
  }, [])

  const webhookUrl = `${origin}/api/paypal/webhook`

  return (
    <>
      <SEO
        title="PayPal Setup — SafeLaunch"
        description="Configure PayPal checkout, API secrets, and webhook verification for SafeLaunch."
        canonical="https://agentslock.com/paypal/setup"
      />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <div className={styles.header}>
          <div className="section-label">Payments</div>
          <h1 className="display">PayPal Setup & Webhook</h1>
          <p>
            Use this checklist to fully configure PayPal in SafeLaunch, including webhook signature validation
            in <code>/api/paypal/webhook</code>.
          </p>
        </div>

        <section className={styles.card}>
          <h2>1) Configuration checklist</h2>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className={styles.card}>
          <h2>2) Webhook URL</h2>
          <p>Register this URL in PayPal Developer Dashboard:</p>
          <code className={styles.code}>{webhookUrl}</code>
        </section>

        <section className={styles.card}>
          <h2>3) Recommended subscribed events</h2>
          <ul>
            {subscribedEvents.map((eventName) => (
              <li key={eventName}><code>{eventName}</code></li>
            ))}
          </ul>
        </section>

        <section className={styles.card}>
          <h2>4) Local webhook smoke test</h2>
          <p>After deployment, you can POST a test payload to confirm the endpoint is reachable:</p>
          <pre className={styles.pre}>{`curl -X POST ${webhookUrl} \\
  -H 'Content-Type: application/json' \\
  -d '{"id":"TEST-EVENT","event_type":"PAYMENT.CAPTURE.COMPLETED"}'`}</pre>
          <p className={styles.muted}>Signature verification is enforced only when PayPal headers are present.</p>
        </section>
      </div>
      <Footer />
    </>
  )
}
