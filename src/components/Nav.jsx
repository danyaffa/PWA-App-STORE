import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { usePWAInstall } from '../hooks/usePWAInstall.js'
import { useToast } from '../hooks/useToast.js'
import IOSInstallGuide from './IOSInstallGuide.jsx'
import styles from './Nav.module.css'

const STORE_LINKS = [
  { to: '/store', label: 'Store' },
]

const PUBLISHER_LINKS = [
  { to: '/publish',  label: 'Publish' },
  { to: '/safety',   label: 'Safety' },
  { to: '/pricing',  label: 'Pricing' },
  { to: '/tutorial', label: 'Tutorial' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const { toast, ToastContainer } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const {
    canInstall,
    install,
    installed,
    isStandalone,
    showIOSGuide,
    dismissIOSGuide,
  } = usePWAInstall()

  async function handleInstallClick() {
    setMenuOpen(false)
    if (installed || isStandalone) return
    const result = await install()
    if (!result && !canInstall) {
      toast('To install: tap your browser menu → "Add to Home Screen" or "Install App"')
    }
  }

  return (
    <>
      <header className={styles.header}>
        {/* ── Row 1 – Store & Install ─────────────────────────── */}
        <nav className={styles.primaryRow}>
          <Link to="/" className={styles.logo}>
            Safe<span>Launch</span>
          </Link>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

          <ul className={`${styles.primaryLinks} ${menuOpen ? styles.menuOpen : ''}`}>
            {STORE_LINKS.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`${styles.primaryLink} ${pathname.startsWith(l.to) ? styles.active : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {!installed && !isStandalone && (
              <li>
                <button
                  className={`${styles.primaryLink} ${styles.installLink}`}
                  onClick={handleInstallClick}
                >
                  Install App
                </button>
              </li>
            )}
          </ul>

        </nav>

        {/* ── Row 2 – Publisher Tools ─────────────────────────── */}
        <div className={`${styles.secondaryRow} ${menuOpen ? styles.menuOpen : ''}`}>
          <span className={styles.secondaryLabel}>For Developers</span>
          <ul className={styles.secondaryLinks}>
            {PUBLISHER_LINKS.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`${styles.secondaryLink} ${pathname.startsWith(l.to) ? styles.secondaryActive : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/publish" className={`btn btn-primary btn-sm ${styles.submitBtn}`} onClick={() => setMenuOpen(false)}>
            Submit App
          </Link>
          <div className={`${styles.actions} ${menuOpen ? styles.menuOpen : ''}`}>
            {user ? (
              <Link to="/dashboard" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            ) : (
              <Link to="/signin" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      </header>

      {showIOSGuide && <IOSInstallGuide onDismiss={dismissIOSGuide} />}
      <ToastContainer />
    </>
  )
}
