import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrustBadge } from './TrustScore.jsx'
import InstallDisclaimer from './InstallDisclaimer.jsx'
import { useInstallState } from '../hooks/useInstallState.js'
import { trackInstall } from '../lib/analytics.js'
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
  const { installed, install } = useInstallState(app.id)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const isPaid = app.price && app.price !== 'Free' && app.price !== '0'

  function handleInstallClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (installed) return
    setShowDisclaimer(true)
  }

  function handleInstallAccepted() {
    setShowDisclaimer(false)
    install()
    trackInstall(app.id)
    if (app.url) {
      window.open(app.url, '_blank', 'noopener,noreferrer')
    }
  }

  function handleInstallCancelled() {
    setShowDisclaimer(false)
  }

  return (
    <>
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
            {isPaid
              ? <span className={styles.buyTag}>Buy ${app.price}</span>
              : <span className={styles.priceTag}>Free App</span>
            }
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

          {!isPaid && (
            <button
              className={`btn ${installed ? 'btn-ghost' : 'btn-primary'} ${styles.installBtn}`}
              onClick={handleInstallClick}
            >
              {installed ? 'Installed' : 'Install App'}
            </button>
          )}
        </div>
      </Link>

      {showDisclaimer && (
        <InstallDisclaimer
          appName={app.name}
          appId={app.id}
          onAccept={handleInstallAccepted}
          onCancel={handleInstallCancelled}
        />
      )}
    </>
  )
}
