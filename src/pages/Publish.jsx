import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { SCAN_STEPS } from '../utils/data.js'
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
  const [appName,    setAppName]    = useState('')
  const [category,   setCategory]   = useState('')
  const [privacyUrl, setPrivacyUrl] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [errors,     setErrors]     = useState({})
  const { toast, ToastContainer } = useToast()
  const { user, isConfigured } = useAuth()
  const navigate = useNavigate()
  const logRef = useRef()

  // Agreement gate: redirect to /developer-agreement if not accepted
  useEffect(() => {
    if (!hasDevAgreement()) {
      navigate('/developer-agreement', { replace: true })
    }
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

  function validateFields() {
    const next = {}
    if (!appName.trim()) next.appName = 'App Name is required'
    if (!category) next.category = 'Category is required'
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
    if (i >= SCAN_STEPS.length) { setDone(true); setStep(4); return }
    const s = SCAN_STEPS[i]
    setScanIdx(i)
    setLogs(prev => {
      const next = [...prev, s]
      setTimeout(() => { if (logRef.current) logRef.current.scrollTop = 9999 }, 50)
      return next
    })
    setTimeout(() => runStep(i + 1), 350 + Math.random() * 250)
  }

  const pct = scanIdx >= 0 ? SCAN_STEPS[Math.min(scanIdx, SCAN_STEPS.length-1)].pct : 0

  return (
    <>
      <SEO
        title="Publish Your App — SafeLaunch"
        description="Publish your PWA to SafeLaunch in minutes. Upload a ZIP, connect GitHub, or paste a URL. AI safety scanning included."
        canonical="https://agentslock.com/publish"
      />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <div className="section-label">Publish Your App</div>
        <h1 className="section-title display">From Upload to Live<br />in Two Minutes</h1>
        <p className="section-sub" style={{marginBottom:40}}>Upload a ZIP or connect GitHub. We build, scan, and publish — no certificates, no dev accounts.</p>

        {/* Step indicator */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s} className={`${styles.stepItem} ${i < step ? styles.done : ''} ${i === step-1 ? styles.active : ''}`}>
              <div className={styles.stepNum}>{i < step - 1 ? '✓' : i + 1}</div>
              <div className={styles.stepLabel}>{s}</div>
              {i < STEPS.length - 1 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        {/* Upload card */}
        <div className={`card ${styles.uploadCard}`}>
          <div className={styles.tabs}>
            {[['zip','📦 ZIP'], ['github','🐙 GitHub'], ['url','🔗 URL']].map(([id, label]) => (
              <div key={id} className={`${styles.tab} ${tab===id?styles.tabActive:''}`} onClick={() => setTab(id)}>{label}</div>
            ))}
          </div>

          <div className={styles.body}>
            {/* ZIP */}
            {tab === 'zip' && (
              <div>
                <div
                  className={styles.dropzone}
                  onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add(styles.drag)}}
                  onDragLeave={e=>e.currentTarget.classList.remove(styles.drag)}
                  onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove(styles.drag);handleFile(e)}}
                >
                  <input type="file" accept=".zip,.tar.gz" onChange={handleFile} className={styles.fileInput} />
                  <span className={styles.dzIcon}>📦</span>
                  <h3>{fileName || 'Drop your project ZIP here'}</h3>
                  <p>Supports .zip, .tar.gz — max 200MB<br />Auto-detects React, Vue, Svelte, Vanilla</p>
                </div>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label>App Name <span className={styles.required}>*</span></label>
                    <input className={`input ${errors.appName ? styles.inputError : ''}`} placeholder="My Awesome App" value={appName} onChange={e => { setAppName(e.target.value); if (errors.appName) setErrors(prev => ({ ...prev, appName: undefined })) }} />
                    {errors.appName && <span className={styles.fieldError}>{errors.appName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Category <span className={styles.required}>*</span></label>
                    <select className={`input ${errors.category ? styles.inputError : ''}`} value={category} onChange={e => { setCategory(e.target.value); if (errors.category) setErrors(prev => ({ ...prev, category: undefined })) }}>
                      <option value="">Select a category…</option>
                      {['Productivity','Finance','Health','Entertainment','Developer Tools','Education'].map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <span className={styles.fieldError}>{errors.category}</span>}
                  </div>
                  <div className="form-group">
                    <label>Privacy Policy URL <span className={styles.required}>*</span></label>
                    <input className={`input ${errors.privacyUrl ? styles.inputError : ''}`} type="url" placeholder="https://yoursite.com/privacy" value={privacyUrl} onChange={e => { setPrivacyUrl(e.target.value); if (errors.privacyUrl) setErrors(prev => ({ ...prev, privacyUrl: undefined })) }} />
                    {errors.privacyUrl && <span className={styles.fieldError}>{errors.privacyUrl}</span>}
                  </div>
                  <div className="form-group">
                    <label>Contact Email <span className={styles.required}>*</span></label>
                    <input className={`input ${errors.contactEmail ? styles.inputError : ''}`} type="email" placeholder="hello@yourapp.com" value={contactEmail} onChange={e => { setContactEmail(e.target.value); if (errors.contactEmail) setErrors(prev => ({ ...prev, contactEmail: undefined })) }} />
                    {errors.contactEmail && <span className={styles.fieldError}>{errors.contactEmail}</span>}
                  </div>
                </div>
                {/* Self-certification */}
                <div className={styles.selfCert}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 12 }}>Developer Self-Certification</h4>
                  {[
                    ['noMalware', 'My application contains no malware, spyware, or crypto-miners.'],
                    ['copyright', 'I own or have rights to all content and code in this submission.'],
                    ['legal', 'My app complies with all applicable laws and does not promote illegal activity.'],
                  ].map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 10, fontSize: '0.85rem', lineHeight: 1.5 }}>
                      <input type="checkbox" checked={selfCert[key]} onChange={e => setSelfCert(prev => ({ ...prev, [key]: e.target.checked }))} style={{ marginTop: 3, accentColor: 'var(--accent)' }} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <div className={styles.btnRow}>
                  <button
                    className="btn btn-primary"
                    disabled={!selfCert.noMalware || !selfCert.copyright || !selfCert.legal}
                    onClick={startScan}
                    style={{ opacity: (selfCert.noMalware && selfCert.copyright && selfCert.legal) ? 1 : 0.5 }}
                  >🚀 Build & Scan</button>
                  <button className="btn btn-ghost"   onClick={() => toast('💾 Draft saved')}>Save Draft</button>
                </div>
              </div>
            )}

            {/* GitHub */}
            {tab === 'github' && (
              <div className={styles.ghForm}>
                <div className="form-group">
                  <label>Repository URL</label>
                  <div className={styles.ghRow}>
                    <input className="input" placeholder="github.com/yourname/your-pwa" onChange={e=>handleGhInput(e.target.value)} />
                    <button className="btn btn-ghost">Connect</button>
                  </div>
                </div>
                {ghPreview && (
                  <div className={styles.repoPreview}>
                    <span style={{fontSize:'1.5rem'}}>📂</span>
                    <div>
                      <div style={{fontWeight:700}}>{ghPreview}</div>
                      <div style={{display:'flex',gap:16,fontSize:'0.82rem',color:'var(--muted)',marginTop:4}}>
                        <span>⭐ 142</span><span>🍴 23</span><span>📝 MIT</span><span>🟢 2d ago</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className={styles.formGrid}>
                  <div className="form-group"><label>Branch</label><select className="input"><option>main</option><option>master</option><option>prod</option></select></div>
                  <div className="form-group"><label>Build Command (optional)</label><input className="input" placeholder="npm run build (auto-detected)" /></div>
                  <div className="form-group">
                    <label>App Name <span className={styles.required}>*</span></label>
                    <input className={`input ${errors.appName ? styles.inputError : ''}`} placeholder="My Awesome App" value={appName} onChange={e => { setAppName(e.target.value); if (errors.appName) setErrors(prev => ({ ...prev, appName: undefined })) }} />
                    {errors.appName && <span className={styles.fieldError}>{errors.appName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Category <span className={styles.required}>*</span></label>
                    <select className={`input ${errors.category ? styles.inputError : ''}`} value={category} onChange={e => { setCategory(e.target.value); if (errors.category) setErrors(prev => ({ ...prev, category: undefined })) }}>
                      <option value="">Select a category…</option>
                      {['Productivity','Finance','Health','Entertainment','Developer Tools','Education'].map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <span className={styles.fieldError}>{errors.category}</span>}
                  </div>
                  <div className="form-group">
                    <label>Privacy Policy URL <span className={styles.required}>*</span></label>
                    <input className={`input ${errors.privacyUrl ? styles.inputError : ''}`} type="url" placeholder="https://yoursite.com/privacy" value={privacyUrl} onChange={e => { setPrivacyUrl(e.target.value); if (errors.privacyUrl) setErrors(prev => ({ ...prev, privacyUrl: undefined })) }} />
                    {errors.privacyUrl && <span className={styles.fieldError}>{errors.privacyUrl}</span>}
                  </div>
                  <div className="form-group">
                    <label>Contact Email <span className={styles.required}>*</span></label>
                    <input className={`input ${errors.contactEmail ? styles.inputError : ''}`} type="email" placeholder="hello@yourapp.com" value={contactEmail} onChange={e => { setContactEmail(e.target.value); if (errors.contactEmail) setErrors(prev => ({ ...prev, contactEmail: undefined })) }} />
                    {errors.contactEmail && <span className={styles.fieldError}>{errors.contactEmail}</span>}
                  </div>
                </div>
                <button className="btn btn-primary" style={{marginTop:24}} onClick={startScan}>🚀 Build & Scan</button>
              </div>
            )}

            {/* URL */}
            {tab === 'url' && (
              <div>
                <div className="form-group">
                  <label>Hosted PWA URL</label>
                  <input className="input" type="url" placeholder="https://mypwa.app" />
                </div>
                <p style={{color:'var(--muted)',fontSize:'0.87rem',lineHeight:1.7,margin:'16px 0 24px'}}>We'll crawl your PWA, verify the manifest and service worker, scan all loaded scripts, and create your store listing with a full trust report.</p>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label>App Name <span className={styles.required}>*</span></label>
                    <input className={`input ${errors.appName ? styles.inputError : ''}`} placeholder="My Awesome App" value={appName} onChange={e => { setAppName(e.target.value); if (errors.appName) setErrors(prev => ({ ...prev, appName: undefined })) }} />
                    {errors.appName && <span className={styles.fieldError}>{errors.appName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Category <span className={styles.required}>*</span></label>
                    <select className={`input ${errors.category ? styles.inputError : ''}`} value={category} onChange={e => { setCategory(e.target.value); if (errors.category) setErrors(prev => ({ ...prev, category: undefined })) }}>
                      <option value="">Select a category…</option>
                      {['Productivity','Finance','Health','Entertainment','Developer Tools','Education'].map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <span className={styles.fieldError}>{errors.category}</span>}
                  </div>
                  <div className="form-group">
                    <label>Privacy Policy URL <span className={styles.required}>*</span></label>
                    <input className={`input ${errors.privacyUrl ? styles.inputError : ''}`} type="url" placeholder="https://yoursite.com/privacy" value={privacyUrl} onChange={e => { setPrivacyUrl(e.target.value); if (errors.privacyUrl) setErrors(prev => ({ ...prev, privacyUrl: undefined })) }} />
                    {errors.privacyUrl && <span className={styles.fieldError}>{errors.privacyUrl}</span>}
                  </div>
                  <div className="form-group">
                    <label>Contact Email <span className={styles.required}>*</span></label>
                    <input className={`input ${errors.contactEmail ? styles.inputError : ''}`} type="email" placeholder="hello@yourapp.com" value={contactEmail} onChange={e => { setContactEmail(e.target.value); if (errors.contactEmail) setErrors(prev => ({ ...prev, contactEmail: undefined })) }} />
                    {errors.contactEmail && <span className={styles.fieldError}>{errors.contactEmail}</span>}
                  </div>
                </div>
                <button className="btn btn-primary" style={{marginTop:24}} onClick={startScan}>🔍 Scan & List</button>
              </div>
            )}
          </div>
        </div>

        {/* Scan progress */}
        {scanning && (
          <div className={styles.scanSection}>
            <h2 className="display" style={{fontSize:'1.6rem',marginBottom:20}}>Running Safety Pipeline</h2>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>{SCAN_STEPS[Math.min(scanIdx,SCAN_STEPS.length-1)]?.label || 'Initializing...'}</span>
              <span className="mono" style={{fontSize:'0.82rem',color:'var(--muted)'}}>{pct}%</span>
            </div>
            <div className={styles.progressBar}><div className={styles.progressFill} style={{width:`${pct}%`}} /></div>

            <div className={styles.scanLog} ref={logRef}>
              {logs.map((s, i) => (
                <div key={i} className={`${styles.logLine} ${styles[`log_${s.cls}`]}`}>{s.text}</div>
              ))}
            </div>

            {done && (
              <div className={styles.decisionBanner}>
                <div>
                  <h3 style={{color:'var(--accent)'}}>✅ ALLOW — Ready to Publish</h3>
                  <p style={{color:'var(--muted)',fontSize:'0.85rem',marginTop:4}}>Risk score: 12/100. No critical issues found.</p>
                </div>
                <div style={{display:'flex',gap:12}}>
                  <Link to="/report/focusflow" className="btn btn-ghost">View Full Report</Link>
                  <button className="btn btn-primary" onClick={() => toast('🎉 Your app is live on SafeLaunch!')}>Publish Now</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
