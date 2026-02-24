import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useToast } from '../hooks/useToast.js'
import styles from './InstallGuide.module.css'

const PLATFORMS = [
  {
    id: 'ios',
    icon: '',
    name: 'iPhone / iPad',
    steps: [
      'Open <strong>Safari</strong> (not Chrome — this only works in Safari on iOS).',
      'Go to <strong>agentslock.com/app-store</strong>.',
      'Tap the <strong>Share</strong> button (the square with an arrow) at the bottom of the screen.',
      'Scroll down and tap <strong>"Add to Home Screen"</strong>.',
      'Tap <strong>"Add"</strong> in the top-right corner.',
    ],
    result: 'The app will appear on your home screen with the SafeLaunch icon. It works like a native app — full screen, no browser bar.',
  },
  {
    id: 'android',
    icon: '',
    name: 'Android',
    steps: [
      'Open <strong>Chrome</strong> on your Android device.',
      'Go to <strong>agentslock.com/app-store</strong>.',
      'Tap the <strong>three-dot menu</strong> in the top right.',
      'Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.',
      'Tap <strong>"Install"</strong> when prompted.',
    ],
    result: 'The app will be installed and appear in your app drawer and home screen, just like a Play Store app.',
  },
  {
    id: 'mac',
    icon: '',
    name: 'Mac / Desktop',
    steps: [
      'Open <strong>Google Chrome</strong>.',
      'Go to <strong>agentslock.com/app-store</strong>.',
      'Click the <strong>install icon</strong> in the address bar (small download arrow).',
      'Click <strong>"Install"</strong>.',
    ],
    result: 'The app opens in its own window, accessible from your Applications folder and Dock.',
  },
]

export default function InstallGuide() {
  const [active, setActive] = useState('ios')
  const [promo, setPromo]   = useState('')
  const { toast, ToastContainer } = useToast()

  function handlePromo(e) {
    e.preventDefault()
    if (!promo.trim()) return
    toast('Promo code applied!')
    setPromo('')
  }

  return (
    <>
      <SEO
        title="Install SafeLaunch — PWA App Store"
        description="Install SafeLaunch on your iPhone, iPad, Android, or Mac. Works like a native app — no App Store required."
        canonical="https://agentslock.com/app-store"
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 900 }}>
        <div className="section-label">Install Guide</div>
        <h1 className="section-title display">Install SafeLaunch<br />on Any Device</h1>
        <p className="section-sub" style={{ marginBottom: 48 }}>
          SafeLaunch is a Progressive Web App (PWA). Install it directly from your browser — no App Store or Play Store needed.
        </p>

        {/* Platform tabs */}
        <div className={styles.tabs}>
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              className={`${styles.tab} ${active === p.id ? styles.active : ''}`}
              onClick={() => setActive(p.id)}
            >
              <span className={styles.tabIcon}>{p.icon}</span>
              {p.name}
            </button>
          ))}
        </div>

        {/* Steps */}
        {PLATFORMS.filter(p => p.id === active).map(p => (
          <div key={p.id} className={styles.stepsCard}>
            <ol className={styles.stepList}>
              {p.steps.map((s, i) => (
                <li key={i} className={styles.step}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: s }} />
                </li>
              ))}
            </ol>
            <div className={styles.result}>
              <span className={styles.resultIcon}>&#10003;</span>
              {p.result}
            </div>
          </div>
        ))}

        {/* Info note */}
        <div className={styles.note}>
          <strong>Important:</strong> This is a web app (PWA) — it does not come from the App Store or Google Play.
          You install it directly from the browser. If you need help, visit{' '}
          <a href="https://agentslock.com/app-store" style={{ color: 'var(--accent)' }}>agentslock.com/app-store</a>{' '}
          on your device and it will guide you through the steps.
        </div>

        {/* Promo code */}
        <div className={styles.promoSection}>
          <h3 className={styles.promoTitle}>Have a Promo Code?</h3>
          <form onSubmit={handlePromo} className={styles.promoForm}>
            <input
              className="input"
              placeholder="Enter promo code"
              value={promo}
              onChange={e => setPromo(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Apply</button>
          </form>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <Link to="/store" className="btn btn-primary btn-lg">Browse the Store</Link>
          <Link to="/publish" className="btn btn-ghost btn-lg">Publish Your App</Link>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
