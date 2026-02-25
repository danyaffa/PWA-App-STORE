import { Link } from 'react-router-dom'
import { TrustBadge } from './TrustScore.jsx'
import styles from './AppCard.module.css'

export default function AppCard({ app, onFeature }) {
  const score = app.safetyScore ?? 0
  const rating = app.averageRating ?? 4.8
  const installs = app.installs ?? '—'
  const size = app.size ?? '—'

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.icon}>{app.icon}</div>
        <div className={styles.badges}>
          {(app.badges || []).includes('trending') && <span className="badge badge-warn">🔥 Trending</span>}
          {(app.badges || []).includes('verified') && <span className="badge badge-pass">🛡 Verified</span>}
        </div>
      </div>

      <div className={styles.title}>{app.name}</div>
      <div className={styles.publisher}>by {app.developer}</div>

      <div className={styles.desc}>{app.desc}</div>

      <div className={styles.meta}>
        <div className={styles.scorePill}>
          <span className={styles.scoreNum}>{score}</span>
          <span className={styles.scoreLabel}>Verified Safe</span>
        </div>
        <span className={styles.cat}>{app.category}</span>
      </div>

      <div className={styles.bottomMeta}>
        <div className={styles.statRow}>
          <span>{installs} installs</span>
          <span>{'★'.repeat(5)} {rating}</span>
        </div>
        <div className={styles.smallBadges}>
          <span className="badge badge-pass">AI Scanned</span>
          <span className="badge badge-pass">Privacy OK</span>
        </div>
        <div className={styles.size}>{size}</div>
      </div>

      <div className={styles.actions}>
        <Link
          to={`/app/${app.id}`}
          className={`btn btn-primary btn-sm ${styles.installBtn}`}
          onClick={() => { if (onFeature) onFeature(app) }}
        >
          View App
        </Link>
      </div>
    </div>
  )
}
