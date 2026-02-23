import { Link } from 'react-router-dom'
import { useToast } from './Toast.jsx'
import styles from './AppCard.module.css'

export default function AppCard({ app }) {
  const toast = useToast()

  return (
    <div className={styles.card}>
      <div className={styles.icon}>{app.icon}</div>
      <div className={styles.name}>{app.name}</div>
      <div className={styles.desc}>{app.desc}</div>
      <div className={styles.meta}>
        <span className={`${styles.trust} ${styles[app.trust]}`}>
          <span className={styles.dot} />
          {app.trust === 'green' ? 'AI Verified Safe' : 'Under Review'}
        </span>
        <span className={styles.category}>{app.category}</span>
      </div>
      <div className={styles.stats}>
        <span className={styles.installs}>{app.installs} installs</span>
        <span>Risk: <strong style={{ color: app.score < 30 ? 'var(--accent)' : 'var(--warn)' }}>{app.score}</strong></span>
      </div>
      <div className={styles.actions}>
        <Link to={`/app/${app.id || app.name.toLowerCase().replace(/\s+/g,'-')}`} className={`btn btn-ghost btn-sm ${styles.detailBtn}`}>Details</Link>
        <button className={`btn btn-primary btn-sm ${styles.installBtn}`} onClick={() => toast(`📲 Installing ${app.name}...`)}>Install PWA</button>
      </div>
    </div>
  )
}
