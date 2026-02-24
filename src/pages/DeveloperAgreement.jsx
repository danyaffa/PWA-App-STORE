import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../hooks/useToast.js'
import styles from './Legal.module.css'

const AGREEMENT_VERSION = '1.0'

export default function DeveloperAgreement() {
  const [accepted, setAccepted] = useState(false)
  const [certify, setCertify]   = useState(false)
  const [busy, setBusy]         = useState(false)
  const { user, isConfigured }  = useAuth()
  const { toast, ToastContainer } = useToast()
  const navigate = useNavigate()

  async function handleAccept() {
    if (!accepted || !certify) return
    setBusy(true)

    // Store acceptance proof in Firestore if configured
    if (isConfigured && user) {
      try {
        const { db } = await import('../lib/firebase.js')
        const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
        if (db) {
          await addDoc(collection(db, 'agreements'), {
            uid: user.uid,
            agreementType: 'developer',
            version: AGREEMENT_VERSION,
            acceptedAt: serverTimestamp(),
            userAgent: navigator.userAgent,
          })
        }
      } catch (err) {
        console.error('Failed to store agreement:', err)
      }
    }

    // Also store in localStorage for quick checks
    localStorage.setItem('sl_dev_agreement', JSON.stringify({
      version: AGREEMENT_VERSION,
      acceptedAt: new Date().toISOString(),
    }))

    setBusy(false)
    toast('Agreement accepted')
    navigate('/publish')
  }

  return (
    <>
      <SEO
        title="Developer Agreement — SafeLaunch"
        description="SafeLaunch Developer Agreement. Terms and responsibilities for app publishers."
        canonical="https://agentslock.com/developer-agreement"
      />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <h1 className={`display ${styles.title}`}>Developer Agreement</h1>
        <p className={styles.updated}>Version {AGREEMENT_VERSION} — Last updated: February 24, 2026</p>

        <section className={styles.section}>
          <h2>1. Developer Responsibility and Liability</h2>
          <p>By uploading or publishing an application on this platform, you confirm that:</p>
          <ul>
            <li>You are solely responsible for the content, functionality, legality, and security of your application.</li>
            <li>Your application does not violate any applicable laws or third-party rights.</li>
            <li>You grant this platform permission to host, distribute, scan, and display your application.</li>
            <li>You agree to indemnify and hold harmless the platform, its owners, and operators from any claims, damages, or legal actions arising from your application.</li>
          </ul>
          <p>The platform acts solely as a hosting and distribution service and does not review, guarantee, or endorse submitted applications.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Content Standards</h2>
          <p>You must not submit applications that:</p>
          <ul>
            <li>Contain malware, spyware, crypto-miners, or any form of malicious code.</li>
            <li>Violate intellectual property rights of third parties.</li>
            <li>Contain or promote illegal content, services, or activities.</li>
            <li>Impersonate other developers, companies, or platforms.</li>
            <li>Collect user data without clear disclosure and consent.</li>
            <li>Contain phishing scripts, hidden redirects, or deceptive behavior.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Automated Safety Scanning</h2>
          <p>All submitted applications are subject to automated safety scanning. You acknowledge that:</p>
          <ul>
            <li>Applications may be automatically rejected, flagged, or placed under review based on scan results.</li>
            <li>You will receive a detailed report explaining any issues found.</li>
            <li>You may resubmit corrected applications at no additional cost.</li>
            <li>Repeated submissions of harmful content may result in account suspension.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Platform Rights</h2>
          <p>We reserve the right to:</p>
          <ul>
            <li>Remove or disable any application at any time, with or without notice.</li>
            <li>Modify, suspend, or terminate developer accounts that violate these terms.</li>
            <li>Update this agreement — continued use constitutes acceptance of changes.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Payments and Revenue</h2>
          <ul>
            <li>SafeLaunch does not take a revenue cut from developer earnings.</li>
            <li>Subscription fees are non-refundable except as outlined in our Terms of Service.</li>
            <li>Payment processing fees from PayPal apply as per their standard rates.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Intellectual Property</h2>
          <p>You retain all rights to your application. By publishing on SafeLaunch, you grant us a non-exclusive, worldwide, royalty-free license to host, display, distribute, and promote your application through our platform and marketing channels.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Contact</h2>
          <p>Questions about this agreement? Contact <strong>support@agentslock.com</strong>.</p>
        </section>

        {/* Acceptance checkboxes */}
        <div style={{ marginTop: 40, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 16 }}>
            <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop: 4, accentColor: 'var(--accent)' }} />
            <span style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              I have read and agree to the <strong>Developer Agreement</strong> (version {AGREEMENT_VERSION}).
            </span>
          </label>

          <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 24 }}>
            <input type="checkbox" checked={certify} onChange={e => setCertify(e.target.checked)} style={{ marginTop: 4, accentColor: 'var(--accent)' }} />
            <span style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              I certify that my application <strong>contains no malware</strong>, <strong>respects copyright</strong>, and <strong>complies with all applicable laws</strong>.
            </span>
          </label>

          <button
            className="btn btn-primary"
            disabled={!accepted || !certify || busy}
            onClick={handleAccept}
            style={{ width: '100%', justifyContent: 'center', padding: 14, opacity: (!accepted || !certify) ? 0.5 : 1 }}
          >
            {busy ? 'Saving...' : 'Accept & Continue to Publish'}
          </button>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 16, textAlign: 'center' }}>
          By accepting, your agreement is recorded and timestamped for legal compliance.
        </p>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}

export { AGREEMENT_VERSION }
