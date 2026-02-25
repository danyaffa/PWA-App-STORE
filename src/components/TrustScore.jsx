import styles from './TrustScore.module.css'

/**
 * Universal Trust Score — visual ring gauge (0–100)
 * Replaces scattered safety/risk metrics with ONE investor-visible number.
 *
 * Props:
 *   score     — 0–100 trust score
 *   size      — 'sm' | 'md' | 'lg' (default 'md')
 *   showLabel — show "Trust Score" label below (default true)
 */
export default function TrustScore({ score = 0, size = 'md', showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const badge = getBadge(clamped)

  // SVG ring config
  const dims = { sm: 56, md: 88, lg: 120 }
  const strokes = { sm: 4, md: 6, lg: 8 }
  const fonts = { sm: '0.85rem', md: '1.4rem', lg: '2rem' }
  const labelFonts = { sm: '0.58rem', md: '0.68rem', lg: '0.78rem' }

  const d = dims[size]
  const stroke = strokes[size]
  const r = (d - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (clamped / 100) * circ

  return (
    <div className={`${styles.wrap} ${styles[size]}`}>
      <div className={styles.ring}>
        <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`}>
          <circle
            cx={d / 2} cy={d / 2} r={r}
            fill="none" stroke="var(--border)" strokeWidth={stroke}
          />
          <circle
            cx={d / 2} cy={d / 2} r={r}
            fill="none" stroke={badge.color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${d / 2} ${d / 2})`}
            className={styles.progress}
          />
        </svg>
        <div className={styles.value} style={{ fontSize: fonts[size] }}>
          {clamped}
        </div>
      </div>
      {showLabel && (
        <div className={styles.label} style={{ fontSize: labelFonts[size] }}>
          <span className={styles.badgeIcon} style={{ color: badge.color }}>{badge.icon}</span>
          {badge.label}
        </div>
      )}
    </div>
  )
}

export function getBadge(score) {
  if (score >= 85) return { icon: '\u2713', label: 'Verified Safe',  color: 'var(--accent)', level: 'safe' }
  if (score >= 60) return { icon: '\u25CF', label: 'Limited Perms',  color: 'var(--warn)',   level: 'limited' }
  return              { icon: '\u2716', label: 'Needs Review',   color: 'var(--danger)', level: 'review' }
}

/**
 * Compact inline trust badge — for cards and lists
 */
export function TrustBadge({ score = 0 }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const badge = getBadge(clamped)

  return (
    <span className={`${styles.inlineBadge} ${styles[`badge_${badge.level}`]}`}>
      <span className={styles.inlineDot} style={{ background: badge.color }} />
      {clamped}
      <span className={styles.inlineSep} />
      {badge.label}
    </span>
  )
}
