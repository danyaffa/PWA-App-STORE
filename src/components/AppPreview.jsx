import styles from './AppPreview.module.css'

function MockTile({ shot }) {
  return (
    <div className={styles.tile} style={{ background: shot?.color || 'rgba(255,255,255,0.04)' }}>
      <div className={styles.tileInner}>
        <div className={styles.tileTitle}>{shot?.title || 'Preview'}</div>
        <div className={styles.tileCaption}>
          {shot?.caption || 'Preview unavailable — open the app in a new tab.'}
        </div>
      </div>
    </div>
  )
}

export default function AppPreview({ app }) {
  const shots = Array.isArray(app?.screenshots) ? app.screenshots.slice(0, 4) : []
  const hasShots = shots.length > 0

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <span className={styles.dot} style={{ background: '#ff5f56' }} />
        <span className={styles.dot} style={{ background: '#ffbd2e' }} />
        <span className={styles.dot} style={{ background: '#27c93f' }} />
        <span className={styles.urlText}>{app?.url || ''}</span>
        {app?.url && (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openBtn}
          >
            Open in New Tab
          </a>
        )}
      </div>

      {hasShots ? (
        <div className={styles.grid}>
          {shots.map((s, idx) => <MockTile key={idx} shot={s} />)}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>{app?.icon || ''}</div>
          <div className={styles.emptyTitle}>{app?.name || 'App'}</div>
          <div className={styles.emptyText}>
            Live preview is not available — many apps block iframe embedding for security.
            Use <b>Open in New Tab</b> above to view the app directly.
          </div>
        </div>
      )}
    </div>
  )
}
