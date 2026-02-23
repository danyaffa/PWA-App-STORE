import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { SCAN_STEPS } from '../utils/data.js'
import { useToast } from '../hooks/useToast.jsx'
import styles from './Publish.module.css'

const STEPS = ['Upload', 'Configure', 'Scan', 'Publish']

export default function Publish() {
  const [tab,        setTab]        = useState('zip')
  const [step,       setStep]       = useState(1)
  const [fileName,   setFileName]   = useState(null)
  const [ghPreview,  setGhPreview]  = useState(null)
  const [scanning,   setScanning]   = useState(false)
  const [scanIdx,    setScanIdx]    = useState(-1)
  const [logs,       setLogs]       = useState([])
  const [done,       setDone]       = useState(false)
  const { toast, ToastContainer } = useToast()
  const logRef = useRef()

  function handleFile(e) {
    const f = e.target.files?.[0] || e.dataTransfer?.files?.[0]
    if (f) { setFileName(f.name); setStep(2) }
  }

  function handleGhInput(val) {
    if (val.length > 6) {
      setGhPreview(val.replace('https://','').replace('github.com/',''))
    }
  }

  function startScan() {
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
                  <div className="form-group"><label>App Name</label><input className="input" placeholder="My Awesome App" /></div>
                  <div className="form-group"><label>Category</label>
                    <select className="input">
                      {['Productivity','Finance','Health','Entertainment','Developer Tools','Education'].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Privacy Policy URL</label><input className="input" type="url" placeholder="https://yoursite.com/privacy" /></div>
                  <div className="form-group"><label>Contact Email</label><input className="input" type="email" placeholder="hello@yourapp.com" /></div>
                </div>
                <div className={styles.btnRow}>
                  <button className="btn btn-primary" onClick={startScan}>🚀 Build & Scan</button>
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
                <button className="btn btn-primary" onClick={startScan}>🔍 Scan & List</button>
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
