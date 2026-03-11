import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Legal.module.css'

export default function Cancel() {
  const { user } = useAuth()
  const slAuth = localStorage.getItem('sl_auth')
  const parsed = slAuth ? JSON.parse(slAuth) : {}
  const isLoggedIn = !!user || !!(slAuth && parsed.email)

  return (
    <>
      <SEO
        title="Cancel Subscription — SafeLaunch"
        description="How to cancel your SafeLaunch subscription. Step-by-step instructions for PayPal and your SafeLaunch dashboard."
        canonical="https://pwa-app-store.com/cancel"
      />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <h1 className={`display ${styles.title}`}>Cancel Your Subscription</h1>
        <p className={styles.updated}>No lock-in. Cancel anytime — no questions asked.</p>

        <section className={styles.section}>
          <h2>How Cancellation Works</h2>
          <p>
            When you cancel, your apps remain published and your account stays active until the
            end of your current billing period. After that, your apps are automatically unpublished
            from the store. You can re-subscribe and republish at any time.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Option 1 — Cancel from Your SafeLaunch Dashboard</h2>
          <p>The easiest way to cancel is directly from your account:</p>
          <ol>
            <li>Log in to your <Link to="/dashboard">SafeLaunch Dashboard</Link>.</li>
            <li>Go to <strong>Account Settings</strong> → <strong>Billing</strong>.</li>
            <li>Click <strong>Cancel Subscription</strong>.</li>
            <li>Confirm the cancellation — your access continues until the end of the billing cycle.</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2>Option 2 — Cancel Directly Through PayPal</h2>
          <p>You can also cancel your subscription from your PayPal account:</p>
          <ol>
            <li>
              Go to{' '}
              <a
                href="https://www.paypal.com/myaccount/autopay/"
                target="_blank"
                rel="noopener noreferrer"
              >
                PayPal → Automatic Payments
              </a>.
            </li>
            <li>Find <strong>SafeLaunch</strong> in the list of merchants.</li>
            <li>Click on it and select <strong>Cancel</strong>.</li>
            <li>Confirm the cancellation.</li>
          </ol>
          <p>
            If you don't see SafeLaunch listed, your subscription may already be cancelled or
            you may have paid with the one-time $2 launch deal (which has no recurring charges).
          </p>
        </section>

        <section className={styles.section}>
          <h2>Option 3 — Delete Your Account &amp; Data (Firestore)</h2>
          <p>
            If you want to completely remove your account and all associated data from our systems:
          </p>
          <ol>
            <li>First, cancel your subscription using Option 1 or 2 above.</li>
            <li>Log in to your <Link to="/dashboard">Dashboard</Link>.</li>
            <li>Go to <strong>Account Settings</strong> → <strong>Delete Account</strong>.</li>
            <li>Confirm deletion — this permanently removes your apps, scan reports, and account data from Firestore.</li>
          </ol>
          <p>
            Account deletion is irreversible. All published apps, trust reports, and scan history
            will be permanently removed.
          </p>
        </section>

        <section className={styles.section}>
          <h2>What About the $2 Launch Deal?</h2>
          <p>
            The $2 Grand Launch Deal is a one-time payment — there is no subscription to cancel.
            Your app listing remains active permanently. If you want to remove your app from the
            store, you can unpublish it from your <Link to="/dashboard">Dashboard</Link>.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Need Help?</h2>
          <p>
            Having trouble cancelling? Visit our{' '}
            <Link to="/support">AI Support</Link> page or email us directly. We'll get it sorted
            within 24 hours.
          </p>
        </section>

        <div style={{ textAlign: 'center', marginTop: 48, marginBottom: 24 }}>
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
          ) : (
            <Link to="/signin" className="btn btn-primary btn-lg">Log In to Manage Subscription</Link>
          )}
          <div style={{ marginTop: 16 }}>
            <a
              href="https://www.paypal.com/myaccount/autopay/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-lg"
            >
              Open PayPal Automatic Payments
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
