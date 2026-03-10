import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../hooks/useToast.js'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import PayPalButton from '../components/PayPalButton.jsx'
import styles from './Pricing.module.css'

const PAYPAL_ENV = import.meta.env.VITE_PAYPAL_ENV || 'sandbox'
const PAYPAL_BASE = PAYPAL_ENV === 'live'
  ? 'https://www.paypal.com'
  : 'https://www.sandbox.paypal.com'

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

const PLANS = [
  {
    name: 'Creator Lite',
    slug: 'creator-lite',
    price: { month: 9, year: 7 },
    desc: 'Perfect for indie devs shipping a single app.',
    cta: 'Start 14-Day Free Trial',
    featured: false,
    planId: 'P-3DN45660DX3919046NGUPOHA',
    features: [
      { label: '1 published app',             included: true },
      { label: '1 active version slot',       included: true },
      { label: 'Full 6-layer safety scan',    included: true },
      { label: 'Public trust report',         included: true },
      { label: 'Dynamic sandbox (DAST)',       included: false },
      { label: 'Continuous monitoring',       included: false },
      { label: 'Priority review queue',       included: false },
      { label: 'Team seats',                  included: false },
      { label: 'SLA / compliance reports',    included: false },
    ],
  },
  {
    name: 'Creator Pro',
    slug: 'creator-pro',
    price: { month: 29, year: 23 },
    desc: 'For studios shipping multiple apps with full pipeline access.',
    cta: 'Start 14-Day Free Trial',
    featured: true,
    planId: 'P-2JS06822B95082352NGUPR5Q',
    features: [
      { label: 'Up to 5 published apps',      included: true },
      { label: '3 active version slots / app',included: true },
      { label: 'Full 6-layer safety scan',    included: true },
      { label: 'Public trust report',         included: true },
      { label: 'Dynamic sandbox (DAST)',       included: true },
      { label: 'Continuous monitoring',       included: true },
      { label: 'Priority review queue',       included: false },
      { label: 'Team seats',                  included: false },
      { label: 'SLA / compliance reports',    included: false },
    ],
  },
  {
    name: 'Business',
    slug: 'business',
    price: { month: 99, year: 79 },
    desc: 'For enterprises needing unlimited apps, team seats, and compliance.',
    cta: 'Start 14-Day Free Trial',
    featured: false,
    planId: 'P-3J957709U19092246NGTH2PY',
    features: [
      { label: 'Up to 20 published apps',      included: true },
      { label: 'Unlimited version slots',     included: true },
      { label: 'Full 6-layer safety scan',    included: true },
      { label: 'Public trust report',         included: true },
      { label: 'Dynamic sandbox (DAST)',       included: true },
      { label: 'Continuous monitoring',       included: true },
      { label: 'Priority review queue',       included: true },
      { label: 'Team seats (up to 20)',       included: true },
      { label: 'SLA + compliance reports',    included: true },
    ],
  },
]

const FAQS = [
  { q: 'Does SafeLaunch take a revenue cut?', a: 'No. SafeLaunch is subscription-only. We never touch your revenue, in-app purchases, or user payments. What you earn is 100% yours.' },
  { q: 'What happens if my app is blocked?', a: "You receive a full scan report detailing exactly what was found, why it matters, and how to fix it. Once fixed, you can resubmit for a free rescan." },
  { q: 'Is the 14-day trial really free?', a: 'Yes — no credit card required for the trial. You only pay if you decide to continue after 14 days.' },
  { q: 'Which frameworks are supported?', a: 'React, Vue, Svelte, SvelteKit, Next.js (static export), Astro, Angular, and vanilla HTML/JS/CSS. Auto-detected from your repo.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your dashboard. Your apps remain listed until the end of your billing period, then unpublish automatically.' },
  { q: 'Do users need accounts to install apps?', a: 'No. Store visitors can browse and install any app without signing up. Only developers need a SafeLaunch publisher account.' },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast, ToastContainer } = useToast()

  // Check auth from Firebase user OR localStorage fallback
  const slAuth = !user && localStorage.getItem('sl_auth')
  const isLoggedIn = !!user || !!slAuth
  const billingStatus = localStorage.getItem('sl_billing_status')
  const alreadyPaid = billingStatus === 'active'

  function handlePaymentSuccess(capture) {
    localStorage.setItem('sl_billing_status', 'active')
    toast('Payment successful! Your $2 spot is claimed.')
    setTimeout(() => navigate('/publish'), 1200)
  }

  function handlePaymentError() {
    toast('Payment failed. Please try again.')
  }

  return (
    <>
      <SEO
        title="Pricing — SafeLaunch PWA App Store"
        description="Simple, flat pricing with no revenue cuts. Publish PWAs from $9/month. Every plan includes a full 6-layer AI safety scan."
        canonical="https://agentslock.com/pricing"
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 1100 }}>

        {/* ── Grand Launch Deal ─────────────────────────────── */}
        <div className={styles.launchDeal}>
          <div className={styles.launchRibbon}>GRAND LAUNCH DEAL</div>
          <div className={styles.launchContent}>
            <div className={styles.launchLeft}>
              <h2 className={`display ${styles.launchTitle}`}>
                First 100 Apps<br />Just <span className={styles.launchPrice}>$2</span>
              </h2>
              <p className={styles.launchSub}>
                One-time payment. No subscription required. Get your app listed in the store with a full safety scan.
              </p>
              <div className={styles.launchMeter}>
                <div className={styles.launchMeterTrack}>
                  <div
                    className={styles.launchMeterFill}
                    style={{ width: `${(LAUNCH_DEAL.claimed / LAUNCH_DEAL.totalSlots) * 100}%` }}
                  />
                </div>
                <span className={styles.launchMeterLabel}>
                  {LAUNCH_DEAL.totalSlots - LAUNCH_DEAL.claimed} of {LAUNCH_DEAL.totalSlots} spots left
                </span>
              </div>
              {alreadyPaid ? (
                <Link
                  to="/publish"
                  className={`btn btn-primary btn-lg ${styles.launchCta}`}
                >
                  Start Publishing →
                </Link>
              ) : isLoggedIn ? (
                <div className={styles.launchPaypal}>
                  <p style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: 12, fontSize: '0.95rem' }}>
                    Complete your $2 payment to claim your spot:
                  </p>
                  <PayPalButton
                    amount={LAUNCH_DEAL.price}
                    description="SafeLaunch Grand Launch Deal — $2 spot"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              ) : (
                <Link
                  to="/signin?tab=register&redirect=/pricing"
                  className={`btn btn-primary btn-lg ${styles.launchCta}`}
                >
                  Claim Your $2 Spot
                </Link>
              )}
            </div>
            <div className={styles.launchRight}>
              <ul className={styles.launchFeatures}>
                {LAUNCH_DEAL.features.map(f => (
                  <li key={f} className={styles.launchFeature}>
                    <span className={styles.launchCheck}>&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Regular Plans ───────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label">Simple Pricing</div>
          <h1 className={`section-title display ${styles.heroTitle}`}>
            No Revenue Cuts.<br />No Surprises.
          </h1>
          <p className="section-sub" style={{ maxWidth: 480, margin: '0 auto 32px' }}>
            Flat monthly fee. Cancel anytime. Every plan includes a full 6-layer AI safety scan on every submission.
          </p>

          {/* Billing toggle */}
          <div className={styles.toggle}>
            <span className={!annual ? styles.toggleActive : styles.toggleMuted}>Monthly</span>
            <button
              className={`${styles.toggleSwitch} ${annual ? styles.on : ''}`}
              onClick={() => setAnnual(a => !a)}
              aria-label="Toggle annual billing"
            >
              <span className={styles.toggleThumb} />
            </button>
            <span className={annual ? styles.toggleActive : styles.toggleMuted}>
              Annual <span className={styles.saveBadge}>Save 20%</span>
            </span>
          </div>
        </div>

        {/* Plan cards */}
        <div className={styles.plans}>
          {PLANS.map(plan => (
            <div key={plan.name} className={`${styles.planCard} ${plan.featured ? styles.featured : ''}`}>
              {plan.featured && <div className={styles.popularRibbon}>MOST POPULAR</div>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{annual ? plan.price.year : plan.price.month}</span>
                <span className={styles.per}>/mo</span>
              </div>
              {annual && (
                <div className={styles.annualNote}>billed ${plan.price.year * 12}/yr</div>
              )}
              <p className={styles.planDesc}>{plan.desc}</p>
              <div className={styles.trialBadge}>14-day free trial</div>
              <Link
                to={isLoggedIn
                  ? `/payment?plan=${plan.slug}&billing=${annual ? 'year' : 'month'}`
                  : `/signin?tab=register&redirect=/pricing`}
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'} ${styles.planCta}`}
              >
                {plan.cta}
              </Link>
              <ul className={styles.featureList}>
                {plan.features.map(f => (
                  <li key={f.label} className={`${styles.featureItem} ${f.included ? styles.included : styles.excluded}`}>
                    <span className={styles.featureIcon}>{f.included ? '✓' : '—'}</span>
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className={styles.ctaStrip}>
          <div>
            <h2 className={`display ${styles.ctaTitle}`}>Ready to Ship with Confidence?</h2>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>Join 4,200+ developers publishing PWAs people trust.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link to={isLoggedIn ? `/payment?plan=creator-pro&billing=${annual ? 'year' : 'month'}` : '/signin?tab=register&redirect=/pricing'} className="btn btn-primary btn-lg">Start Publishing →</Link>
            <Link to="/store"   className="btn btn-ghost   btn-lg">Browse Store</Link>
            <Link to="/paypal/setup" className="btn btn-ghost btn-lg">PayPal Setup Guide</Link>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.faq}>
          <h2 className={`display ${styles.faqTitle}`}>Frequently Asked Questions</h2>
          {FAQS.map((f, i) => (
            <div key={i} className={styles.faqItem} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className={styles.faqQ}>
                <span>{f.q}</span>
                <span className={`${styles.faqChevron} ${openFaq === i ? styles.open : ''}`}>›</span>
              </div>
              {openFaq === i && <p className={styles.faqA}>{f.a}</p>}
            </div>
          ))}
        </div>

      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
