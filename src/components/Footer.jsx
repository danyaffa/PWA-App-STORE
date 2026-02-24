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
            <Link to="/app-store">Install Guide</Link>
            <Link to="/support">Help Center</Link>
            <a href="#">API Docs</a>
            <a href="#">Status</a>
          </div>
          <div className={styles.col}>
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/developer-agreement">Developer Agreement</Link>
            <Link to="/dmca">DMCA / Content Removal</Link>
            <Link to="/support">Contact</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.copy}>&copy; 2026 SafeLaunch. The trusted PWA store.</div>
      </div>
    </footer>
  )
}
