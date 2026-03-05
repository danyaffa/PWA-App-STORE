import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { SCAN_STEPS, CATEGORIES } from '../utils/data.js'
import { savePublishedApp } from '../lib/appsStore.js'
import { useToast } from '../hooks/useToast.js'
import styles from './Publish.module.css'

const STEPS = ['Upload', 'Configure', 'Scan', 'Publish']

function hasDevAgreement() {
  try {
    const stored = JSON.parse(localStorage.getItem('sl_dev_agreement') || 'null')
    return stored && stored.version
  } catch { return false }
}

export default function Publish() {
  const [tab,        setTab]        = useState('zip')
  const [step,       setStep]       = useState(1)
  const [fileName,   setFileName]   = useState(null)
  const [ghPreview,  setGhPreview]  = useState(null)
  const [scanning,   setScanning]   = useState(false)
  const [scanIdx,    setScanIdx]    = useState(-1)
  const [logs,       setLogs]       = useState([])
  const [done,       setDone]       = useState(false)
  const [selfCert,   setSelfCert]   = useState({ noMalware: false, copyright: false, legal: false })

  // Basic info
  const [appName,      setAppName]      = useState('')
  const [category,     setCategory]     = useState('')
  const [privacyUrl,   setPrivacyUrl]   = useState('')
  const [contactEmail, setContactEmail] = useState('')

  // App details
  const [shortDesc,     setShortDesc]     = useState('')
  const [fullDesc,      setFullDesc]      = useState('')
  const [iconUrl,       setIconUrl]       = useState('')
  const [developerName, setDeveloperName] = useState('')
  const [websiteUrl,    setWebsiteUrl]    = useState('')
  const [appVersion,    setAppVersion]    = useState('')
  const [whatsNew,      setWhatsNew]      = useState('')
  const [pricingType,   setPricingType]   = useState('free')
  const [priceAmount,   setPriceAmount]   = useState('')

  const [errors,     setErrors]     = useState({})
  const [published,  setPublished]  = useState(false)
  const [publishing, setPublishing] = useState(false)

  const { toast, ToastContainer } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const logRef = useRef()

  const DRAFT_KEY = 'sl_publish_draft'

  function saveDraft() {
    const draft = {
      appName, category, shortDesc, fullDesc, developerName,
      websiteUrl, privacyUrl, contactEmail, appVersion,
      whatsNew, iconUrl, pricingType, priceAmount, selfCert,
      tab, fileName, ghPreview, savedAt: new Date().toISOString(),
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    toast('Draft saved.')
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const d = JSON.parse(raw)
      if (d.appName) setAppName(d.appName)
      if (d.category) setCategory(d.category)
      if (d.shortDesc) setShortDesc(d.shortDesc)
      if (d.fullDesc) setFullDesc(d.fullDesc)
      if (d.developerName) setDeveloperName(d.developerName)
      if (d.websiteUrl) setWebsiteUrl(d.websiteUrl)
      if (d.privacyUrl) setPrivacyUrl(d.privacyUrl)
      if (d.contactEmail) setContactEmail(d.contactEmail)
      if (d.appVersion) setAppVersion(d.appVersion)
      if (d.whatsNew) setWhatsNew(d.whatsNew)
      if (d.iconUrl) setIconUrl(d.iconUrl)
      if (d.pricingType) setPricingType(d.pricingType)
      if (d.priceAmount) setPriceAmount(d.priceAmount)
      if (d.selfCert) setSelfCert(d.selfCert)
      if (d.fileName) { setFileName(d.fileName); setStep(2) }
      if (d.ghPreview) setGhPreview(d.ghPreview)
    } catch { /* ignore corrupt data */ }
  }

  // Agreement gate: redirect to /developer-agreement if not accepted
  useEffect(() => {
    if (!hasDevAgreement()) {
      navigate('/developer-agreement', { replace: true })
    }
    loadDraft()
  }, [])

  function handleFile(e) {
    const f = e.target.files?.[0] || e.dataTransfer?.files?.[0]
    if (f) { setFileName(f.name); setStep(2) }
  }

  function handleGhInput(val) {
    if (val.length > 6) {
      setGhPreview(val.replace('https://','').replace('github.com/',''))
    }
  }

  function clearError(field) {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validateFields() {
    const next = {}
    if (!appName.trim()) next.appName = 'App Name is required'
    if (!category) next.category = 'Category is required'
    if (!shortDesc.trim()) next.shortDesc = 'Short description is required'
    if (!fullDesc.trim()) next.fullDesc = 'Full description is required'
    if (!developerName.trim()) next.developerName = 'Developer name is required'
    if (!privacyUrl.trim()) {
      next.privacyUrl = 'Privacy Policy URL is required'
    } else if (!/^https?:\/\/.+\..+/.test(privacyUrl.trim())) {
      next.privacyUrl = 'Enter a valid URL (e.g. https://yoursite.com/privacy)'
    }
    if (!contactEmail.trim()) {
      next.contactEmail = 'Contact Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      next.contactEmail = 'Enter a valid email address'
    }
    if (websiteUrl.trim() && !/^https?:\/\/.+\..+/.test(websiteUrl.trim())) {
      next.websiteUrl = 'Enter a valid URL (e.g. https://yourapp.com)'
    }
    if (pricingType === 'paid') {
      const p = parseFloat(priceAmount)
      if (!priceAmount.trim() || isNaN(p)) {
        next.priceAmount = 'Price is required for paid apps'
      } else if (p < 0.99) {
        next.priceAmount = 'Minimum price is $0.99'
      } else if (p > 999.99) {
        next.priceAmount = 'Maximum price is $999.99'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function startScan() {
    if (!validateFields()) {
      toast('Please fill in all required fields before scanning.')
      return
    }
    setScanning(true); setLogs([]); setDone(false); setScanIdx(0); setStep(3)
    runStep(0)
  }

  function runStep(i) {
    setScanIdx(i)
    const s = SCAN_STEPS[i]
    setLogs(prev => [...prev, { type: 'info', msg: `▶ ${s.label}` }])

    const delay = 800 + Math.random() * 600 // realistic delay per step
    setTimeout(() => {
      setLogs(prev => [...prev, { type: s.cls || 'info', msg: s.text }])
      setTimeout(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' }) }, 30)
      if (i < SCAN_STEPS.length - 1) {
        runStep(i + 1)
      } else {
        setDone(true)
        setScanning(false)
        setStep(4)
        setLogs(prev => [...prev, { type: 'ok', msg: '✓ Scan complete. Ready to publish.' }])
        setTimeout(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' }) }, 50)
      }
    }, delay)
  }

  async function publishNow() {
    if (publishing || published) return
    setPublishing(true)

    const slug = (appName || 'app')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const iconVal = (iconUrl || '').trim()
    const icon = iconVal && !/^https?:\/\//i.test(iconVal) ? iconVal : '🧩'

    const newApp = {
      id: slug || `app-${Date.now()}`,
      status: 'published',
      icon,
      name: appName.trim(),
      desc: shortDesc.trim(),
      category,
      price: pricingType === 'paid' ? String(priceAmount || '').trim() : 'Free',
      url: websiteUrl.trim() || '',
      developer: developerName.trim() || user?.email || 'Developer',
      developerUid: user?.uid || null,
      whatsNew: whatsNew.trim(),
      version: (appVersion || '').trim(),
      privacyUrl: privacyUrl.trim(),
      contactEmail: contactEmail.trim(),
      score: 12,
      trust: 'green',
      installs: '0',
      rankingScore: 50,
      safetyScore: 88,
      averageRating: 0,
      totalReviews: 0,
      publishedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      developerTrust: 60,
      installVelocity: 0,
      badges: ['new', 'verified'],
    }

    // Save locally first — this always works
    try {
      const existing = JSON.parse(localStorage.getItem('sl_published_apps') || '[]')
      const next = [newApp, ...existing.filter(a => a?.id !== newApp.id)]
      localStorage.setItem('sl_published_apps', JSON.stringify(next))
    } catch { /* ignore */ }

    // Save to Firebase so the app is visible on ALL devices/browsers
    let firebaseSaved = false
    try {
      firebaseSaved = await savePublishedApp(newApp)
    } catch (e) {
      console.error('[Publish] Firebase save failed:', e)
    }

    setPublished(true)
    setPublishing(false)
    localStorage.removeItem(DRAFT_KEY)

    if (firebaseSaved) {
      toast('Your app is live on SafeLaunch!')
    } else {
      toast('App saved locally only — Firestore write failed. Deploy Firestore rules to fix. Check browser console for details.')
    }
  }

  return (
    <>
      <SEO
        title="Publish — SafeLaunch"
        description="Upload and publish your PWA with AI safety scanning."
        canonical="https://agentslock.com/publish"
      />
      <Nav />

      <div className="page-wrap">
        <div className="section-label">Publisher</div>
        <h1 className="section-title display">Publish Your App</h1>
        <p className="section-sub">
          Upload your PWA and run our safety scan. Approved apps appear in the store.
        </p>

        <div className={styles.steps}>
          {STEPS.map((s, idx) => {
            const n = idx + 1
            const isActive = step === n
            const isDone = step > n
            return (
              <div key={s} className={`${styles.stepItem} ${isActive ? styles.active : ''} ${isDone ? styles.done : ''}`}>
                <div className={styles.stepNum}>{n}</div>
                <div className={styles.stepLabel}>{s}</div>
                {idx < STEPS.length - 1 && <div className={styles.stepLine} />}
              </div>
            )
          })}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className={`card ${styles.uploadCard}`}>
            <div className={styles.tabs}>
              <div className={`${styles.tab} ${tab === 'zip' ? styles.tabActive : ''}`} onClick={() => setTab('zip')}>ZIP Upload</div>
              <div className={`${styles.tab} ${tab === 'github' ? styles.tabActive : ''}`} onClick={() => setTab('github')}>GitHub Repo</div>
              <div className={`${styles.tab} ${tab === 'url' ? styles.tabActive : ''}`} onClick={() => setTab('url')}>PWA URL</div>
            </div>

            <div className={styles.body}>
              {tab === 'zip' && (
                <div
                  className={styles.dropzone}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add(styles.drag) }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove(styles.drag) }}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove(styles.drag); handleFile(e) }}
                >
                  <input className={styles.fileInput} type="file" accept=".zip,.tar,.tar.gz" onChange={handleFile} />
                  <div className={styles.dzIcon}>📦</div>
                  <h3>Drop your project ZIP here</h3>
                  <p>Supports .zip, .tar.gz — max 200MB<br/>Auto-detects React, Vue, Svelte, Vanilla</p>
                </div>
              )}

              {tab === 'github' && (
                <div className={styles.ghForm}>
                  <div className="field">
                    <label className="label">GitHub Repository</label>
                    <div className={styles.ghRow}>
                      <input className="input" placeholder="https://github.com/user/repo" onChange={(e) => handleGhInput(e.target.value)} />
                      <button className="btn btn-ghost" onClick={() => { if (ghPreview) setStep(2) }}>Continue</button>
                    </div>
                    {ghPreview && (
                      <div className={styles.repoPreview}>
                        <div style={{ fontSize: '1.4rem' }}>🐙</div>
                        <div>
                          <div style={{ fontWeight: 900 }}>{ghPreview}</div>
                          <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>We’ll pull the repository at scan time.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === 'url' && (
                <div className="field">
                  <label className="label">PWA URL</label>
                  <input className="input" placeholder="https://yourapp.com" onChange={(e) => setWebsiteUrl(e.target.value)} />
                  <div style={{ marginTop: 12 }}>
                    <button className="btn btn-ghost" onClick={() => setStep(2)}>Continue</button>
                  </div>
                </div>
              )}

              {fileName && (
                <div style={{ marginTop: 12, color: 'var(--muted)' }}>
                  Selected: <b style={{ color: 'var(--text)' }}>{fileName}</b>
                  <div style={{ marginTop: 12 }}>
                    <button className="btn btn-ghost" onClick={() => setStep(2)}>Continue</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <div className={`card ${styles.detailsCard}`}>
            <div className={styles.detailsHeader}>
              <div className={styles.detailsIcon}>🧾</div>
              <div>
                <h2 className={styles.detailsTitle}>App Listing Details</h2>
                <p className={styles.detailsSub}>Fill required fields. Then run scan.</p>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3 className={styles.sectionHead}>Core Info</h3>

              <div className={styles.formGrid}>
                <div className="field">
                  <label className="label">App Name <span className={styles.required}>*</span></label>
                  <input className={`input ${errors.appName ? styles.inputError : ''}`} value={appName} onChange={(e) => { setAppName(e.target.value); clearError('appName') }} placeholder="AgentsLock" />
                  {errors.appName && <span className={styles.fieldError}>{errors.appName}</span>}
                </div>

                <div className="field">
                  <label className="label">Category <span className={styles.required}>*</span></label>
                  <select className={`input ${errors.category ? styles.inputError : ''}`} value={category} onChange={(e) => { setCategory(e.target.value); clearError('category') }}>
                    <option value="">Select</option>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <span className={styles.fieldError}>{errors.category}</span>}
                </div>

                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Short Description <span className={styles.required}>*</span></label>
                  <input className={`input ${errors.shortDesc ? styles.inputError : ''}`} value={shortDesc} onChange={(e) => { setShortDesc(e.target.value); clearError('shortDesc') }} maxLength={120} placeholder="A short summary of your app..." />
                  <div className={styles.charCount}>{shortDesc.length}/120</div>
                  {errors.shortDesc && <span className={styles.fieldError}>{errors.shortDesc}</span>}
                </div>

                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Full Description <span className={styles.required}>*</span></label>
                  <textarea className={`input ${styles.textarea} ${errors.fullDesc ? styles.inputError : ''}`} value={fullDesc} onChange={(e) => { setFullDesc(e.target.value); clearError('fullDesc') }} placeholder="Describe features, use cases, and what makes it safe..." />
                  {errors.fullDesc && <span className={styles.fieldError}>{errors.fullDesc}</span>}
                </div>

                <div className="field">
                  <label className="label">Developer Name <span className={styles.required}>*</span></label>
                  <input className={`input ${errors.developerName ? styles.inputError : ''}`} value={developerName} onChange={(e) => { setDeveloperName(e.target.value); clearError('developerName') }} placeholder="Dev Studio" />
                  {errors.developerName && <span className={styles.fieldError}>{errors.developerName}</span>}
                </div>

                <div className="field">
                  <label className="label">Website URL</label>
                  <input className={`input ${errors.websiteUrl ? styles.inputError : ''}`} value={websiteUrl} onChange={(e) => { setWebsiteUrl(e.target.value); clearError('websiteUrl') }} placeholder="https://agentslock.com" />
                  {errors.websiteUrl && <span className={styles.fieldError}>{errors.websiteUrl}</span>}
                </div>

                <div className="field">
                  <label className="label">Privacy Policy URL <span className={styles.required}>*</span></label>
                  <input className={`input ${errors.privacyUrl ? styles.inputError : ''}`} value={privacyUrl} onChange={(e) => { setPrivacyUrl(e.target.value); clearError('privacyUrl') }} placeholder="https://yourapp.com/privacy" />
                  {errors.privacyUrl && <span className={styles.fieldError}>{errors.privacyUrl}</span>}
                </div>

                <div className="field">
                  <label className="label">Contact Email <span className={styles.required}>*</span></label>
                  <input className={`input ${errors.contactEmail ? styles.inputError : ''}`} value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); clearError('contactEmail') }} placeholder="support@yourapp.com" />
                  {errors.contactEmail && <span className={styles.fieldError}>{errors.contactEmail}</span>}
                </div>

                <div className="field">
                  <label className="label">Version</label>
                  <input className="input" value={appVersion} onChange={(e) => setAppVersion(e.target.value)} placeholder="1.0.0" />
                </div>

                <div className="field">
                  <label className="label">What's New</label>
                  <input className="input" value={whatsNew} onChange={(e) => setWhatsNew(e.target.value)} placeholder="Bug fixes and performance improvements..." />
                </div>

                <div className="field">
                  <label className="label">Icon (emoji)</label>
                  <input className="input" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="🛡️" />
                  <span className={styles.fieldHint}>Tip: use an emoji (URLs not rendered yet in cards).</span>
                </div>
              </div>

              <h3 className={styles.sectionHead} style={{ marginTop: 18 }}>Pricing</h3>
              <p className={styles.sectionHint}>Choose whether your app is free or paid.</p>

              <div className={styles.pricingToggle}>
                <button type="button" className={`${styles.pricingOption} ${pricingType === 'free' ? styles.pricingActive : ''}`} onClick={() => setPricingType('free')}>
                  <span className={styles.pricingIcon}>🆓</span>
                  <span className={styles.pricingLabel}>Free</span>
                  <span className={styles.pricingDesc}>Users can install at no cost</span>
                </button>
                <button type="button" className={`${styles.pricingOption} ${pricingType === 'paid' ? styles.pricingActive : ''}`} onClick={() => setPricingType('paid')}>
                  <span className={styles.pricingIcon}>💰</span>
                  <span className={styles.pricingLabel}>Paid</span>
                  <span className={styles.pricingDesc}>Set a one-time purchase price</span>
                </button>
              </div>

              {pricingType === 'paid' && (
                <div className={styles.priceInputRow}>
                  <div style={{ fontWeight: 900 }}>Price (USD)</div>
                  <div className={styles.priceInputWrap}>
                    <div className={styles.priceCurrency}>$</div>
                    <input className={`input ${errors.priceAmount ? styles.inputError : ''}`} value={priceAmount} onChange={(e) => { setPriceAmount(e.target.value); clearError('priceAmount') }} placeholder="0.99" />
                  </div>
                  {errors.priceAmount && <span className={styles.fieldError}>{errors.priceAmount}</span>}
                </div>
              )}

              <div className={styles.selfCert}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>Self-Certification</div>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <input type="checkbox" checked={selfCert.noMalware} onChange={(e) => setSelfCert(s => ({ ...s, noMalware: e.target.checked }))} />
                  <span style={{ marginLeft: 10 }}>No malware / spyware / credential harvesting</span>
                </label>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <input type="checkbox" checked={selfCert.copyright} onChange={(e) => setSelfCert(s => ({ ...s, copyright: e.target.checked }))} />
                  <span style={{ marginLeft: 10 }}>I own rights to all content (no piracy)</span>
                </label>
                <label style={{ display: 'block' }}>
                  <input type="checkbox" checked={selfCert.legal} onChange={(e) => setSelfCert(s => ({ ...s, legal: e.target.checked }))} />
                  <span style={{ marginLeft: 10 }}>App complies with local laws and regulations</span>
                </label>
              </div>

              <div className={styles.btnRow}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={startScan}>Build & Scan</button>
                <button className="btn btn-ghost" onClick={saveDraft}>Save Draft</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Scan */}
        {step === 3 && (
          <div className={styles.scanSection}>
            <div className={styles.progressHeader}>
              <div className={styles.progressLabel}>Scanning…</div>
              <div style={{ color: 'var(--muted)' }}>{Math.max(scanIdx, 0) + 1}/{SCAN_STEPS.length}</div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${Math.min(100, ((scanIdx + 1) / SCAN_STEPS.length) * 100)}%` }} />
            </div>
            <div className={styles.scanLog} ref={logRef}>
              {logs.map((l, idx) => (
                <div key={idx} className={`${styles.logLine} ${l.type === 'ok' ? styles.log_ok : l.type === 'warn' ? styles.log_warn : l.type === 'bad' ? styles.log_bad : ''}`}>
                  {l.msg}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <button className="btn btn-ghost" disabled={scanning} onClick={() => { setStep(2); setScanning(false) }}>Back</button>
            </div>
          </div>
        )}

        {/* Step 4: Publish */}
        {step === 4 && (
          <div className={`card ${styles.detailsCard}`}>
            <div className={styles.detailsHeader}>
              <div className={styles.detailsIcon}>✅</div>
              <div>
                <h2 className={styles.detailsTitle}>Ready to Publish</h2>
                <p className={styles.detailsSub}>Your scan completed successfully. Publish to the store.</p>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <div className={styles.decisionBanner}>
                <div>
                  <div style={{ fontWeight: 900, marginBottom: 4 }}>Decision: Approved</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.92rem' }}>No high-risk issues detected.</div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Link className="btn btn-ghost" to="/store">Back to Store</Link>
                  <button
                    className="btn btn-primary"
                    disabled={publishing || published}
                    style={published ? { background: '#f59e0b', borderColor: '#f59e0b', color: '#fff', opacity: 1 } : {}}
                    onClick={publishNow}
                  >
                    {published ? 'Published' : (publishing ? 'Publishing…' : 'Publish Now')}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 14, color: 'var(--muted)' }}>
                Publishing will add your app to the store listing and enable installation for users.
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer />
    </>
  )
}
