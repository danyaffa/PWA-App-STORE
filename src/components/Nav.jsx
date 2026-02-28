import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { usePWAInstall } from '../hooks/usePWAInstall.js'
import IOSInstallGuide from './IOSInstallGuide.jsx'
import styles from './Nav.module.css'

const LINKS = [
  { to: '/store',     label: 'Store' },
  { to: '/publish',   label: 'Publish' },
  { to: '/safety',    label: 'Safety' },
  { to: '/pricing',   label: 'Pricing' },
  { to: '/tutorial',  label: 'Tutorial' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [navSearch, setNavSearch] = useState('')
  const {
    install,
    installed,
    isStandalone,
    showIOSGuide,
    dismissIOSGuide,
  } = usePWAInstall()

  function handleNavSearch(e) {
    if (e.key === 'Enter' && navSearch.trim()) {
      navigate(`/store?q=${encodeURIComponent(navSearch.trim())}`)
      setNavSearch('')
      setMenuOpen(false)
    }
  }

  async function handleInstallClick() {
    setMenuOpen(false)
    if (installed || isStandalone) return
    await install()
  }

  return (
    <>
      <nav className={styles.nav}>
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

        <ul className={`${styles.links} ${menuOpen ? styles.menuOpen : ''}`}>
          {LINKS.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`${styles.link} ${pathname.startsWith(l.to) ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          {!installed && !isStandalone && (
            <li>
              <button className={`${styles.link} ${styles.installLink}`} onClick={handleInstallClick}>
                Install
              </button>
            </li>
          )}
        </ul>

        <div className={`${styles.navSearch} ${menuOpen ? styles.menuOpen : ''}`}>
          <span className={styles.navSearchIcon}>🔍</span>
          <input
            className={styles.navSearchInput}
            type="search"
            placeholder="Search apps..."
            value={navSearch}
            onChange={e => setNavSearch(e.target.value)}
            onKeyDown={handleNavSearch}
          />
        </div>

        <div className={`${styles.actions} ${menuOpen ? styles.menuOpen : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/publish"   className="btn btn-primary" onClick={() => setMenuOpen(false)}>Submit App</Link>
            </>
          ) : (
            <>
              <Link to="/signin"  className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/publish" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Submit App</Link>
            </>
          )}
        </div>
      </nav>

      {showIOSGuide && <IOSInstallGuide onDismiss={dismissIOSGuide} />}
    </>
  )
}
