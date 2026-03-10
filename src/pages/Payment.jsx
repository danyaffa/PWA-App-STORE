import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Payment.module.css'

const MONTHLY_PRICE = 18.0
const TRIAL_DAYS = 14

const FEATURES = [
  '5 business profiles (apps)',
  '5 website promotions',
  'AI-ready business profile builder',
  'Push to ChatGPT, Gemini, Copilot, Perplexity & more',
  'Google & Bing SEO optimisation',
  'AI readiness score & dashboard',
  'One-click boost & re-crawl signals',
  'Submission checklist for all platforms',
  'StickAInote rich text editor',
  'AI-powered FAQ assistant',
  'PWA \u2013 install as a native app',
  'Priority support & updates',
]

export default function Payment() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''
  const ref = searchParams.get('ref') || ''

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handlePayPalCheckout() {
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          fullName: name,
          referralCode: ref,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        throw new Error('No approval URL returned from PayPal')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <SEO
        title="Start Your Free Trial \u2014 GetYourBizOnAI"
        description="Review your plan details and start your 14-day free trial with PayPal."
        canonical="https://agentslock.com/payment"
      />
      <Nav />
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.trialRibbon}>14-DAY FREE TRIAL</div>

          <div className={styles.planName}>GROWTH PLAN</div>
          <h1 className={styles.planTitle}>GetYourBizOnAI Growth Plan</h1>
          <p className={styles.planSubtitle}>
            5 business profiles + 5 website promotions &mdash; full access
          </p>

          {/* Trial callout */}
          <div className={styles.trialCallout}>
            <div className={styles.trialCalloutTitle}>Start with 14 days FREE</div>
            <div className={styles.trialCalloutSub}>
              No charge today. Cancel anytime during your trial.
            </div>
          </div>

          {/* Price */}
          <div className={styles.priceRow}>
            <span className={styles.currency}>$</span>
            <span className={styles.amount}>{MONTHLY_PRICE.toFixed(2)}</span>
            <span className={styles.per}>/ month</span>
          </div>
          <div className={styles.priceNote}>after {TRIAL_DAYS}-day free trial</div>

          {/* Summary table */}
          <table className={styles.summaryTable}>
            <tbody>
              <tr>
                <td>Today's charge</td>
                <td className={styles.freeTag}>$0.00 (free trial)</td>
              </tr>
              <tr>
                <td>Free trial period</td>
                <td>{TRIAL_DAYS} days</td>
              </tr>
              <tr>
                <td>Business profiles</td>
                <td>5</td>
              </tr>
              <tr>
                <td>Website promotions</td>
                <td>5</td>
              </tr>
              <tr>
                <td className={styles.summaryHighlight}>After trial</td>
                <td className={styles.summaryHighlight}>${MONTHLY_PRICE.toFixed(2)}/mo</td>
              </tr>
            </tbody>
          </table>

          {/* Features */}
          <ul className={styles.features}>
            {FEATURES.map((f) => (
              <li key={f} className={styles.featureItem}>
                <span className={styles.featureCheck}>&#10003;</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Upgrade notice */}
          <div className={styles.upgradeNotice}>
            <strong>Plan includes:</strong> 5 business profiles (apps) + 5 website promotions.
            Need more? You can upgrade your plan at any time from your dashboard
            to add additional profiles and promotions as your business grows.
          </div>

          {/* Error */}
          {error && <div className={styles.errorBox}>{error}</div>}

          {/* PayPal button */}
          <button
            className={styles.paypalBtn}
            onClick={handlePayPalCheckout}
            disabled={busy}
          >
            {busy ? 'Connecting to PayPal...' : 'Start Free Trial \u2014 Pay with PayPal'}
          </button>

          <p className={styles.footerText}>
            You won't be charged until after your {TRIAL_DAYS}-day free trial.<br />
            Secure payment via PayPal. Cancel anytime.
          </p>

          <Link className={styles.backLink} to="/pricing">
            &larr; Back to plans
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
