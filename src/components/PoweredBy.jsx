import { Link } from 'react-router-dom'
import styles from './PoweredBy.module.css'

/**
 * "Powered by SafeLaunch" viral footer
 * Every installed app page includes this.
 * Each app becomes marketing for the platform.
 */
export default function PoweredBy() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.shield}>{'\u2713'}</span>
          <span className={styles.text}>
            Verified by <strong>SafeLaunch</strong> AI Safety Engine
          </span>
        </div>
        <Link to="/store" className={styles.cta}>
          Get more safe apps &rarr;
        </Link>
      </div>
    </div>
  )
}
