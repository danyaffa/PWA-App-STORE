import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import styles from './InstallDisclaimer.module.css'

export default function InstallDisclaimer({ appName, appId, onAccept, onCancel }) {
  const [accepted, setAccepted] = useState(false)
  const { user, isConfigured }  = useAuth()

  async function handleAccept() {
    // Store acceptance proof
    if (isConfigured && user) {
      try {
        const { db } = await import('../lib/firebase.js')
        const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
        if (db) {
          await addDoc(collection(db, 'agreements'), {
            uid: user.uid,
            agreementType: 'user_install',
            appId,
            version: '1.0',
            acceptedAt: serverTimestamp(),
            userAgent: navigator.userAgent,
          })
        }
      } catch (err) {
        console.error('Failed to store install agreement:', err)
      }
    }

    // Also track in localStorage for this session
    try {
      const installs = JSON.parse(localStorage.getItem('sl_install_accepts') || '{}')
      installs[appId] = new Date().toISOString()
      localStorage.setItem('sl_install_accepts', JSON.stringify(installs))
    } catch { /* ignore corrupted localStorage */ }

    onAccept()
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Install {appName}</h3>

        <div className={styles.disclaimer}>
          <p>This application is provided by an <strong>independent developer</strong>.</p>
          <p>The platform does not create, own, or guarantee third-party applications. You install and use this application at your own discretion and risk.</p>
        </div>

        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={e => setAccepted(e.target.checked)}
            style={{ accentColor: 'var(--accent)' }}
          />
          <span>I understand and wish to proceed with installation.</span>
        </label>

        <div className={styles.actions}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!accepted}
            onClick={handleAccept}
            style={{ opacity: accepted ? 1 : 0.5 }}
          >
            Accept & Install
          </button>
        </div>
      </div>
    </div>
  )
}
