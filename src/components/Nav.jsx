import { Link, useLocation } from 'react-router-dom'
import styles from './Nav.module.css'

const LINKS = [
  { to: '/store',   label: 'Store' },
  { to: '/publish', label: 'Publish' },
  { to: '/safety',  label: 'Safety' },
  { to: '/pricing', label: 'Pricing' },
]

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        Safe<span>Launch</span>
      </Link>

      <ul className={styles.links}>
        {LINKS.map(l => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={`${styles.link} ${pathname.startsWith(l.to) ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Link to="/signin"  className="btn btn-ghost">Sign In</Link>
        <Link to="/publish" className="btn btn-primary">Submit App</Link>
      </div>
    </nav>
  )
}
