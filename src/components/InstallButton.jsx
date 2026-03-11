import { usePWAInstall } from '../hooks/usePWAInstall.js'
import { useDraggable } from '../hooks/useDraggable.js'
import styles from './InstallButton.module.css'

/**
 * Persistent floating "Install App" button that appears on all screens.
 * Hidden when the app is already installed or running standalone.
 * Draggable — drag it anywhere on screen. Position is remembered.
 */
export default function InstallButton() {
  const { install, installed, isStandalone, isIOS } = usePWAInstall()
  const { ref, style: dragStyle, onPointerDown } = useDraggable(
    'sl_install_btn_pos',
    { bottom: 80, right: 24 },
  )

  if (installed || isStandalone) return null

  return (
    <button
      ref={ref}
      className={styles.fab}
      style={dragStyle}
      onClick={install}
      onPointerDown={onPointerDown}
      aria-label="Install SafeLaunch app"
    >
      <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span className={styles.label}>Install App</span>
      {isIOS && <span className={styles.iosBadge}>iOS</span>}
    </button>
  )
}
