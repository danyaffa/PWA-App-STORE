import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../hooks/useToast.js'
import SEO from '../components/SEO.jsx'
import styles from './Dashboard.module.css'

const STATS = [
  { label: 'Total Installs', value: '24,891', sub: '↑ 12% this month',     subColor: 'var(--accent)' },
  { label: 'Active Apps',    value: '4',       sub: '1 pending review',     subColor: 'var(--warn)' },
  { label: 'Avg Risk Score', value: '9',       sub: 'All clean',            subColor: 'var(--accent)', valueColor: 'var(--accent)' },
  { label: 'Trust Score',    value: '92',      sub: 'Trusted developer',    subColor: 'var(--accent)', valueColor: 'var(--accent)' },
]

const APPS = [
  { icon:'🎨', name:'Excalidraw',  ver:'v2.3.1', date:'14 Jan 2026', status:'live',   score:3,  installs:'2,100,000', id:'excalidraw' },
  { icon:'🔐', name:'Bitwarden',   ver:'v1.8.0', date:'8 Jan 2026',  status:'live',   score:3,  installs:'1,500,000', id:'bitwarden' },
  { icon:'⚡', name:'StackBlitz',  ver:'v3.1.0', date:'2 Feb 2026',  status:'review', score:4,  installs:'1,200,000', id:'stackblitz' },
  { icon:'📝', name:'Notion',      ver:'v1.0.0', date:'Draft',       status:'draft',  score:null,installs:'—',       id:'notion' },
]

const ACTIVITY = [
  { color:'var(--accent)',  text:<><strong>Excalidraw</strong> — Continuous rescan passed. Risk: 3. No new findings.</>,       time:'22 Feb 2026' },
  { color:'var(--warn)',    text:<><strong>StackBlitz v3.1.0</strong> — Sent to Trust Ops review queue. Risk score: 4.</>,     time:'20 Feb 2026' },
  { color:'var(--accent)',  text:<><strong>Bitwarden v1.8.0</strong> — Rescan passed. No new vulnerabilities.</>,              time:'20 Feb 2026' },
  { color:'var(--accent2)', text:<><strong>StackBlitz v3.1.0</strong> — Build completed in 41s. Scan triggered.</>,            time:'19 Feb 2026' },
  { color:'var(--accent)',  text:<><strong>Excalidraw v2.3.1</strong> — Published live. 0 critical findings.</>,               time:'14 Jan 2026' },
]

const NAV = [
  { icon:'📊', label:'Dashboard',   href:'/dashboard', active:true  },
  { icon:'📦', label:'My Apps',     href:null },
  { icon:'🚀', label:'Submit App',  href:'/publish' },
  { icon:'📈', label:'Analytics',   href:null },
  { icon:'🛡️', label:'Scan History',href:null },
  { icon:'📋', label:'Reports',     href:'/report/focusflow' },
  { icon:'🔔', label:'Alerts',      href:null, badge:2 },
  { icon:'⚙️', label:'Settings',   href:null },
  { icon:'💳', label:'Billing',     href:null },
]

export default function Dashboard() {
  const { toast, ToastContainer } = useToast()
  const { user, logout, isConfigured } = useAuth()
  const navigate = useNavigate()

  // Read from localStorage as fallback when Firebase user is unavailable
  const localAuth = (() => {
    try { return JSON.parse(localStorage.getItem('sl_auth') || 'null') }
    catch { return null }
  })()

  async function handleSignOut() {
    try {
      if (isConfigured) {
        await logout()
      }
    } catch {
      // Firebase sign out failed, continue with local cleanup
    }
    localStorage.removeItem('sl_auth')
    localStorage.removeItem('sl_promo_code')
    localStorage.removeItem('sl_billing_status')
    toast('Signed out')
    navigate('/')
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || localAuth?.company || localAuth?.email?.split('@')[0] || 'Publisher'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className={styles.layout}>
      <SEO title="Dashboard — SafeLaunch" description="Manage your published PWA apps, view analytics, and monitor safety scans." />

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logo}>Safe<span>Launch</span></Link>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>Publisher</div>
          {NAV.slice(0,4).map(n => <NavItem key={n.label} n={n} toast={toast} />)}
        </div>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Safety</div>
          {NAV.slice(4,7).map(n => <NavItem key={n.label} n={n} toast={toast} />)}
        </div>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Account</div>
          {NAV.slice(7).map(n => <NavItem key={n.label} n={n} toast={toast} />)}
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.pubCard}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <div className={styles.pubName}>{displayName}</div>
              <div className={styles.pubPlan}>Creator Pro</div>
            </div>
          </div>
          <button className={`btn btn-ghost btn-sm ${styles.signOutBtn}`} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={`display ${styles.pageTitle}`}>Dashboard</h1>
          <div style={{display:'flex',gap:12}}>
            <Link to="/publish" className="btn btn-primary">+ Submit New App</Link>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {STATS.map(s => (
            <div key={s.label} className={`card ${styles.statCard}`}>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={`display ${styles.statValue}`} style={{ color: s.valueColor }}>{s.value}</div>
              <div className={styles.statSub} style={{ color: s.subColor }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Apps table */}
        <div className={styles.sectionHead}>
          <span style={{ fontWeight:700 }}>My Apps</span>
          <Link to="/publish" className="btn btn-ghost btn-sm">Submit New →</Link>
        </div>
        <div className={`card ${styles.table}`}>
          <div className={styles.tblHead}><span>App</span><span>Status</span><span>Risk</span><span>Installs</span><span>Actions</span></div>
          {APPS.map(a => (
            <div key={a.id} className={styles.tblRow}>
              <div className={styles.tblApp}>
                <div className={styles.tblIcon}>{a.icon}</div>
                <div>
                  <div style={{ fontWeight:700 }}>{a.name}</div>
                  <div style={{ fontSize:'0.75rem',color:'var(--muted)',fontFamily:'var(--font-mono)' }}>{a.ver} · {a.date}</div>
                </div>
              </div>
              <div><span className={`badge badge-${a.status}`}>{a.status.toUpperCase()}</span></div>
              <div style={{ fontFamily:'var(--font-mono)',fontWeight:700,color:a.score==null?'var(--muted)':a.score<30?'var(--accent)':'var(--warn)' }}>{a.score ?? '—'}</div>
              <div style={{ color:'var(--muted)',fontSize:'0.85rem' }}>{a.installs}</div>
              <div className={styles.tblActions}>
                <Link to={`/report/${a.id}`} className={styles.iconBtn} title="Report">📋</Link>
                <button className={styles.iconBtn} onClick={() => toast(`Edit ${a.name}`)}>✏️</button>
                <button className={styles.iconBtn} onClick={() => toast('Submit update')}>📤</button>
              </div>
            </div>
          ))}
        </div>

        {/* Developer Metrics */}
        <div className={styles.sectionHead}>
          <span style={{ fontWeight:700 }}>Developer Metrics</span>
        </div>
        <div className={styles.statsRow} style={{ marginBottom: 32 }}>
          {[
            { label: 'Ranking Score', value: '88', bar: 88, color: 'var(--accent)' },
            { label: 'Safety Score', value: '95', bar: 95, color: 'var(--accent)' },
            { label: 'Install Velocity', value: '85', bar: 85, color: 'var(--accent2)' },
            { label: 'Retention', value: '72%', bar: 72, color: 'var(--accent)' },
          ].map(m => (
            <div key={m.label} className={`card ${styles.statCard}`}>
              <div className={styles.statLabel}>{m.label}</div>
              <div className={`display ${styles.statValue}`} style={{ color: m.color }}>{m.value}</div>
              <div style={{ height: 4, background: 'var(--bg)', borderRadius: 2, marginTop: 8 }}>
                <div style={{ height: '100%', width: `${m.bar}%`, background: m.color, borderRadius: 2, transition: 'width .8s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Alerts + Activity */}
        <div className={styles.bottomGrid}>
          <div>
            <div className={styles.sectionHead}><span style={{fontWeight:700}}>Alerts <span style={{background:'rgba(255,77,109,.15)',color:'var(--danger)',borderRadius:100,padding:'2px 8px',fontSize:'0.7rem'}}>2 new</span></span></div>
            <div className="card" style={{padding:20,display:'flex',flexDirection:'column',gap:10}}>
              <div className={styles.alertBox} style={{borderColor:'rgba(255,184,77,.3)',background:'rgba(255,184,77,.06)'}}>
                <span style={{color:'var(--warn)',fontWeight:700}}>DataDash</span> — New CVE in axios@1.6.0. Review needed.
              </div>
              <div className={styles.alertBox} style={{borderColor:'rgba(255,184,77,.3)',background:'rgba(255,184,77,.06)'}}>
                <span style={{color:'var(--warn)',fontWeight:700}}>DataDash</span> — Awaiting Trust Ops review for 3 days.
              </div>
            </div>
          </div>
          <div>
            <div className={styles.sectionHead}><span style={{fontWeight:700}}>Recent Activity</span></div>
            <div className="card" style={{overflow:'hidden'}}>
              {ACTIVITY.map((a, i) => (
                <div key={i} className={styles.actRow}>
                  <div className={styles.actDot} style={{background:a.color}} />
                  <div style={{fontSize:'0.85rem',lineHeight:1.5,flex:1}}>{a.text}</div>
                  <div style={{fontSize:'0.75rem',color:'var(--muted)',fontFamily:'var(--font-mono)',flexShrink:0}}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <ToastContainer />
    </div>
  )
}

function NavItem({ n, toast }) {
  const content = (
    <div className={`${styles.navItem} ${n.active ? styles.navActive : ''}`}
      onClick={() => !n.href && toast(`${n.icon} ${n.label}`)}>
      <span className={styles.navIcon}>{n.icon}</span>
      {n.label}
      {n.badge && <span className={styles.navBadge}>{n.badge}</span>}
    </div>
  )
  return n.href ? <Link to={n.href} style={{textDecoration:'none'}}>{content}</Link> : content
}
