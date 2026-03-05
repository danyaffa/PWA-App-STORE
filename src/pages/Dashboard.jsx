import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../hooks/useToast.js'
import { loadPublishedApps, syncAllAppsToCloud, getAppsStoreStatus } from '../lib/appsStore.js'
import SEO from '../components/SEO.jsx'
import styles from './Dashboard.module.css'

const NAV = [
  { icon:'📊', label:'Dashboard',    href:'/dashboard', active:true },
  { icon:'📦', label:'My Apps',      anchor:'my-apps' },
  { icon:'🚀', label:'Submit App',   href:'/publish' },
  { icon:'📈', label:'Analytics',    soon:true },
  { icon:'🛡️', label:'Scan History', soon:true },
  { icon:'📋', label:'Reports',      soon:true },
  { icon:'🔔', label:'Alerts',       soon:true },
  { icon:'⚙️', label:'Settings',    soon:true },
  { icon:'💳', label:'Billing',      soon:true },
]

export default function Dashboard() {
  const { toast, ToastContainer } = useToast()
  const { user, logout, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    loadPublishedApps()
      .then(setApps)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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

  // Compute stats from real data
  const totalInstalls = apps.reduce((sum, a) => {
    const n = parseInt(String(a.installs || '0').replace(/,/g, ''), 10)
    return sum + (isNaN(n) ? 0 : n)
  }, 0)
  const avgRisk = apps.length
    ? Math.round(apps.reduce((s, a) => s + (a.score || 0), 0) / apps.length)
    : 0

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
        </div>
        <div className={styles.actionRow}>
          <Link to="/publish" className="btn btn-primary">+ Submit New App</Link>
          <Link to="/store" className="btn btn-ghost">View Store</Link>
          {apps.length > 0 && (
            <button
              className="btn btn-ghost"
              disabled={syncing}
              onClick={async () => {
                setSyncing(true)
                try {
                  const result = await syncAllAppsToCloud()
                  if (result.synced > 0 && result.failed === 0) {
                    toast(`Synced ${result.synced} app${result.synced > 1 ? 's' : ''} to cloud`)
                  } else if (result.synced > 0 && result.failed > 0) {
                    toast(`Synced ${result.synced}, failed ${result.failed}. Check console for details.`)
                    console.error('[Dashboard] Partial sync errors:', result.errors)
                  } else if (result.errors.length) {
                    // Show a more actionable error message
                    const detail = result.errors[0] || ''
                    if (detail.includes('not configured')) {
                      toast('Sync failed: Firebase not configured. Set env vars in Vercel dashboard.')
                    } else if (detail.includes('timed out')) {
                      toast('Sync failed: Request timed out. Try again in a moment.')
                    } else {
                      toast(`Sync failed: ${detail}`)
                    }
                    console.error('[Dashboard] Sync errors:', result.errors)
                  }
                } catch (e) {
                  toast(`Sync error: ${e?.message}`)
                } finally {
                  setSyncing(false)
                }
              }}
            >
              {syncing ? 'Syncing…' : 'Sync to Cloud'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total Installs', value: totalInstalls.toLocaleString(), sub: apps.length ? `Across ${apps.length} app${apps.length !== 1 ? 's' : ''}` : 'No apps yet', subColor: apps.length ? 'var(--accent)' : 'var(--muted)' },
            { label: 'Active Apps', value: String(apps.length), sub: apps.length ? 'Published' : 'Submit your first app', subColor: apps.length ? 'var(--accent)' : 'var(--muted)' },
            { label: 'Avg Risk Score', value: apps.length ? String(avgRisk) : '—', sub: !apps.length ? 'No data' : avgRisk < 30 ? 'All clean' : 'Needs attention', subColor: !apps.length ? 'var(--muted)' : avgRisk < 30 ? 'var(--accent)' : 'var(--warn)', valueColor: !apps.length ? undefined : avgRisk < 30 ? 'var(--accent)' : 'var(--warn)' },
            { label: 'Trust Score', value: '—', sub: 'Coming soon', subColor: 'var(--muted)' },
          ].map(s => (
            <div key={s.label} className={`card ${styles.statCard}`}>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={`display ${styles.statValue}`} style={{ color: s.valueColor }}>{s.value}</div>
              <div className={styles.statSub} style={{ color: s.subColor }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Apps table */}
        <div id="my-apps" className={styles.sectionHead}>
          <span style={{ fontWeight:700 }}>My Apps</span>
          <Link to="/publish" className="btn btn-ghost btn-sm">Submit New →</Link>
        </div>
        <div className={`card ${styles.table}`}>
          <div className={styles.tblHead}><span>App</span><span>Status</span><span>Risk</span><span>Installs</span><span>Actions</span></div>
          {loading ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted)' }}>Loading your apps…</div>
          ) : apps.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📦</div>
              You haven't published any apps yet.{' '}
              <Link to="/publish" style={{ color: 'var(--accent)' }}>Submit your first app →</Link>
            </div>
          ) : apps.map(a => (
            <div key={a.id} className={styles.tblRow}>
              <div className={styles.tblApp}>
                <div className={styles.tblIcon}>{a.icon || '🧩'}</div>
                <div>
                  <div style={{ fontWeight:700 }}>{a.name}</div>
                  <div style={{ fontSize:'0.75rem',color:'var(--muted)',fontFamily:'var(--font-mono)' }}>
                    {a.version ? `v${a.version}` : '—'} · {a.publishedAt || '—'}
                  </div>
                </div>
              </div>
              <div><span className="badge badge-live">LIVE</span></div>
              <div style={{ fontFamily:'var(--font-mono)',fontWeight:700,color: (a.score || 0) < 30 ? 'var(--accent)' : 'var(--warn)' }}>{a.score ?? '—'}</div>
              <div style={{ color:'var(--muted)',fontSize:'0.85rem' }}>{a.installs || '0'}</div>
              <div className={styles.tblActions}>
                <Link to={`/app/${a.id}`} className={styles.iconBtn} title="View listing">👁️</Link>
                <Link to={`/report/${a.id}`} className={styles.iconBtn} title="Scan report">📋</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Developer Metrics */}
        <div className={styles.sectionHead}>
          <span style={{ fontWeight:700 }}>Developer Metrics</span>
        </div>
        <div className={styles.statsRow} style={{ marginBottom: 32 }}>
          {apps.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', padding: '24px 20px', textAlign: 'center', color: 'var(--muted)' }}>
              Metrics will appear once you publish an app.
            </div>
          ) : [
            { label: 'Safety Score', value: String(Math.round(apps.reduce((s,a) => s + (a.safetyScore || 0), 0) / apps.length)), bar: Math.round(apps.reduce((s,a) => s + (a.safetyScore || 0), 0) / apps.length), color: 'var(--accent)' },
            { label: 'Ranking Score', value: String(Math.round(apps.reduce((s,a) => s + (a.rankingScore || 0), 0) / apps.length)), bar: Math.round(apps.reduce((s,a) => s + (a.rankingScore || 0), 0) / apps.length), color: 'var(--accent)' },
            { label: 'Install Velocity', value: String(Math.round(apps.reduce((s,a) => s + (a.installVelocity || 0), 0) / apps.length)), bar: Math.round(apps.reduce((s,a) => s + (a.installVelocity || 0), 0) / apps.length), color: 'var(--accent2)' },
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

        {/* Recent Activity */}
        <div className={styles.sectionHead}><span style={{fontWeight:700}}>Recent Activity</span></div>
        <div className="card" style={{overflow:'hidden'}}>
          {apps.length === 0 ? (
            <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--muted)' }}>No activity yet.</div>
          ) : apps.slice(0, 5).map((a, i) => (
            <div key={i} className={styles.actRow}>
              <div className={styles.actDot} style={{background:'var(--accent)'}} />
              <div style={{fontSize:'0.85rem',lineHeight:1.5,flex:1}}>
                <strong>{a.name}</strong> — Published. Risk score: {a.score ?? '—'}.
              </div>
              <div style={{fontSize:'0.75rem',color:'var(--muted)',fontFamily:'var(--font-mono)',flexShrink:0}}>{a.publishedAt || '—'}</div>
            </div>
          ))}
        </div>
      </main>

      <ToastContainer />
    </div>
  )
}

function NavItem({ n, toast }) {
  function handleClick() {
    if (n.soon) {
      toast(`${n.label} — Coming soon`)
    } else if (n.anchor) {
      document.getElementById(n.anchor)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const content = (
    <div className={`${styles.navItem} ${n.active ? styles.navActive : ''}`} onClick={handleClick}>
      <span className={styles.navIcon}>{n.icon}</span>
      {n.label}
      {n.badge && <span className={styles.navBadge}>{n.badge}</span>}
      {n.soon && <span style={{ fontSize: '0.6rem', color: 'var(--muted)', marginLeft: 'auto' }}>Soon</span>}
    </div>
  )
  return n.href ? <Link to={n.href} style={{textDecoration:'none'}}>{content}</Link> : content
}
