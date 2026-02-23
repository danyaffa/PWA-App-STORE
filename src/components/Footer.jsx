import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link to="/" className={styles.logo}>Safe<span>Launch</span></Link>
      <div className={styles.copy}>© 2026 SafeLaunch. The trusted PWA store.</div>
      <div className={styles.links}>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">API Docs</a>
        <a href="#">Status</a>
      </div>
    </footer>
  )
}
