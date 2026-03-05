import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>Safe<span>Launch</span></Link>
          <p className={styles.tagline}>The trusted PWA app store with AI-powered safety scanning.</p>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <h4>Product</h4>
            <Link to="/store">Browse Store</Link>
            <Link to="/publish">Publish App</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/safety">Safety Pipeline</Link>
          </div>
          <div className={styles.col}>
            <h4>Resources</h4>
            <Link to="/tutorial">PWA Tutorial (with AI)</Link>
            <Link to="/app-store">Install App</Link>
            <Link to="/how-safety-works">How Safety Works</Link>
            <Link to="/support">AI Support</Link>
          </div>
          <div className={styles.col}>
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/developer-agreement">Developer Agreement</Link>
            <Link to="/dmca">DMCA / Content Removal</Link>
            <Link to="/management-login">Management Login</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.copy}>&copy; 2026 SafeLaunch. Applications are submitted by independent developers. The platform provides hosting and discovery services only and does not create or guarantee third-party applications.</div>
      </div>
    </footer>
  )
}
