import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Legal.module.css'

export default function Cancel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const slAuth = localStorage.getItem('sl_auth')
  const parsed = slAuth ? JSON.parse(slAuth) : {}
  const isLoggedIn = !!user || !!(slAuth && parsed.email)

  const [step, setStep] = useState('info')    // info → confirm → deleting → done
  const [error, setError] = useState(null)

  async function handleDelete() {
    setStep('deleting')
    setError(null)
    try {
      // Get Firebase ID token
      const token = user ? await user.getIdToken() : null
      if (!token) throw new Error('You must be logged in to delete your account.')

      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Deletion failed')

      // Clear local data
      localStorage.removeItem('sl_auth')
      localStorage.removeItem('sl_billing_status')
      localStorage.removeItem('sl_plan')

      setStep('done')

      // Sign out and redirect after a moment
      try { await logout() } catch { /* ignore */ }
      setTimeout(() => navigate('/'), 3000)
    } catch (err) {
      console.error('Delete account error:', err)
      setError(err.message)
      setStep('confirm')
    }
  }

  return (
    <>
      <SEO
        title="Cancel & Delete Account — SafeLaunch"
        description="Cancel your SafeLaunch subscription and delete your account in one click."
        canonical="https://pwa-app-store.com/cancel"
      />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <h1 className={`display ${styles.title}`}>Cancel & Delete Account</h1>
        <p className={styles.updated}>No lock-in. No hoops. One click.</p>

        {/* ── Cancel PayPal subscription manually ──────────────── */}
        <section className={styles.section}>
          <h2>Cancel PayPal Subscription</h2>
          <p>If you only want to stop recurring payments (keep your account):</p>
          <div style={{ marginTop: 12 }}>
            <a
              href="https://www.paypal.com/myaccount/autopay/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Open PayPal Automatic Payments →
            </a>
          </div>
          <p style={{ marginTop: 12 }}>
            Find <strong>SafeLaunch</strong> in the list and click <strong>Cancel</strong>.
            Your apps stay listed until the end of your billing period.
          </p>
        </section>

        {/* ── One-click full delete ────────────────────────────── */}
        <section className={styles.section}>
          <h2>Delete My Account</h2>
          <p>
            This permanently deletes everything — your account, all published apps, scan reports,
            and cancels your PayPal subscription. <strong>This cannot be undone.</strong>
          </p>

          {!isLoggedIn ? (
            <div style={{ marginTop: 20 }}>
              <Link to="/signin?redirect=/cancel" className="btn btn-primary btn-lg">
                Log In to Delete Account
              </Link>
            </div>
          ) : step === 'info' ? (
            <button
              className="btn btn-lg"
              style={{
                marginTop: 20,
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
              }}
              onClick={() => setStep('confirm')}
            >
              Delete My Account
            </button>
          ) : step === 'confirm' ? (
            <div style={{ marginTop: 20, padding: 20, background: 'rgba(239,68,68,0.1)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)' }}>
              <p style={{ color: '#fca5a5', fontWeight: 700, marginBottom: 12 }}>
                Are you sure? This will permanently delete:
              </p>
              <ul style={{ color: 'var(--muted)', fontSize: '0.9rem', paddingLeft: 20, marginBottom: 16 }}>
                <li>All your published apps</li>
                <li>All scan reports and trust data</li>
                <li>Your account and profile</li>
                <li>Your PayPal subscription (if active)</li>
              </ul>
              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>
              )}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-lg"
                  style={{ background: '#ef4444', color: '#fff', border: 'none', fontWeight: 700 }}
                  onClick={handleDelete}
                >
                  Yes, Delete Everything
                </button>
                <button
                  className="btn btn-ghost btn-lg"
                  onClick={() => { setStep('info'); setError(null) }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : step === 'deleting' ? (
            <div style={{ marginTop: 20, color: 'var(--muted)' }}>
              Deleting your account... please wait.
            </div>
          ) : step === 'done' ? (
            <div style={{ marginTop: 20, padding: 20, background: 'rgba(74,222,128,0.1)', borderRadius: 12, border: '1px solid rgba(74,222,128,0.3)' }}>
              <p style={{ color: '#4ade80', fontWeight: 700, marginBottom: 8 }}>
                Account deleted successfully.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                All your data has been removed. You will be redirected to the home page shortly.
              </p>
            </div>
          ) : null}
        </section>

        {/* ── $2 launch deal note ──────────────────────────────── */}
        <section className={styles.section}>
          <h2>$2 Launch Deal?</h2>
          <p>
            The $2 deal is a one-time payment — no subscription to cancel.
            Use "Delete My Account" above if you want to remove your account entirely.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Need Help?</h2>
          <p>
            Having trouble? Visit our <Link to="/support">AI Support</Link> page.
          </p>
        </section>
      </div>
      <Footer />
    </>
  )
}
