import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePWAInstall } from '../hooks/usePWAInstall.js'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const { install, installed, isStandalone } = usePWAInstall()

  async function handleInstallClick() {
    setMenuOpen(false)
    if (installed || isStandalone) return
    await install()
  }

  return (
    <header className={styles.header}>
      {/* ── Row 1 – Store & Install ─────────────────────────── */}
      <nav className={styles.primaryRow}>
        <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
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

          {/* Mobile-only: auth + dev links inside menu overlay */}
          <li className={styles.mobileAuthGroup}>
            <Link to="/signin" className={`btn btn-ghost btn-sm ${styles.mobileAuthBtn}`} onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signin?tab=register" className={`btn btn-primary btn-sm ${styles.mobileAuthBtn}`} onClick={() => setMenuOpen(false)}>Register</Link>
          </li>

          <li className={styles.mobileDevLinks}>
            <span className={styles.mobileDevLabel}>For Developers</span>
            <div className={styles.mobileDevGrid}>
              {PUBLISHER_LINKS.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`${styles.mobileDevLink} ${pathname.startsWith(l.to) ? styles.secondaryActive : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <Link to="/publish" className={`btn btn-primary ${styles.mobileSubmitBtn}`} onClick={() => setMenuOpen(false)}>
              Submit App
            </Link>
          </li>
        </ul>

        {/* Desktop auth buttons */}
        <div className={styles.authButtons}>
          <Link to="/signin" className={`btn btn-ghost btn-sm ${styles.authBtn}`}>Login</Link>
          <Link to="/signin?tab=register" className={`btn btn-primary btn-sm ${styles.authBtn} ${styles.registerBtn}`}>Register</Link>
        </div>
      </nav>

      {/* ── Row 2 – Publisher Tools (desktop only) ──────────── */}
      <div className={styles.secondaryRow}>
        <span className={styles.secondaryLabel}>For Developers</span>
        <ul className={styles.secondaryLinks}>
          {PUBLISHER_LINKS.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`${styles.secondaryLink} ${pathname.startsWith(l.to) ? styles.secondaryActive : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/publish" className={`btn btn-primary btn-sm ${styles.submitBtn}`}>
          Submit App
        </Link>
      </div>
    </header>
  )
}
