import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../hooks/useToast.js'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Payment.module.css'

const PLANS = {
  'creator-lite': {
    name: 'Creator Lite',
    price: { month: 9, year: 7 },
    planId: { month: 'P-3DN45660DX3919046NGUPOHA', year: 'P-3DN45660DX3919046NGUPOHA' },
    trial: 14,
    features: [
      '1 published app',
      '1 active version slot',
      'Full 6-layer safety scan',
      'Public trust report',
    ],
  },
  'creator-pro': {
    name: 'Creator Pro',
    price: { month: 29, year: 23 },
    planId: { month: 'P-2JS06822B95082352NGUPR5Q', year: 'P-2JS06822B95082352NGUPR5Q' },
    trial: 14,
    features: [
      'Up to 5 published apps',
      '3 active version slots / app',
      'Full 6-layer safety scan',
      'Public trust report',
      'Dynamic sandbox (DAST)',
      'Continuous monitoring',
    ],
  },
  'business': {
    name: 'Business',
    price: { month: 99, year: 79 },
    planId: { month: 'P-3J957709U19092246NGTH2PY', year: 'P-3J957709U19092246NGTH2PY' },
    trial: 14,
    features: [
      'Up to 20 published apps',
      'Unlimited version slots',
      'Full 6-layer safety scan',
      'Public trust report',
      'Dynamic sandbox (DAST)',
      'Continuous monitoring',
      'Priority review queue',
      'Team seats (up to 20)',
      'SLA + compliance reports',
    ],
  },
}

export default function Payment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast, ToastContainer } = useToast()

  const planKey = searchParams.get('plan') || 'creator-pro'
  const billing = searchParams.get('billing') || 'month'
  const emailParam = searchParams.get('email') || ''
  const nameParam = searchParams.get('name') || ''

  const plan = PLANS[planKey]
  const price = plan ? plan.price[billing] || plan.price.month : 0
  const planId = plan ? plan.planId[billing] || plan.planId.month : ''

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  // Get user info from auth or query params or localStorage
  const slAuth = localStorage.getItem('sl_auth')
  const parsed = slAuth ? JSON.parse(slAuth) : {}
  const userEmail = user?.email || emailParam || parsed.email || ''
  const userName = nameParam || parsed.company || user?.displayName || ''

  // Handle PayPal return
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      localStorage.setItem('sl_billing_status', 'active')
      localStorage.setItem('sl_plan', planKey)
      toast('Subscription activated! Welcome to SafeLaunch.')
      setTimeout(() => navigate('/publish'), 1500)
    }
    if (searchParams.get('cancelled') === 'true') {
      setError('Payment was cancelled. You can try again below.')
    }
  }, [])

  async function handleSubscribe() {
    setError(null)
    setBusy(true)
    try {
      const res = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          email: userEmail,
          name: userName,
          returnUrl: `${window.location.origin}/payment?plan=${planKey}&billing=${billing}&success=true`,
          cancelUrl: `${window.location.origin}/payment?plan=${planKey}&billing=${billing}&cancelled=true`,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Server returned ${res.status}`)
      }

      const data = await res.json()

      if (data.approveUrl) {
        window.location.href = data.approveUrl
      } else {
        throw new Error('No approval URL returned from PayPal')
      }
    } catch (err) {
      console.error('Subscription error:', err)
      setError(err.message || 'Failed to start subscription. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (!plan) {
    return (
      <>
        <Nav />
        <div className="page-wrap" style={{ maxWidth: 600, textAlign: 'center', padding: '80px 20px' }}>
          <h1>Plan not found</h1>
          <p style={{ color: 'var(--muted)', marginTop: 12 }}>The selected plan does not exist.</p>
          <Link to="/pricing" className="btn btn-primary" style={{ marginTop: 24 }}>Back to Plans</Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SEO
        title={`${plan.name} — SafeLaunch Payment`}
        description={`Subscribe to ${plan.name} plan on SafeLaunch.`}
        canonical="https://pwa-app-store.com/payment"
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 560 }}>
        <div className={styles.card}>

          {/* Plan header */}
          <div className={styles.planBadge}>{plan.name}</div>

          <div className={styles.priceRow}>
            <span className={styles.currency}>$</span>
            <span className={styles.amount}>{price}.00</span>
            <span className={styles.per}> / month</span>
          </div>
          <p className={styles.sub}>after {plan.trial}-day free trial</p>

          {/* Summary table */}
          <div className={styles.summary}>
            <div className={styles.row}>
              <span>Today's charge</span>
              <span className={styles.free}>$0.00 (free trial)</span>
            </div>
            <div className={styles.row}>
              <span>Free trial period</span>
              <span className={styles.val}>{plan.trial} days</span>
            </div>
            <div className={styles.rowBold}>
              <span>After trial</span>
              <span className={styles.val}>${price}.00/mo</span>
            </div>
          </div>

          {/* Features */}
          <ul className={styles.features}>
            {plan.features.map(f => (
              <li key={f} className={styles.feature}>
                <span className={styles.check}>&#10003;</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Plan note */}
          <div className={styles.note}>
            <strong>Plan includes:</strong> {plan.features[0]?.toLowerCase()}.
            Need more? You can upgrade your plan at any time from your dashboard.
          </div>

          {/* Error */}
          {error && <div className={styles.error}>{error}</div>}

          {/* PayPal Subscribe Button */}
          <button
            className={`btn btn-primary btn-lg ${styles.cta}`}
            onClick={handleSubscribe}
            disabled={busy}
          >
            {busy ? 'Connecting to PayPal...' : 'Start Free Trial — Pay with PayPal'}
          </button>

          <p className={styles.disclaimer}>
            You won't be charged until after your {plan.trial}-day free trial.<br />
            Secure payment via PayPal. Cancel anytime.
          </p>

          <Link to="/pricing" className={styles.back}>← Back to plans</Link>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
