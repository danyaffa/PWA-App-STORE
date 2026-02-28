import styles from './IOSInstallGuide.module.css'

/**
 * Minimal overlay shown to iOS/Safari users when they tap "Install".
 * Two simple steps — tap Share, tap Add to Home Screen. That's it.
 */
export default function IOSInstallGuide({ onDismiss }) {
  return (
    <div className={styles.overlay} onClick={onDismiss}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onDismiss} aria-label="Close">&times;</button>

        <h2 className={styles.title}>Install SafeLaunch</h2>
        <p className={styles.sub}>Two taps and you're done</p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepText}>
              Tap the <strong>Share</strong> button
              <span className={styles.shareIcon}>
                {/* iOS share icon (box with arrow) */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </span>
              at the bottom of Safari
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepText}>
              Tap <strong>"Add to Home Screen"</strong> then tap <strong>"Add"</strong>
            </div>
          </div>
        </div>

        <div className={styles.done}>
          That's it — SafeLaunch will appear on your home screen like a real app.
        </div>

        <button className={`btn btn-primary ${styles.gotIt}`} onClick={onDismiss}>Got it</button>
      </div>
    </div>
  )
}
