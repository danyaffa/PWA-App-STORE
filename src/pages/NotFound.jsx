import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className="orb" style={{width:400,height:400,background:'rgba(0,229,160,.06)',top:-100,left:-100}} />
      <div className="orb" style={{width:300,height:300,background:'rgba(124,111,255,.06)',bottom:-100,right:-50}} />

      <Link to="/" className={styles.logo}>Safe<span>Launch</span></Link>
      <div className={styles.code}>404</div>
      <div className={styles.icon}>🔍</div>
      <h1 className={`display ${styles.title}`}>Page Not Found</h1>
      <p className={styles.sub}>This page doesn't exist — or it may have been moved.</p>
      <div className={styles.actions}>
        <Link to="/"       className="btn btn-primary btn-lg">← Back Home</Link>
        <Link to="/store"  className="btn btn-ghost">Browse Store</Link>
        <Link to="/publish"className="btn btn-ghost">Submit App</Link>
      </div>
      <div className={styles.mono}>Error 404 · SafeLaunch · page not found</div>
    </div>
  )
}
