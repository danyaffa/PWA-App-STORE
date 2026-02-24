import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import styles from './Nav.module.css'

const LINKS = [
  { to: '/store',     label: 'Store' },
  { to: '/publish',   label: 'Publish' },
  { to: '/safety',    label: 'Safety' },
  { to: '/pricing',   label: 'Pricing' },
  { to: '/app-store', label: 'Install' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [navSearch, setNavSearch] = useState('')

  function handleNavSearch(e) {
    if (e.key === 'Enter' && navSearch.trim()) {
      navigate(`/store?q=${encodeURIComponent(navSearch.trim())}`)
      setNavSearch('')
      setMenuOpen(false)
    }
  }

  return (
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

      {/* Central search bar — dominant element like Google Play */}
      <div className={`${styles.navSearch} ${menuOpen ? styles.menuOpen : ''}`}>
        <span className={styles.navSearchIcon}>🔍</span>
        <input
          className={styles.navSearchInput}
          type="search"
          placeholder="Search apps, categories, developers..."
          value={navSearch}
          onChange={e => setNavSearch(e.target.value)}
          onKeyDown={handleNavSearch}
        />
        {navSearch && (
          <button className={styles.navSearchClear} onClick={() => setNavSearch('')} aria-label="Clear">✕</button>
        )}
      </div>

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
      </ul>

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
  )
}
