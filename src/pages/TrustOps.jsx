import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../hooks/useToast.jsx'
import styles from './TrustOps.module.css'

const QUEUE = [
  {
    id: 'cryptotracker',
    name: 'CryptoTracker Pro v2.1',
    category: 'Finance',
    publisher: 'ProFinance Ltd',
    date: '20 Feb 2026',
    score: 43,
    level: 'review',
    findings: [
      { sev:'high',   msg:'Suspicious redirect chain — 3 hops to undeclared domain api3.trackr.io (+25 pts)' },
      { sev:'medium', msg:'Unverified third-party API endpoint in dynamic analysis (+10 pts)' },
      { sev:'medium', msg:'CSP header missing from manifest (+8 pts)' },
      { sev:'pass',   msg:'No secrets, malware, or miner code detected' },
      { sev:'pass',   msg:'Privacy policy and contact email verified' },
    ],
  },
  {
    id: 'videoeditor',
    name: 'FreeVideoEditor v1.0',
    category: 'Entertainment',
    publisher: 'New Publisher (3 days)',
    date: '21 Feb 2026',
    score: 72,
    level: 'block',
    findings: [
      { sev:'critical', msg:'Crypto-miner bytecode detected in bundle (Coinhive variant) (+60 pts)' },
      { sev:'critical', msg:'eval() called on externally fetched string — RCE path (+60 pts, capped)' },
      { sev:'high',     msg:'Heavy obfuscation detected (score: 0.91, threshold: 0.65) (+25 pts)' },
      { sev:'medium',   msg:'Publisher account only 3 days old (+8 pts)' },
    ],
  },
  {
    id: 'healthsync',
    name: 'HealthSync Dashboard v3.2',
    category: 'Health',
    publisher: 'WellnessApp Co',
    date: '22 Feb 2026',
    score: 38,
    level: 'review',
    findings: [
      { sev:'medium', msg:'Privacy policy URL returns 404 — required for Health category (+10 pts)' },
      { sev:'medium', msg:'Contact email not verified (+10 pts)' },
      { sev:'medium', msg:'Medical claim in description: "cures anxiety" (+8 pts)' },
      { sev:'pass',   msg:'No malware, secrets, or suspicious network calls detected' },
      { sev:'pass',   msg:'Publisher: clean 6-month history, 0 prior strikes' },
    ],
  },
]

const SEV_COLOR = { critical:'var(--danger)', high:'#ff8c4d', medium:'var(--warn)', pass:'var(--accent)' }

export default function TrustOps() {
  const [open, setOpen]     = useState(null)
  const [modal, setModal]   = useState(null)
  const { toast, ToastContainer } = useToast()

  function confirm(action, name) {
    setModal({ action, name })
  }
  function doConfirm() {
    const { action, name } = modal
    toast(action === 'block' ? `🚫 ${name} blocked.` : `✅ ${name} approved.`)
    setModal(null)
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logo}>Safe<span>Launch</span> <span className={styles.adminTag}>ADMIN</span></Link>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Trust Ops</div>
          {[['⚖️','Review Queue',3], ['📊','Overview',null], ['🚫','Blocked',12], ['📋','All Apps',null]].map(([icon,label,badge]) => (
            <div key={label} className={`${styles.navItem} ${label==='Review Queue'?styles.navActive:''}`} onClick={() => toast(`${icon} ${label}`)}>
              <span>{icon}</span>{label}
              {badge && <span className={styles.navBadge}>{badge}</span>}
            </div>
          ))}
        </div>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Policy</div>
          {[['📜','Policy Rules'], ['👥','Publishers'], ['🚩','Abuse Reports'], ['📝','Audit Log']].map(([icon,label]) => (
            <div key={label} className={styles.navItem} onClick={() => toast(`${icon} ${label}`)}><span>{icon}</span>{label}</div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={`display ${styles.pageTitle}`}>Review Queue</h1>
          <div style={{display:'flex',gap:10}}>
            <button className="btn btn-ghost" onClick={() => toast('🔄 Refreshed')}>Refresh</button>
            <button className="btn btn-ghost" onClick={() => toast('📤 Exported CSV')}>Export</button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.qStats}>
          {[['3','Pending Review','var(--danger)'], ['12','Reviewed Today','var(--warn)'], ['847','Auto-Approved','var(--accent)'], ['23','Blocked (30d)','var(--danger)']].map(([n,l,c])=>(
            <div key={l} className={`card ${styles.qStat}`}>
              <div className={`display ${styles.qNum}`} style={{color:c}}>{n}</div>
              <div className={styles.qLabel}>{l}</div>
            </div>
          ))}
        </div>

        {/* Queue */}
        {QUEUE.map(item => (
          <div key={item.id} className={`${styles.qItem} ${styles[`q_${item.level}`]}`}>
            <div className={styles.qHeader} onClick={() => setOpen(open===item.id?null:item.id)}>
              <div className={`display ${styles.qScore}`} style={{color: item.level==='block'?'var(--danger)':'var(--warn)'}}>{item.score}</div>
              <div className={styles.qInfo}>
                <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:4}}>
                  <strong>{item.name}</strong>
                  <span className={`badge ${item.level==='block'?'badge-fail':'badge-warn'}`}>{item.level.toUpperCase()}</span>
                </div>
                <div style={{fontSize:'0.8rem',color:'var(--muted)',fontFamily:'var(--font-mono)'}}>{item.category} · {item.publisher} · {item.date}</div>
              </div>
              <div className={styles.qActions} onClick={e => e.stopPropagation()}>
                {item.level !== 'block' && <button className="btn btn-ghost btn-sm" onClick={() => confirm('approve', item.name)}>Approve</button>}
                <button className="btn btn-sm" style={{background:'var(--warn)',color:'#0a0a0f'}} onClick={() => toast('📬 Fixes requested')}>Request Fixes</button>
                <button className="btn btn-danger btn-sm" onClick={() => confirm('block', item.name)}>Block</button>
              </div>
            </div>

            {open === item.id && (
              <div className={styles.qExpand}>
                {item.findings.map((f, i) => (
                  <div key={i} className={styles.finding}>
                    <div className={styles.fdot} style={{background: SEV_COLOR[f.sev]}} />
                    <div style={{fontFamily:'var(--font-mono)',fontSize:'0.82rem'}}>{f.msg}</div>
                  </div>
                ))}
                <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:4}}>
                  {item.level !== 'block' && <button className="btn btn-primary btn-sm" onClick={() => confirm('approve', item.name)}>✅ Approve</button>}
                  <button className="btn btn-danger btn-sm" onClick={() => confirm('block', item.name)}>🚫 Block</button>
                  <Link to={`/report/${item.id}`} className="btn btn-ghost btn-sm">📋 Full Report</Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Modal */}
      {modal && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className="display" style={{fontSize:'1.6rem',marginBottom:12}}>
              {modal.action === 'block' ? `Block ${modal.name}?` : `Approve ${modal.name}?`}
            </h3>
            <p style={{color:'var(--muted)',fontSize:'0.88rem',lineHeight:1.7,marginBottom:24}}>
              {modal.action === 'block'
                ? 'This will block the app, notify the publisher, and add a strike to their account. Logged to audit trail.'
                : 'This will approve the submission and make it available for publish.'}
            </p>
            <div style={{display:'flex',gap:12}}>
              <button className={`btn ${modal.action==='block'?'btn-danger':'btn-primary'}`} onClick={doConfirm}>
                {modal.action === 'block' ? '🚫 Block App' : '✅ Approve'}
              </button>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}
