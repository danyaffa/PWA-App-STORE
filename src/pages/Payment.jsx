import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../hooks/useToast.js'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import PayPalButton from '../components/PayPalButton.jsx'
import styles from './Payment.module.css'

/* ── Launch deal (first 100 users pay $2 one-time) ────────────────────── */
const LAUNCH_DEAL = {
  price: 2,
  totalSlots: 100,
  claimed: 0,   // TODO: wire to Firestore counter
  planId: 'P-2NW966480U5007726NGUP3EY',
  features: [
    'One-time $2 — no subscription needed',
    'Full 6-layer AI safety scan included',
    'Public trust report & verified badge',
    'Listed in the store permanently',
    'Upgrade to a plan anytime later',
  ],
}

/* ── Subscription plans (after launch deal sells out) ─────────────────── */
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

  const planKey = searchParams.get('plan') || ''
  const billing = searchParams.get('billing') || 'month'
  const emailParam = searchParams.get('email') || ''
  const nameParam = searchParams.get('name') || ''

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  // Get user info from auth or query params or localStorage
  const slAuth = localStorage.getItem('sl_auth')
  const parsed = slAuth ? JSON.parse(slAuth) : {}
  const userEmail = user?.email || emailParam || parsed.email || ''
  const userName = nameParam || parsed.company || user?.displayName || ''

  const billingStatus = localStorage.getItem('sl_billing_status')
  const alreadyPaid = billingStatus === 'active'

  // Determine if launch deal is still available
  const launchSpotsLeft = LAUNCH_DEAL.totalSlots - LAUNCH_DEAL.claimed
  const launchAvailable = launchSpotsLeft > 0

  // Show launch deal by default, subscription plan only if explicitly selected OR launch is sold out
  const showLaunchDeal = launchAvailable && !planKey
  const plan = !showLaunchDeal ? PLANS[planKey || 'creator-pro'] : null

  // Handle PayPal return
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      localStorage.setItem('sl_billing_status', 'active')
      localStorage.setItem('sl_plan', planKey || 'launch')
      toast('Payment successful! Welcome to SafeLaunch.')
      setTimeout(() => navigate('/publish'), 1500)
    }
    if (searchParams.get('cancelled') === 'true') {
      setError('Payment was cancelled. You can try again below.')
    }
  }, [])

  /* ── $2 Launch Deal payment success ─────────────────────────────────── */
  function handleLaunchSuccess(capture) {
    localStorage.setItem('sl_billing_status', 'active')
    localStorage.setItem('sl_plan', 'launch')
    toast('Payment successful! Your $2 spot is claimed.')
    setTimeout(() => navigate('/publish'), 1200)
  }

  function handleLaunchError() {
    setError('Payment failed. Please try again.')
  }

  /* ── Subscription plan payment ──────────────────────────────────────── */
  async function handleSubscribe() {
    setError(null)
    setBusy(true)
    try {
      const subPlanId = plan.planId[billing] || plan.planId.month
      const res = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: subPlanId,
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

  /* ── Already paid → go publish ──────────────────────────────────────── */
  if (alreadyPaid) {
    return (
      <>
        <Nav />
        <div className="page-wrap" style={{ maxWidth: 560, textAlign: 'center', padding: '80px 20px' }}>
          <h1 className="display" style={{ marginBottom: 12 }}>You're All Set!</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Your account is active. Start publishing your app now.</p>
          <Link to="/publish" className="btn btn-primary btn-lg">Start Publishing →</Link>
        </div>
        <Footer />
      </>
    )
  }

  /* ── Launch deal requires auth — redirect to register if not logged in */
  const isLoggedIn = !!user || !!(slAuth && parsed.email)

  /* ── Any payment requires auth — redirect to register if not logged in */
  if (!isLoggedIn) {
    return (
      <>
        <Nav />
        <div className="page-wrap" style={{ maxWidth: 560, textAlign: 'center', padding: '80px 20px' }}>
          <h1 className="display" style={{ marginBottom: 12 }}>Register to Claim Your Spot</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Create an account first, then complete your $2 payment.</p>
          <Link to="/signin?tab=register&redirect=/payment" className="btn btn-primary btn-lg">Register Now →</Link>
        </div>
        <Footer />
      </>
    )
  }

  if (showLaunchDeal) {
    return (
      <>
        <SEO
          title="Claim Your $2 Spot — SafeLaunch"
          description="Grand Launch Deal: Get your app listed on SafeLaunch for just $2. First 100 spots only."
          canonical="https://pwa-app-store.com/payment"
        />
        <Nav />
        <div className="page-wrap" style={{ maxWidth: 560 }}>
          <div className={styles.card}>

            <div className={styles.planBadge}>GRAND LAUNCH DEAL</div>

            <div className={styles.priceRow}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>2</span>
              <span className={styles.per}> one-time</span>
            </div>
            <p className={styles.sub}>No subscription. No recurring charges.</p>

            {/* Summary table */}
            <div className={styles.summary}>
              <div className={styles.row}>
                <span>Today's charge</span>
                <span className={styles.val}>$2.00</span>
              </div>
              <div className={styles.row}>
                <span>Recurring charges</span>
                <span className={styles.free}>None — one-time only</span>
              </div>
              <div className={styles.row}>
                <span>Spots remaining</span>
                <span className={styles.val}>{launchSpotsLeft} of {LAUNCH_DEAL.totalSlots}</span>
              </div>
            </div>

            {/* Features */}
            <ul className={styles.features}>
              {LAUNCH_DEAL.features.map(f => (
                <li key={f} className={styles.feature}>
                  <span className={styles.check}>&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className={styles.note}>
              <strong>Launch special:</strong> Pay $2 once and your app is listed permanently.
              Need more features later? Upgrade to a subscription plan anytime from your dashboard.
            </div>

            {/* Error */}
            {error && <div className={styles.error}>{error}</div>}

            {/* PayPal $2 one-time payment */}
            <div className={styles.paypalWrap}>
              <PayPalButton
                amount={LAUNCH_DEAL.price}
                description="SafeLaunch Grand Launch Deal — $2 spot"
                onSuccess={handleLaunchSuccess}
                onError={handleLaunchError}
              />
            </div>

            <p className={styles.disclaimer}>
              One-time payment of $2.00 via PayPal.<br />
              Secure payment. No subscription created.
            </p>

            <Link to="/pricing" className={styles.back}>← Back to plans</Link>
          </div>
        </div>
        <Footer />
        <ToastContainer />
      </>
    )
  }

  /* ── SUBSCRIPTION PLAN VIEW ($9/$29/$99 per month) ──────────────────── */
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

  const price = plan.price[billing] || plan.price.month

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
