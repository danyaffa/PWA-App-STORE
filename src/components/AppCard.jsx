import { Link } from 'react-router-dom'
import { TrustBadge } from './TrustScore.jsx'
import styles from './AppCard.module.css'

const BADGE_MAP = {
  trending:  { icon: '🔥', label: 'Trending' },
  verified:  { icon: '🛡', label: 'Verified' },
  top_rated: { icon: '⭐', label: 'Top Rated' },
  new:       { icon: '🚀', label: 'New' },
  rising:    { icon: '📈', label: 'Rising' },
}

export default function AppCard({ app }) {
  const badges = (app.badges || []).slice(0, 2)

  return (
    <Link to={`/app/${app.id}`} className={styles.cardLink} aria-label={`Open ${app.name}`}>
      <div className={styles.card}>
        {badges.length > 0 && (
          <div className={styles.badges}>
            {badges.map(b => {
              const badge = BADGE_MAP[b]
              return badge ? <span key={b} className={styles.badge}>{badge.icon} {badge.label}</span> : null
            })}
          </div>
        )}

        <div className={styles.icon}>{app.icon}</div>
        <div className={styles.nameRow}>
          <div className={styles.name}>{app.name}</div>
          <span className={styles.priceTag}>{app.price === 'Free' || !app.price ? 'Free App' : `$${app.price}`}</span>
        </div>
        {app.developer && <div className={styles.developer}>by {app.developer}</div>}
        <div className={styles.desc}>{app.desc}</div>

        <div className={styles.trustRow}>
          <TrustBadge score={app.safetyScore || 0} />
          <span className={styles.category}>{app.category}</span>
        </div>

        <div className={styles.stats}>
          <span className={styles.installs}>{app.installs} installs</span>
          {app.averageRating > 0 && <span>{'★'.repeat(Math.round(app.averageRating))} {app.averageRating}</span>}
        </div>

        <div className={styles.verChips}>
          {(app.safetyScore || 0) >= 85 && <span className={styles.verChip}>AI Scanned</span>}
          {(app.safetyScore || 0) >= 80 && <span className={styles.verChip}>Privacy OK</span>}
          {app.size && <span className={styles.detailChip}>{app.size}</span>}
        </div>
      </div>
    </Link>
  )
}
