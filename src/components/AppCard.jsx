import { Link } from 'react-router-dom'
import { useToast } from './Toast.jsx'
import { useInstallState } from '../hooks/useInstallState.js'
import styles from './AppCard.module.css'

const BADGE_MAP = {
  trending:  { icon: '🔥', label: 'Trending' },
  verified:  { icon: '🛡', label: 'Verified' },
  top_rated: { icon: '⭐', label: 'Top Rated' },
  new:       { icon: '🚀', label: 'New' },
  rising:    { icon: '📈', label: 'Rising' },
}

export default function AppCard({ app, onFeature }) {
  const toast = useToast()
  const appId = app.id || app.name.toLowerCase().replace(/\s+/g, '-')
  const { installed, install } = useInstallState(appId)

  const badges = (app.badges || []).slice(0, 2)

  return (
    <div className={styles.card}>
      {/* Badges */}
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

      {/* Trust signals */}
      <div className={styles.meta}>
        <span className={`${styles.trust} ${styles[app.trust]}`}>
          <span className={styles.dot} />
          {app.trust === 'green' ? 'AI Verified Safe' : 'Under Review'}
        </span>
        <span className={styles.category}>{app.category}</span>
      </div>

      <div className={styles.stats}>
        <span className={styles.installs}>{app.installs} installs</span>
        {app.averageRating && <span>{'★'.repeat(Math.round(app.averageRating))} {app.averageRating}</span>}
        <span>Risk: <strong style={{ color: app.score < 30 ? 'var(--accent)' : 'var(--warn)' }}>{app.score}</strong></span>
      </div>

      {/* Last scanned + developer trust */}
      {app.safetyScore && (
        <div className={styles.trustBar}>
          <span>Safety: {app.safetyScore}/100</span>
          {app.developerTrust && <span>Dev Trust: {app.developerTrust}</span>}
        </div>
      )}

      {/* App details row */}
      {(app.size || app.permissions) && (
        <div className={styles.detailsRow}>
          {app.size && <span className={styles.detailChip}>{app.size}</span>}
          {app.permissions && app.permissions[0] && <span className={styles.detailChip}>{app.permissions[0]}</span>}
        </div>
      )}

      <div className={styles.actions}>
        <Link
          to={`/app/${appId}`}
          className={`btn btn-ghost btn-sm ${styles.detailBtn}`}
          onClick={() => onFeature && onFeature(app)}
        >Details</Link>
        {installed ? (
          <a href={app.url} target="_blank" rel="noopener noreferrer" className={`btn btn-sm ${styles.installBtn} ${styles.openBtn}`}>Open App</a>
        ) : (
          <button className={`btn btn-primary btn-sm ${styles.installBtn}`} onClick={() => {
            install()
            toast(`📲 ${app.name} installed successfully!`)
            if (app.url) window.open(app.url, '_blank', 'noopener,noreferrer')
          }}>Install App</button>
        )}
      </div>
    </div>
  )
}
