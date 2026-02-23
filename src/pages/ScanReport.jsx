import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { APPS } from '../utils/data.js'
import { useToast } from '../hooks/useToast.js'
import styles from './ScanReport.module.css'

const STAGES = [
  { num:'01', icon:'🔍', title:'Pre-Build Static Intake', badge:'pass',
    findings:[
      ['pass', 'No binary blobs or obfuscated executables in source tree'],
      ['pass', 'Secrets scan: no API keys, SSH keys, tokens, or .env credentials'],
      ['pass', 'Malware hash check: 0 of 4,218,441 signatures matched'],
      ['pass', 'Framework detected: React 18.2.0 (auto-detected)'],
    ]},
  { num:'02', icon:'📦', title:'Sandboxed Build + SBOM', badge:'pass',
    findings:[
      ['pass', 'Build succeeded in 34s — node:20-alpine sandbox, network egress OFF'],
      ['pass', 'SBOM generated: 47 packages inventoried (CycloneDX)'],
      ['pass', 'CVE scan: 0 critical, 0 high, 0 medium CVEs in dependency tree'],
      ['pass', 'postinstall scripts: no unexpected network calls'],
    ]},
  { num:'03', icon:'🔬', title:'Post-Build Artifact Analysis', badge:'pass',
    findings:[
      ['pass', 'No hidden iframes or drive-by download patterns'],
      ['pass', 'Crypto-miner bytecode scan: no Coinhive or similar signatures'],
      ['pass', 'Obfuscation score: 0.09 (threshold: 0.65) — normal Vite minification'],
      ['pass', 'Clipboard hijack pattern: not detected'],
    ]},
  { num:'04', icon:'🤖', title:'Dynamic Sandbox Analysis (DAST)', badge:'pass',
    findings:[
      ['pass', 'Outbound calls during 60s headless session: 0. No external domains.'],
      ['pass', 'Device fingerprinting: no canvas probe, no AudioContext, no battery API'],
      ['pass', 'Permission prompts: none triggered during session'],
      ['pass', 'Redirect chains: none detected'],
    ]},
  { num:'05', icon:'📋', title:'Policy & Compliance', badge:'pass',
    findings:[
      ['pass', 'Privacy policy: https://focusflow.app/privacy — verified live (HTTP 200)'],
      ['pass', 'Contact email: hello@focusflow.app — format valid'],
      ['pass', 'Category rules (Productivity): no restricted claims in listing copy'],
      ['pass', 'PWA installability: manifest.json valid, service worker registered, HTTPS ✓'],
    ]},
  { num:'06', icon:'⭐', title:'Reputation & History', badge:'pass',
    findings:[
      ['pass', 'Publisher account age: 8 months (created May 2025)'],
      ['pass', 'Prior strikes: 0'],
      ['pass', 'Prior clean versions: 3 (v2.2.0, v2.1.5, v2.0.0) — all ALLOW decisions'],
      ['pass', 'User abuse report rate: 0.00% (0 / 12,048 installs)'],
      ['bonus','Trusted publisher bonus applied: −10 pts'],
    ]},
]

const LOG = [
  ['info',  '[2026-01-14 02:41:00] [init] Pulling image node:20-alpine...'],
  ['info',  '[2026-01-14 02:41:04] [init] Sandbox started. Network egress: OFF'],
  ['muted', '[2026-01-14 02:41:05] [build] Detected: React + Vite'],
  ['muted', '[2026-01-14 02:41:05] [build] Running: npm ci'],
  ['muted', '[2026-01-14 02:41:18] [build] 47 packages installed'],
  ['ok',    '[2026-01-14 02:41:34] [build] ✓ Build complete — 2.1MB output in /dist'],
  ['ok',    '[2026-01-14 02:41:35] [sbom] ✓ 47 packages inventoried'],
  ['ok',    '[2026-01-14 02:41:38] [cve]  ✓ 0 critical, 0 high, 0 medium CVEs'],
  ['ok',    '[2026-01-14 02:41:41] [sast] ✓ No iframes, miners. Obfuscation: 0.09'],
  ['ok',    '[2026-01-14 02:42:41] [dast] ✓ 0 outbound calls, 0 fingerprint attempts'],
  ['ok',    '[2026-01-14 02:42:41] [policy] ✓ Privacy URL 200, contact email valid'],
  ['ok',    '[2026-01-14 02:42:42] [rep]  ✓ Publisher clean, −10 pts applied'],
  ['ok',    '[2026-01-14 02:42:42] [done] RISK SCORE: 5 / 100 → DECISION: ALLOW ✅'],
]

const SEV_COLOR = { pass:'var(--accent)', bonus:'var(--accent2)', warn:'var(--warn)', fail:'var(--danger)' }

export default function ScanReport() {
  const { id } = useParams()
  const { toast, ToastContainer } = useToast()
  const app = APPS.find(a => a.id === id) || APPS[0]

  return (
    <>
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <Link to={`/app/${app.id}`} style={{ color:'var(--muted)', fontSize:'0.85rem' }}>← Back to App Detail</Link>

        {/* Report header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <div className={styles.headerIcon}>{app.icon}</div>
              <div>
                <h1 className={`display ${styles.reportName}`}>{app.name} — Scan Report</h1>
                <div style={{fontSize:'0.82rem',color:'var(--muted)',fontFamily:'var(--font-mono)',marginTop:4}}>v2.3.1 · Build a4f2c91 · Scanned 14 Jan 2026 02:41 UTC</div>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className={`display ${styles.scoreHuge}`}>{app.score}</div>
              <div style={{fontSize:'0.75rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.1em'}}>/ 100 risk</div>
            </div>
          </div>

          <div className={styles.resultGrid}>
            {[['Critical',0,'var(--danger)'],['High',0,'#ff8c4d'],['Medium',0,'var(--warn)'],['Passed',16,'var(--accent)']].map(([l,n,c])=>(
              <div key={l} className={styles.resultItem}><div className={`display ${styles.resultNum}`} style={{color:c}}>{n}</div><div className={styles.resultLbl}>{l}</div></div>
            ))}
          </div>

          <div className={styles.decision}>
            <span style={{fontSize:'1.4rem'}}>✅</span>
            <div>
              <strong style={{color:'var(--accent)'}}>ALLOW — Published to Store</strong>
              <div style={{color:'var(--muted)',fontSize:'0.82rem',marginTop:3}}>No critical, high, or medium findings. All 16 checks passed.</div>
            </div>
            <Link to="/publish" className="btn btn-primary btn-sm" style={{marginLeft:'auto'}}>Submit Your App →</Link>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className="btn btn-ghost btn-sm" onClick={() => toast('📄 PDF downloaded')}>📄 Download PDF</button>
          <button className="btn btn-ghost btn-sm" onClick={() => toast('🔗 Link copied!')}>🔗 Share Report</button>
          <button className="btn btn-ghost btn-sm" onClick={() => toast('📋 SBOM exported')}>📋 Export SBOM</button>
        </div>

        {/* Pipeline stages */}
        {STAGES.map(s => (
          <div key={s.num} className={styles.stage}>
            <div className={styles.stageHead}>
              <div className={styles.stageIcon}>{s.icon}</div>
              <div className={styles.stageTitle}>{s.num} — {s.title}</div>
              <span className={`badge badge-${s.badge}`} style={{marginLeft:'auto'}}>{s.badge.toUpperCase()}</span>
            </div>
            {s.findings.map((f, i) => (
              <div key={i} className={styles.finding}>
                <div className={styles.fdot} style={{background: SEV_COLOR[f[0]] || 'var(--muted)'}} />
                <div style={{flex:1,fontFamily:'var(--font-mono)',fontSize:'0.82rem'}}>{f[1]}</div>
                <span className={`badge badge-${f[0]==='bonus'?'muted':'pass'}`} style={{flexShrink:0}}>{f[0]==='bonus'?'BONUS':'PASS'}</span>
              </div>
            ))}
          </div>
        ))}

        {/* SBOM snippet */}
        <div className={styles.stage}>
          <div className={styles.stageHead}>
            <div className={styles.stageIcon}>🗒️</div>
            <div className={styles.stageTitle}>SBOM — Top Dependencies</div>
          </div>
          <table className={styles.sbom}>
            <thead><tr>{['Package','Version','License','CVEs'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {[['react','18.2.0','MIT'],['react-dom','18.2.0','MIT'],['vite','5.0.8','MIT'],['workbox-sw','7.0.0','MIT'],['date-fns','3.2.0','MIT']].map(([p,v,l])=>(
                <tr key={p}><td>{p}</td><td>{v}</td><td>{l}</td><td style={{color:'var(--accent)'}}>None</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Build log */}
        <div className={styles.stage}>
          <div className={styles.stageHead}>
            <div className={styles.stageIcon}>💻</div>
            <div className={styles.stageTitle}>Build Log</div>
          </div>
          <div className={styles.log}>
            {LOG.map(([cls, line], i) => (
              <div key={i} className={styles[`log_${cls}`]}>{line}</div>
            ))}
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:16,color:'var(--muted)',fontSize:'0.8rem',fontFamily:'var(--font-mono)'}}>
          Report ID: SL-2026-a4f2c91 · SafeLaunch Trust Engine v3.1
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
