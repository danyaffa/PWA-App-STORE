import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { SCAN_STEPS, CATEGORIES } from '../utils/data.js'
import { useToast } from '../hooks/useToast.js'
import styles from './Publish.module.css'

const STEPS = ['Upload', 'Configure', 'Scan', 'Publish']

const MOCKUP_TYPES = ['editor','list','grid','player','chat','map','chart','feed','form','gauge','board','game','cards']

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
  const [tags,          setTags]          = useState('')
  const [permissions,   setPermissions]   = useState('')
  const [appSize,       setAppSize]       = useState('')
  const [pricingType,   setPricingType]   = useState('free')
  const [priceAmount,   setPriceAmount]   = useState('')
  const [screenshots,   setScreenshots]   = useState([
    { title: '', caption: '', color: '#6c5ce7', mockup: 'editor' },
    { title: '', caption: '', color: '#00b894', mockup: 'list' },
    { title: '', caption: '', color: '#0984e3', mockup: 'grid' },
    { title: '', caption: '', color: '#e17055', mockup: 'chart' },
  ])

  const [errors,     setErrors]     = useState({})
  const [published,  setPublished]  = useState(false)
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

  function updateScreenshot(index, field, value) {
    setScreenshots(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const pct = scanIdx >= 0 ? SCAN_STEPS[Math.min(scanIdx, SCAN_STEPS.length-1)].pct : 0

  // Build the app icon - use emoji if single char or use first letter
  const appIcon = iconUrl.trim() || (appName.trim() ? appName.trim().charAt(0).toUpperCase() : '📦')

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
                </div>
              </div>
            )}

            {/* URL */}
            {tab === 'url' && (
              <div>
                <div className="form-group">
                  <label>Hosted PWA URL</label>
                  <input className="input" type="url" placeholder="https://mypwa.app" />
                </div>
                <p style={{color:'var(--muted)',fontSize:'0.87rem',lineHeight:1.7,margin:'16px 0 0'}}>We'll crawl your PWA, verify the manifest and service worker, scan all loaded scripts, and create your store listing with a full trust report.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── App Details Section ── */}
        <div className={`card ${styles.detailsCard}`}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsIcon}>📋</div>
            <div>
              <h2 className={styles.detailsTitle}>App Details</h2>
              <p className={styles.detailsSub}>Provide details about your app. This information will be displayed on your app's listing page.</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHead}>Basic Information</h3>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label>App Name <span className={styles.required}>*</span></label>
                <input className={`input ${errors.appName ? styles.inputError : ''}`} placeholder="My Awesome App" value={appName} onChange={e => { setAppName(e.target.value); clearError('appName') }} />
                {errors.appName && <span className={styles.fieldError}>{errors.appName}</span>}
              </div>
              <div className="form-group">
                <label>Category <span className={styles.required}>*</span></label>
                <select className={`input ${errors.category ? styles.inputError : ''}`} value={category} onChange={e => { setCategory(e.target.value); clearError('category') }}>
                  <option value="">Select a category…</option>
                  {CATEGORIES.filter(c => c !== 'All').map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className={styles.fieldError}>{errors.category}</span>}
              </div>
            </div>
            <div className="form-group" style={{marginTop:20}}>
              <label>Short Description <span className={styles.required}>*</span></label>
              <input className={`input ${errors.shortDesc ? styles.inputError : ''}`} placeholder="A brief one-line summary of your app" maxLength={120} value={shortDesc} onChange={e => { setShortDesc(e.target.value); clearError('shortDesc') }} />
              <div className={styles.charCount}>{shortDesc.length}/120</div>
              {errors.shortDesc && <span className={styles.fieldError}>{errors.shortDesc}</span>}
            </div>
            <div className="form-group" style={{marginTop:20}}>
              <label>Full Description <span className={styles.required}>*</span></label>
              <textarea className={`input ${styles.textarea} ${errors.fullDesc ? styles.inputError : ''}`} placeholder="Describe what your app does, its key features, and why users should install it." rows={4} value={fullDesc} onChange={e => { setFullDesc(e.target.value); clearError('fullDesc') }} />
              {errors.fullDesc && <span className={styles.fieldError}>{errors.fullDesc}</span>}
            </div>
          </div>

          {/* Developer & App Info */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHead}>Developer & App Info</h3>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label>Developer / Company Name <span className={styles.required}>*</span></label>
                <input className={`input ${errors.developerName ? styles.inputError : ''}`} placeholder="Your name or company" value={developerName} onChange={e => { setDeveloperName(e.target.value); clearError('developerName') }} />
                {errors.developerName && <span className={styles.fieldError}>{errors.developerName}</span>}
              </div>
              <div className="form-group">
                <label>Website URL</label>
                <input className={`input ${errors.websiteUrl ? styles.inputError : ''}`} type="url" placeholder="https://yourapp.com" value={websiteUrl} onChange={e => { setWebsiteUrl(e.target.value); clearError('websiteUrl') }} />
                {errors.websiteUrl && <span className={styles.fieldError}>{errors.websiteUrl}</span>}
              </div>
              <div className="form-group">
                <label>App Icon (emoji or URL)</label>
                <div className={styles.iconInput}>
                  <input className="input" placeholder="📦 or https://..." value={iconUrl} onChange={e => setIconUrl(e.target.value)} style={{flex:1}} />
                  <div className={styles.iconPreview}>
                    {iconUrl.trim() && /^https?:\/\//.test(iconUrl.trim())
                      ? <img src={iconUrl.trim()} alt="icon" style={{width:32,height:32,borderRadius:6,objectFit:'cover'}} />
                      : <span style={{fontSize:'1.5rem'}}>{appIcon}</span>
                    }
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Version</label>
                <input className="input" placeholder="1.0.0" value={appVersion} onChange={e => setAppVersion(e.target.value)} />
              </div>
              <div className="form-group">
                <label>App Size</label>
                <input className="input" placeholder="2.4 MB" value={appSize} onChange={e => setAppSize(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input className="input" placeholder="productivity, offline, notes" value={tags} onChange={e => setTags(e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{marginTop:20}}>
              <label>Permissions (comma-separated)</label>
              <input className="input" placeholder="Internet access, Notifications, Camera (optional)" value={permissions} onChange={e => setPermissions(e.target.value)} />
              <span className={styles.fieldHint}>List the device capabilities your app requires, e.g. "Internet access", "Location", "None — fully offline"</span>
            </div>
            <div className="form-group" style={{marginTop:20}}>
              <label>What's New</label>
              <textarea className={`input ${styles.textarea}`} placeholder="Describe recent changes and improvements..." rows={3} value={whatsNew} onChange={e => setWhatsNew(e.target.value)} />
            </div>
          </div>

          {/* Pricing */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHead}>Pricing</h3>
            <p className={styles.sectionHint}>Choose whether your app is free or paid. Paid apps will show the price on the store listing and require payment before install.</p>
            <div className={styles.pricingToggle}>
              <button
                type="button"
                className={`${styles.pricingOption} ${pricingType === 'free' ? styles.pricingActive : ''}`}
                onClick={() => { setPricingType('free'); setPriceAmount('') }}
              >
                <span className={styles.pricingIcon}>🆓</span>
                <span className={styles.pricingLabel}>Free</span>
                <span className={styles.pricingDesc}>Users can install at no cost</span>
              </button>
              <button
                type="button"
                className={`${styles.pricingOption} ${pricingType === 'paid' ? styles.pricingActive : ''}`}
                onClick={() => setPricingType('paid')}
              >
                <span className={styles.pricingIcon}>💰</span>
                <span className={styles.pricingLabel}>Paid</span>
                <span className={styles.pricingDesc}>Set a one-time purchase price</span>
              </button>
            </div>
            {pricingType === 'paid' && (
              <div className={styles.priceInputRow}>
                <label>Price (USD) <span className={styles.required}>*</span></label>
                <div className={styles.priceInputWrap}>
                  <span className={styles.priceCurrency}>$</span>
                  <input
                    className={`input ${errors.priceAmount ? styles.inputError : ''}`}
                    type="number"
                    min="0.99"
                    max="999.99"
                    step="0.01"
                    placeholder="4.99"
                    value={priceAmount}
                    onChange={e => { setPriceAmount(e.target.value); clearError('priceAmount') }}
                  />
                </div>
                {errors.priceAmount && <span className={styles.fieldError}>{errors.priceAmount}</span>}
                <span className={styles.fieldHint}>Minimum $0.99. Payments are processed via PayPal on the app detail page.</span>
              </div>
            )}
          </div>

          {/* Contact & Compliance */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHead}>Contact & Compliance</h3>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label>Privacy Policy URL <span className={styles.required}>*</span></label>
                <input className={`input ${errors.privacyUrl ? styles.inputError : ''}`} type="url" placeholder="https://yoursite.com/privacy" value={privacyUrl} onChange={e => { setPrivacyUrl(e.target.value); clearError('privacyUrl') }} />
                {errors.privacyUrl && <span className={styles.fieldError}>{errors.privacyUrl}</span>}
              </div>
              <div className="form-group">
                <label>Contact Email <span className={styles.required}>*</span></label>
                <input className={`input ${errors.contactEmail ? styles.inputError : ''}`} type="email" placeholder="hello@yourapp.com" value={contactEmail} onChange={e => { setContactEmail(e.target.value); clearError('contactEmail') }} />
                {errors.contactEmail && <span className={styles.fieldError}>{errors.contactEmail}</span>}
              </div>
            </div>
          </div>

          {/* Screenshots */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHead}>Screenshots</h3>
            <p className={styles.sectionHint}>Add up to 4 screenshots to showcase your app. Provide a title, caption, and choose a theme color and mockup type.</p>
            <div className={styles.screenshotGrid}>
              {screenshots.map((ss, i) => (
                <div key={i} className={styles.screenshotEntry}>
                  <div className={styles.ssPreviewBox} style={{background: `linear-gradient(135deg, ${ss.color}, ${ss.color}dd)`}}>
                    <span style={{fontSize:'0.7rem',color:'rgba(255,255,255,.7)',fontWeight:700}}>{ss.title || `Screen ${i + 1}`}</span>
                  </div>
                  <div className={styles.ssFields}>
                    <input className="input" placeholder="Title" value={ss.title} onChange={e => updateScreenshot(i, 'title', e.target.value)} style={{fontSize:'0.82rem'}} />
                    <input className="input" placeholder="Caption" value={ss.caption} onChange={e => updateScreenshot(i, 'caption', e.target.value)} style={{fontSize:'0.82rem'}} />
                    <div className={styles.ssColorRow}>
                      <input type="color" value={ss.color} onChange={e => updateScreenshot(i, 'color', e.target.value)} className={styles.colorPicker} />
                      <select className="input" value={ss.mockup} onChange={e => updateScreenshot(i, 'mockup', e.target.value)} style={{fontSize:'0.82rem',flex:1}}>
                        {MOCKUP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
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
            <button className="btn btn-ghost" onClick={() => toast('💾 Draft saved')}>Save Draft</button>
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
                  <button
                    className="btn btn-primary"
                    disabled={published}
                    style={published ? { background: '#22c55e', borderColor: '#22c55e', color: '#fff', opacity: 1 } : {}}
                    onClick={() => {
                      const slug = appName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                      const permList = permissions.trim()
                        ? permissions.split(',').map(p => p.trim()).filter(Boolean)
                        : []
                      const screenshotList = screenshots
                        .filter(s => s.title.trim() || s.caption.trim())
                        .map(s => ({ title: s.title, caption: s.caption, color: s.color, mockup: s.mockup }))
                      const newApp = {
                        id: slug || `app-${Date.now()}`,
                        icon: iconUrl.trim() && !/^https?:\/\//.test(iconUrl.trim()) ? iconUrl.trim() : '📦',
                        name: appName.trim(),
                        desc: shortDesc.trim() || `${appName.trim()} — published via SafeLaunch.`,
                        longDesc: fullDesc.trim(),
                        category: category,
                        price: pricingType === 'paid' ? parseFloat(priceAmount).toFixed(2) : 'Free',
                        developer: developerName.trim(),
                        url: websiteUrl.trim() || '',
                        size: appSize.trim() || 'N/A',
                        whatsNew: whatsNew.trim(),
                        permissions: permList.length > 0 ? permList : ['None — fully offline'],
                        screenshots: screenshotList,
                        tags: tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                        score: 12,
                        trust: 'green',
                        installs: '0',
                        rankingScore: 50,
                        safetyScore: 88,
                        averageRating: 0,
                        totalReviews: 0,
                        publishedAt: new Date().toISOString().split('T')[0],
                        developerTrust: 60,
                        installVelocity: 0,
                        badges: ['new', 'verified'],
                      }
                      try {
                        const existing = JSON.parse(localStorage.getItem('sl_published_apps') || '[]')
                        existing.push(newApp)
                        localStorage.setItem('sl_published_apps', JSON.stringify(existing))
                      } catch (e) { /* ignore */ }
                      setPublished(true)
                      toast('🎉 Your app is live on SafeLaunch!')
                    }}
                  >{published ? '✓ Published' : 'Publish Now'}</button>
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
