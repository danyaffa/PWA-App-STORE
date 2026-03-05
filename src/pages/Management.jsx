import { useEffect, useMemo, useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useToast } from '../hooks/useToast.js'
import { loadPublishedApps, loadCampaign, saveCampaign, deletePublishedApp } from '../lib/appsStore.js'
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

  // Load published apps from Firestore (not just localStorage)
  useEffect(() => {
    loadPublishedApps().then(apps => {
      if (apps && apps.length) setPublished(apps)
    }).catch(() => {})
  }, [])

  // Campaign state
  const [campActive, setCampActive]       = useState(false)
  const [campHeadline, setCampHeadline]   = useState('')
  const [campSubtitle, setCampSubtitle]   = useState('')
  const [campCtaText, setCampCtaText]     = useState('Browse Store')
  const [campCtaLink, setCampCtaLink]     = useState('/store')
  const [campSaving, setCampSaving]       = useState(false)

  useEffect(() => {
    loadCampaign().then(c => {
      if (!c) return
      setCampActive(!!c.active)
      setCampHeadline(c.headline || '')
      setCampSubtitle(c.subtitle || '')
      setCampCtaText(c.ctaText || 'Browse Store')
      setCampCtaLink(c.ctaLink || '/store')
    })
  }, [])

  async function handleCampaignSave(forceActive) {
    setCampSaving(true)
    const isActive = forceActive !== undefined ? forceActive : campActive
    const data = {
      active: isActive,
      headline: campHeadline.trim(),
      subtitle: campSubtitle.trim(),
      ctaText: campCtaText.trim() || 'Browse Store',
      ctaLink: campCtaLink.trim() || '/store',
    }
    const ok = await saveCampaign(data)
    setCampSaving(false)
    toast(ok ? 'Campaign saved!' : 'Campaign saved locally.')
  }

  async function handleCampaignStop() {
    setCampSaving(true)
    setCampActive(false)
    const data = {
      active: false,
      headline: campHeadline.trim(),
      subtitle: campSubtitle.trim(),
      ctaText: campCtaText.trim(),
      ctaLink: campCtaLink.trim(),
    }
    await saveCampaign(data)
    setCampSaving(false)
    toast('Campaign stopped. Banner removed from homepage.')
  }

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

  async function confirmDelete() {
    if (!deleteTarget) return
    if (otpInput.trim() !== otp) {
      toast('❌ Verification code is incorrect.')
      return
    }
    const next = published.filter(a => a.id !== deleteTarget.id)
    writeJson('sl_published_apps', next)
    setPublished(next)

    // Delete from Firestore so it disappears everywhere (incognito, other devices)
    const fbOk = await deletePublishedApp(deleteTarget.id)
    toast(fbOk ? `✅ Deleted: ${deleteTarget.name}` : `✅ Deleted locally: ${deleteTarget.name} (Firebase sync failed)`)
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
      <SEO title="Management Dashboard - SafeLaunch" description="Manage apps, blocks, and moderation actions." canonical="https://agentslock.com/management" />
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

          {/* Feature Campaign */}
          <section className={`${styles.card} ${styles.campaignCard}`}>
            <div className={styles.campaignHeader}>
              <h2 className={styles.cardTitle}>Feature Campaign</h2>
              <div className={`${styles.campaignBadge} ${campActive ? styles.campaignLive : styles.campaignOff}`}>
                {campActive ? 'LIVE' : 'OFF'}
              </div>
            </div>
            <p className={styles.campaignHint}>
              Control the splash banner on the homepage. Edit wording or stop the campaign anytime.
            </p>

            <div className={styles.campaignFields}>
              <div className={styles.campField}>
                <label className={styles.campLabel}>Headline</label>
                <input
                  className={styles.campInput}
                  value={campHeadline}
                  onChange={e => setCampHeadline(e.target.value)}
                  placeholder="Grand Launch - SafeLaunch is Live!"
                />
              </div>
              <div className={styles.campField}>
                <label className={styles.campLabel}>Subtitle</label>
                <input
                  className={styles.campInput}
                  value={campSubtitle}
                  onChange={e => setCampSubtitle(e.target.value)}
                  placeholder="e.g. Discover safe, AI-verified PWAs today."
                />
              </div>
              <div className={styles.campRow}>
                <div className={styles.campField}>
                  <label className={styles.campLabel}>Button Text</label>
                  <input
                    className={styles.campInput}
                    value={campCtaText}
                    onChange={e => setCampCtaText(e.target.value)}
                    placeholder="Browse Store"
                  />
                </div>
                <div className={styles.campField}>
                  <label className={styles.campLabel}>Button Link</label>
                  <input
                    className={styles.campInput}
                    value={campCtaLink}
                    onChange={e => setCampCtaLink(e.target.value)}
                    placeholder="/store"
                  />
                </div>
              </div>
            </div>

            <div className={styles.campaignActions}>
              {campActive ? (
                <>
                  <button className="btn btn-primary btn-sm" disabled={campSaving} onClick={handleCampaignSave}>
                    {campSaving ? 'Saving...' : 'Update Campaign'}
                  </button>
                  <button className="btn btn-danger btn-sm" disabled={campSaving} onClick={handleCampaignStop}>
                    Stop Campaign
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  disabled={campSaving || !campHeadline.trim()}
                  onClick={() => { setCampActive(true); handleCampaignSave(true) }}
                >
                  {campSaving ? 'Launching...' : 'Launch Campaign'}
                </button>
              )}
            </div>

            {campActive && campHeadline && (
              <div className={styles.campaignPreview}>
                <div className={styles.previewLabel}>Preview</div>
                <div className={styles.previewBanner}>
                  <div className={styles.previewHeadline}>{campHeadline}</div>
                  {campSubtitle && <div className={styles.previewSub}>{campSubtitle}</div>}
                  {campCtaText && <div className={styles.previewCta}>{campCtaText}</div>}
                </div>
              </div>
            )}
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
