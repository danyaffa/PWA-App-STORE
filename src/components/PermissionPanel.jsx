import styles from './PermissionPanel.module.css'

/**
 * Permission Transparency Panel
 * Clear "This app can / cannot" display — drives install confidence.
 *
 * Props:
 *   permissions — string[] from app data
 *   safetyScore — 0–100
 */

const SAFE_KEYWORDS = ['none', 'offline', 'no network', 'no tracking', 'no permissions']
const RISKY_KEYWORDS = ['camera', 'microphone', 'location', 'contacts', 'geolocation']

function classifyPermission(perm) {
  const lower = perm.toLowerCase()
  if (SAFE_KEYWORDS.some(k => lower.includes(k))) return 'safe'
  if (RISKY_KEYWORDS.some(k => lower.includes(k))) return 'sensitive'
  return 'normal'
}

export default function PermissionPanel({ permissions = [], safetyScore = 0 }) {
  const hasPerms = permissions.length > 0
  const allSafe = permissions.every(p => classifyPermission(p) === 'safe')

  // Auto-generate "cannot" list based on what's NOT in permissions
  const cannotDo = []
  const permStr = permissions.join(' ').toLowerCase()
  if (!permStr.includes('internet') && !permStr.includes('network') && !permStr.includes('api'))
    cannotDo.push('Access the internet')
  if (!permStr.includes('camera'))
    cannotDo.push('Use your camera')
  if (!permStr.includes('location') && !permStr.includes('geolocation'))
    cannotDo.push('Track your location')
  if (!permStr.includes('contact'))
    cannotDo.push('Read your contacts')
  if (!permStr.includes('microphone') && !permStr.includes('mic'))
    cannotDo.push('Access microphone')

  // Privacy score derived from permissions + safety
  const privacyScore = computePrivacyScore(permissions, safetyScore)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>
            {privacyScore >= 80 ? '\u2713' : privacyScore >= 50 ? '\u25B2' : '\u2717'}
          </span>
          <span className={styles.headerTitle}>Privacy & Permissions</span>
        </div>
        <span className={styles.privacyScore} style={{ color: privacyScore >= 80 ? 'var(--accent)' : privacyScore >= 50 ? 'var(--warn)' : 'var(--danger)' }}>
          Privacy Score: {privacyScore}/100
        </span>
      </div>

      {/* What the app CAN do */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>This app can:</div>
        {hasPerms && !allSafe ? (
          permissions.map((p, i) => {
            const cls = classifyPermission(p)
            return (
              <div key={i} className={styles.row}>
                <span className={`${styles.icon} ${styles[cls]}`}>
                  {cls === 'safe' ? '\u2713' : cls === 'sensitive' ? '\u25B2' : '\u2022'}
                </span>
                <span>{p}</span>
              </div>
            )
          })
        ) : (
          <div className={styles.row}>
            <span className={`${styles.icon} ${styles.safe}`}>{'\u2713'}</span>
            <span>Store local data only</span>
          </div>
        )}
      </div>

      {/* What the app CANNOT do */}
      {cannotDo.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>This app cannot:</div>
          {cannotDo.map((item, i) => (
            <div key={i} className={styles.row}>
              <span className={`${styles.icon} ${styles.blocked}`}>{'\u2717'}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Verification badges */}
      <div className={styles.verifications}>
        {safetyScore >= 85 && <span className={styles.verBadge}>{'\u2713'} AI Security Checked</span>}
        {privacyScore >= 80 && <span className={styles.verBadge}>{'\u2713'} Privacy Verified</span>}
        {allSafe && <span className={styles.verBadge}>{'\u2713'} No Trackers</span>}
      </div>
    </div>
  )
}

function computePrivacyScore(permissions, safetyScore) {
  let score = 50
  const permStr = permissions.join(' ').toLowerCase()

  // Bonus for no permissions
  if (SAFE_KEYWORDS.some(k => permStr.includes(k))) score += 30
  // Penalty for sensitive permissions
  RISKY_KEYWORDS.forEach(k => { if (permStr.includes(k)) score -= 15 })
  // Safety score contribution
  score += (safetyScore / 100) * 20

  return Math.max(0, Math.min(100, Math.round(score)))
}
