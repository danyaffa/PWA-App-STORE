import { Link } from 'react-router-dom'
import styles from './LaunchDealBanner.module.css'

const TOTAL = 1000
const CLAIMED = 0 // update as spots are claimed

const CHECKS = [
  'Full AI Safety Scan',
  'Listed in the Store',
  'Public Trust Report',
  'Developer Dashboard',
]

export default function LaunchDealBanner() {
  const remaining = TOTAL - CLAIMED
  const pct = Math.round((CLAIMED / TOTAL) * 100)

  return (
    <div className={styles.banner}>
      <div className={styles.ribbon}>Launch Deal</div>

      <div className={styles.left}>
        <h2 className={styles.headline}>
          First 1,000 Apps <em>Just $2</em>
        </h2>
        <p className={styles.sub}>
          One-time payment. No subscription. Publish your app and get a full AI safety scan included.
        </p>

        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>
            <span>{remaining.toLocaleString()} spots left</span>
            <span>{TOTAL.toLocaleString()} total</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
        </div>

        <Link to="/signin?tab=register" className={styles.cta}>
          Publish Your App for $2
        </Link>
      </div>

      <div className={styles.right}>
        <ul className={styles.checkList}>
          {CHECKS.map(c => (
            <li key={c} className={styles.checkItem}>
              <span className={styles.checkIcon}>&#10003;</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
