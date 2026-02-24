import { useState } from 'react'
import { db, isConfigured } from '../lib/firebase.js'
import styles from './ReportApp.module.css'

const REASONS = [
  { value: 'malware', label: 'Malware or harmful code' },
  { value: 'scam', label: 'Scam or fraudulent app' },
  { value: 'copyright', label: 'Copyright / IP violation' },
  { value: 'illegal', label: 'Illegal content or activity' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'privacy', label: 'Privacy violation' },
  { value: 'other', label: 'Other' },
]

export default function ReportApp({ appId, appName, onClose }) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!reason) return
    setBusy(true)

    const report = {
      appId,
      reason,
      details,
      reportedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }

    if (isConfigured && db) {
      try {
        const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
        await addDoc(collection(db, 'reports'), { ...report, reportedAt: serverTimestamp() })
      } catch (err) {
        console.error('Failed to submit report:', err)
      }
    }

    // Also store locally for tracking
    const localReports = JSON.parse(localStorage.getItem('sl_reports') || '[]')
    localReports.push(report)
    localStorage.setItem('sl_reports', JSON.stringify(localReports))

    setBusy(false)
    setSubmitted(true)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {submitted ? (
          <div className={styles.success}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>✅</div>
            <h3>Report Submitted</h3>
            <p>Thank you. We will review your report and take action if necessary.</p>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 16 }}>Close</button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h3>Report {appName}</h3>
              <button className={styles.closeBtn} onClick={onClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <p className={styles.desc}>Select a reason for reporting this application.</p>
              <div className={styles.reasons}>
                {REASONS.map(r => (
                  <label key={r.value} className={`${styles.reason} ${reason === r.value ? styles.selected : ''}`}>
                    <input type="radio" name="reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} />
                    {r.label}
                  </label>
                ))}
              </div>
              <div className="form-group" style={{ marginTop: 14 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, display: 'block' }}>Additional details (optional)</label>
                <textarea className="input" rows={3} value={details} onChange={e => setDetails(e.target.value)} placeholder="Describe the issue..." style={{ resize: 'vertical' }} />
              </div>
              <div className={styles.actions}>
                <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={!reason || busy}>{busy ? 'Submitting...' : 'Submit Report'}</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
