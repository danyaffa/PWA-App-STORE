import { useEffect, useMemo, useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useToast } from '../hooks/useToast.js'
import styles from './Management.module.css'

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) } catch { return fallback }
}
function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export default function Management() {
  const { toast, ToastContainer } = useToast()

  const [published, setPublished] = useState(() => readJson('sl_published_apps', []))
  const [blocked, setBlocked] = useState(() => readJson('sl_blocked_apps', []))

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [otp, setOtp] = useState('')
  const [otpInput, setOtpInput] = useState('')

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'sl_published_apps') setPublished(readJson('sl_published_apps', []))
      if (e.key === 'sl_blocked_apps') setBlocked(readJson('sl_blocked_apps', []))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const publishedCount = published.length
  const blockedCount = blocked.length

  const blockedIds = useMemo(() => new Set(blocked.map(b => b.id)), [blocked])

  function beginDelete(app) {
    setDeleteTarget(app)
    setOtp(randomCode())
    setOtpInput('')
  }

  function cancelDelete() {
    setDeleteTarget(null)
    setOtp('')
    setOtpInput('')
  }

  function confirmDelete() {
    if (!deleteTarget) return
    if (otpInput.trim() !== otp) {
      toast('❌ Verification code is incorrect.')
      return
    }
    const next = published.filter(a => a.id !== deleteTarget.id)
    writeJson('sl_published_apps', next)
    setPublished(next)
    toast(`✅ Deleted: ${deleteTarget.name}`)
    cancelDelete()
  }

  function toggleBlock(app) {
    const isBlocked = blockedIds.has(app.id)
    const next = isBlocked
      ? blocked.filter(b => b.id !== app.id)
      : [{ id: app.id, name: app.name, reason: 'Manual block', at: new Date().toISOString() }, ...blocked]

    writeJson('sl_blocked_apps', next)
    setBlocked(next)
    toast(isBlocked ? 'Unblocked.' : 'Blocked.')
  }

  return (
    <>
      <SEO title="Management Dashboard — SafeLaunch" description="Manage apps, blocks, and moderation actions." canonical="https://pwa-app-store.com/management" />
      <Nav />
      <div className="page-wrap">
        <div className={styles.header}>
          <div>
            <div className="section-label">Management</div>
            <h1 className="section-title">Management Dashboard</h1>
            <p className={styles.sub}>Minimal tools: blocked list + delete app with 2-step verification.</p>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>{publishedCount}</div>
              <div className={styles.statLbl}>Published Apps</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>{blockedCount}</div>
              <div className={styles.statLbl}>Blocked Apps</div>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Published Apps</h2>
            {published.length === 0 ? (
              <div className={styles.empty}>No published apps yet.</div>
            ) : (
              <div className={styles.list}>
                {published.map(app => {
                  const isBlocked = blockedIds.has(app.id)
                  return (
                    <div key={app.id} className={styles.row}>
                      <div className={styles.rowMain}>
                        <div className={styles.rowTitle}>{app.name}</div>
                        <div className={styles.rowMeta}>{app.category} • {app.price || 'Free'} • {app.url || 'No URL'}</div>
                      </div>
                      <div className={styles.rowActions}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleBlock(app)}>
                          {isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => beginDelete(app)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Blocked Apps</h2>
            {blocked.length === 0 ? (
              <div className={styles.empty}>No blocked apps.</div>
            ) : (
              <div className={styles.list}>
                {blocked.map(b => (
                  <div key={b.id} className={styles.row}>
                    <div className={styles.rowMain}>
                      <div className={styles.rowTitle}>{b.name}</div>
                      <div className={styles.rowMeta}>{b.reason || 'Blocked'} • {new Date(b.at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Suggestions</h2>
            <div className={styles.suggest}>
              <p>• Add rules for auto-blocking (malware flags, phishing domains, policy violations).</p>
              <p>• Require verified developer identity before publishing paid apps.</p>
              <p>• Add an “Appeal Block” workflow for developers.</p>
            </div>
          </section>
        </div>
      </div>

      {deleteTarget && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalTitle}>Management Delete Verification</div>
            <div className={styles.codeBanner}>Your 6-digit code is: <b>{otp}</b></div>
            <div className={styles.modalText}>
              To delete <b>{deleteTarget.name}</b>, enter the verification code.
            </div>

            <label className={styles.modalLabel}>Verification Code</label>
            <input
              className={styles.modalInput}
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              placeholder="Enter 6-digit code"
              inputMode="numeric"
            />

            <div className={styles.modalBtns}>
              <button className="btn btn-ghost" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Confirm Delete</button>
            </div>

            <div className={styles.modalFoot}>
              This is a demo 2-step check (code is shown on screen). Later: send code via email/SMS.
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </>
  )
}
