import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../hooks/useToast.js'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { LAUNCH_DEAL, PLANS_LIST } from '../config/plans.js'
import styles from './Pricing.module.css'

const FAQS = [
  { q: 'Does SafeLaunch take a revenue cut?', a: 'No. SafeLaunch is subscription-only. We never touch your revenue, in-app purchases, or user payments. What you earn is 100% yours.' },
  { q: 'What happens if my app is blocked?', a: "You receive a full scan report detailing exactly what was found, why it matters, and how to fix it. Once fixed, you can resubmit for a free rescan." },
  { q: 'Is the 14-day trial really free?', a: 'Yes — no credit card required for the trial. You only pay if you decide to continue after 14 days.' },
  { q: 'Which frameworks are supported?', a: 'React, Vue, Svelte, SvelteKit, Next.js (static export), Astro, Angular, and vanilla HTML/JS/CSS. Auto-detected from your repo.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your dashboard. Your apps remain listed until the end of your billing period, then unpublish automatically.' },
  { q: 'Do users need accounts to install apps?', a: 'No. Store visitors can browse and install any app without signing up. Only developers need a SafeLaunch publisher account.' },
]

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null)
  const { user } = useAuth()
  const { ToastContainer } = useToast()

  // Check auth from Firebase user OR localStorage fallback (must have email)
  const slAuth = !user && localStorage.getItem('sl_auth')
  const parsedAuth = slAuth ? JSON.parse(slAuth) : {}
  const isLoggedIn = !!user || !!(slAuth && parsedAuth.email)
  const billingStatus = localStorage.getItem('sl_billing_status')
  const alreadyPaid = billingStatus === 'active'

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
              ) : (
                <Link
                  to={isLoggedIn ? '/payment' : '/signin?tab=register&redirect=/payment'}
                  className={`btn btn-primary btn-lg ${styles.launchCta}`}
                >
                  Claim Your Spot
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
        </div>

        {/* Plan cards */}
        <div className={styles.plans}>
          {PLANS_LIST.map(plan => (
            <div key={plan.name} className={`${styles.planCard} ${plan.featured ? styles.featured : ''}`}>
              {plan.featured && <div className={styles.popularRibbon}>MOST POPULAR</div>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{plan.price}</span>
                <span className={styles.per}>/mo</span>
              </div>
              <p className={styles.planDesc}>{plan.desc}</p>
              <div className={styles.trialBadge}>14-day free trial</div>
              <Link
                to={isLoggedIn
                  ? `/payment?plan=${plan.slug}`
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
            <Link to={isLoggedIn ? '/payment?plan=creator-pro' : '/signin?tab=register&redirect=/pricing'} className="btn btn-primary btn-lg">Start Publishing →</Link>
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
