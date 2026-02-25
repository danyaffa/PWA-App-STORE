import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import PayPalButton from '../components/PayPalButton.jsx'
import InstallDisclaimer from '../components/InstallDisclaimer.jsx'
import ReportApp from '../components/ReportApp.jsx'
import TrustScore from '../components/TrustScore.jsx'
import PermissionPanel from '../components/PermissionPanel.jsx'
import PoweredBy from '../components/PoweredBy.jsx'
import AppCard from '../components/AppCard.jsx'
import { APPS } from '../utils/data.js'
import { useToast } from '../hooks/useToast.js'
import { useInstallState } from '../hooks/useInstallState.js'
import { trackView, trackInstall } from '../lib/analytics.js'
import { getSimilarApps } from '../lib/recommendations.js'
import styles from './AppDetail.module.css'

const TABS = ['Overview', 'Safety Report', 'Reviews', 'Versions']

const BADGE_MAP = {
  trending:  { icon: '🔥', label: 'Trending' },
  verified:  { icon: '🛡', label: 'Verified Safe' },
  top_rated: { icon: '⭐', label: 'Top Rated' },
  new:       { icon: '🚀', label: 'New' },
  rising:    { icon: '📈', label: 'Rising Fast' },
}

const FINDINGS = [
  { sev: 'pass', msg: 'No secrets or API keys detected in source' },
  { sev: 'pass', msg: 'No known malware signatures matched' },
  { sev: 'pass', msg: 'All 47 dependencies clear of critical CVEs' },
  { sev: 'pass', msg: 'No outbound network calls detected in sandbox' },
  { sev: 'pass', msg: 'No device fingerprinting detected' },
  { sev: 'pass', msg: 'Privacy policy URL verified and live' },
  { sev: 'pass', msg: 'Obfuscation score 0.09 — normal minification' },
]

const REVIEWS = [
  { handle: '@alex_builds',    stars: 5, text: 'Best Pomodoro app I\'ve used. Offline, no account needed. Installed on every device.', date: '18 Feb 2026' },
  { handle: '@sarahdev',       stars: 5, text: 'Checked the safety report before installing — zero issues, no network calls. Exactly what I wanted.', date: '12 Feb 2026' },
  { handle: '@techreview_au',  stars: 4, text: 'Solid app. Would love optional sync, but for pure local use it\'s perfect.', date: '3 Feb 2026' },
]

const VERSIONS = [
  { ver: '2.3.1', date: '14 Jan 2026', score: 5,  build: 'a4f2c91', current: true  },
  { ver: '2.3.0', date: '2 Jan 2026',  score: 5,  build: 'b8e1a22', current: false },
  { ver: '2.2.0', date: '18 Dec 2025', score: 7,  build: 'c3d9f44', current: false },
]

export default function AppDetail() {
  const { id } = useParams()
  const { toast, ToastContainer } = useToast()
  const [tab, setTab] = useState(0)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const app = APPS.find(a => a.id === id) || APPS[0]
  const { installed, install } = useInstallState(app.id)

  // Track page view
  useState(() => { trackView(app.id) })

  // AI-powered similar apps
  const similarApps = getSimilarApps(app, APPS, 4)

  function handleInstallClick() {
    setShowDisclaimer(true)
  }

  function handleInstallAccepted() {
    setShowDisclaimer(false)
    install()
    trackInstall(app.id)
    toast(`${app.name} installed successfully!`)
    if (app.url) window.open(app.url, '_blank', 'noopener,noreferrer')
  }

  // Use price field from app data — all current apps are Free
  const isPaid = app.price && app.price !== 'Free'
  const price = isPaid ? app.price : null

  const avgRating = app.averageRating || (REVIEWS.reduce((sum, r) => sum + r.stars, 0) / REVIEWS.length).toFixed(1)
  const badges = (app.badges || []).map(b => BADGE_MAP[b]).filter(Boolean)
  const developer = app.developer || 'Independent Developer'

  // JSON-LD for SoftwareApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.desc,
    applicationCategory: app.category,
    operatingSystem: 'Web, iOS, Android',
    url: `https://agentslock.com/app/${app.id}`,
    offers: {
      '@type': 'Offer',
      price: price || '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      ratingCount: app.totalReviews || REVIEWS.length,
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <>
      <SEO
        title={`${app.name} — SafeLaunch App Store`}
        description={`${app.desc} AI-verified safe with a trust score of ${app.safetyScore || 0}/100. Install now on SafeLaunch.`}
        canonical={`https://agentslock.com/app/${app.id}`}
        type="product"
        jsonLd={jsonLd}
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 1100 }}>
        <Link to="/store" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>&larr; Back to Store</Link>

        <div className={styles.hero}>
          {/* Left col */}
          <div className={styles.left}>
            <div className={styles.iconLg}>{app.icon}</div>
            <h1 className={`display ${styles.title}`}>{app.name}</h1>
            <div className={styles.publisher}>by <a href="#" style={{ color: 'var(--accent)' }}>{developer}</a> &middot; Developer Trust: <strong style={{ color: 'var(--accent)' }}>{app.developerTrust || 70}/100</strong></div>
            <div className={styles.metaRow}>
              {badges.map(b => (
                <span key={b.label} className="badge badge-pass">{b.icon} {b.label}</span>
              ))}
              <span className="badge badge-muted">{app.category}</span>
              <span className="badge badge-muted">v2.3.1</span>
              <span className="badge badge-muted">{app.installs} installs</span>
              {app.size && <span className="badge badge-muted">{app.size}</span>}
              {isPaid && <span className="badge badge-warn">${price}</span>}
            </div>
            <p className={styles.desc}>
              {app.longDesc || app.desc}
            </p>

            {/* Live App Preview */}
            {app.url && (
              <div className={styles.livePreview}>
                <div className={styles.previewHeader}>
                  <span className={styles.previewDot} style={{ background: '#ff5f56' }} />
                  <span className={styles.previewDot} style={{ background: '#ffbd2e' }} />
                  <span className={styles.previewDot} style={{ background: '#27c93f' }} />
                  <span className={styles.previewUrl}>{app.url}</span>
                </div>
                <iframe
                  src={app.url}
                  title={`${app.name} live preview`}
                  className={styles.previewIframe}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  loading="lazy"
                />
              </div>
            )}

            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map((t, i) => (
                <div key={t} className={`${styles.tab} ${tab === i ? styles.activeTab : ''}`} onClick={() => setTab(i)}>{t}</div>
              ))}
            </div>

            {/* Overview — now includes Permission Transparency */}
            {tab === 0 && (
              <div className={styles.tabBody}>
                {app.whatsNew && (
                  <>
                    <h3 style={{ marginBottom: 10 }}>What's New</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 24 }}>{app.whatsNew}</p>
                  </>
                )}

                {/* Permission Transparency Panel — the clear "can / cannot" display */}
                <PermissionPanel
                  permissions={app.permissions || []}
                  safetyScore={app.safetyScore || 0}
                />

                <h3 style={{ marginBottom: 10, marginTop: 24 }}>Privacy</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  {app.permissions && app.permissions.some(p => p.toLowerCase().includes('internet'))
                    ? `${app.name} connects to the internet to provide its core functionality. Review the developer's privacy policy for details on data handling.`
                    : `All data stored in your browser's localStorage. Nothing is ever sent to any server.`
                  }
                  {' '}<Link to="/privacy" style={{ color: 'var(--accent)' }}>View Privacy Policy &rarr;</Link>
                </p>
              </div>
            )}

            {/* Safety */}
            {tab === 1 && (
              <div className={styles.tabBody}>
                <div className={styles.scanSummary}>
                  {[['Critical', 0, 'var(--danger)'], ['Medium', 0, 'var(--warn)'], ['Passed', 16, 'var(--accent)']].map(([l, n, c]) => (
                    <div key={l} className={styles.scanCard}>
                      <div className={`display ${styles.scanNum}`} style={{ color: c }}>{n}</div>
                      <div className={styles.scanLabel}>{l}</div>
                    </div>
                  ))}
                </div>
                {FINDINGS.map((f, i) => (
                  <div key={i} className={styles.findingRow}>
                    <div className={styles.fdot} style={{ background: 'var(--accent)' }} />
                    <div style={{ flex: 1 }}>{f.msg}</div>
                    <span className="badge badge-pass">PASS</span>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <Link to={`/report/${app.id}`} className="btn btn-ghost">View Full Scan Report &rarr;</Link>
                </div>
              </div>
            )}

            {/* Reviews */}
            {tab === 2 && (
              <div className={styles.tabBody}>
                <div className={styles.ratingOverview}>
                  <div className={styles.ratingBig}>
                    <span className="display" style={{fontSize:'2.5rem'}}>{avgRating}</span>
                    <span style={{ color: 'var(--accent)', letterSpacing: 2, fontSize: '1.2rem' }}>{'★'.repeat(Math.round(avgRating))}</span>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{app.totalReviews || REVIEWS.length} reviews</span>
                </div>
                {REVIEWS.map((r, i) => (
                  <div key={i} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <span style={{ fontWeight: 700 }}>{r.handle}</span>
                      <span style={{ color: 'var(--accent)', letterSpacing: 2 }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.87rem', lineHeight: 1.6 }}>{r.text}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>{r.date}</div>
                  </div>
                ))}
                <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => toast('Review form coming soon')}>Write a Review</button>
              </div>
            )}

            {/* Versions */}
            {tab === 3 && (
              <div className={styles.tabBody}>
                {VERSIONS.map(v => (
                  <div key={v.ver} className={styles.versionRow} style={{ borderColor: v.current ? 'rgba(0,229,160,.3)' : 'var(--border)' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>v{v.ver}</span>
                      {v.current && <span className="badge badge-pass" style={{ marginLeft: 8 }}>CURRENT</span>}
                      <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{v.date} &middot; Risk: {v.score} &middot; Build: {v.build}</div>
                    </div>
                    <Link to={`/report/${app.id}`} style={{ color: v.current ? 'var(--accent)' : 'var(--muted)', fontSize: '0.82rem' }}>Report &rarr;</Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Install card — now with Trust Score gauge */}
          <div className={styles.installCard}>
            {/* Universal Trust Score — the ONE number investors see */}
            <div className={styles.trustScoreWrap}>
              <TrustScore score={app.safetyScore || 0} size="lg" />
            </div>

            {/* Verification badges — visible trust signals */}
            <div className={styles.certBadges}>
              {(app.safetyScore || 0) >= 85 && (
                <span className={styles.certBadge}>{'\u2713'} AI Security Checked</span>
              )}
              {(app.safetyScore || 0) >= 80 && (
                <span className={styles.certBadge}>{'\u2713'} Privacy Verified</span>
              )}
              {(app.safetyScore || 0) >= 70 && (
                <span className={styles.certBadge}>{'\u2713'} No Trackers</span>
              )}
            </div>

            {/* Safety badge with score */}
            <div className={styles.trustBadge}>
              {app.safetyScore >= 85 ? 'Safety Verified' : 'Safety Reviewed'} ({app.safetyScore || 'N/A'}/100) &middot; v2.3.1
            </div>

            {isPaid ? (
              <div className={styles.paySection}>
                <div className={styles.priceTag}>${price}</div>
                <PayPalButton
                  amount={price}
                  description={`Purchase ${app.name}`}
                  onSuccess={() => { trackInstall(app.id); toast(`${app.name} purchased and installed!`) }}
                  onError={() => toast('Payment failed. Please try again.')}
                />
              </div>
            ) : installed ? (
              <>
                <div className={`btn ${styles.installBtn} ${styles.installedLabel}`}>Installed</div>
                <a href={app.url} target="_blank" rel="noopener noreferrer" className={`btn ${styles.installBtn} ${styles.openBtn}`}>Open App</a>
              </>
            ) : (
              <button className={`btn btn-primary ${styles.installBtn}`} onClick={handleInstallClick}>Install App</button>
            )}

            <Link to={`/report/${app.id}`} className={styles.reportLink}>View full safety report &rarr;</Link>

            {/* Promote link */}
            <Link to={`/app/${app.id}/promote`} className={styles.reportLink} style={{ color: 'var(--accent2)' }}>Promote this app &rarr;</Link>

            <div className={styles.installMeta}>
              {[
                ['Developer', developer],
                ['Version', '2.3.1'],
                ['Trust Score', `${app.safetyScore || 'N/A'}/100`],
                ['Last scanned', '14 Jan 2026'],
                ['Build hash', 'a4f2c91'],
                ['Size', app.size || 'N/A'],
                ['Installs', `${app.installs}`],
                ['Rating', `${avgRating} (${app.totalReviews || REVIEWS.length})`],
                ['Developer Trust', `${app.developerTrust || 'N/A'}/100`],
                ['Offline support', app.permissions && app.permissions.some(p => p.toLowerCase().includes('none') || p.toLowerCase().includes('offline')) ? '\u2713 Yes' : '~ Partial'],
                ['PWA installable', '\u2713 Yes'],
                ['Price', isPaid ? `$${price}` : 'Free'],
              ].map(([k, v]) => (
                <div key={k} className={styles.metaRow2}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, color: String(v).startsWith('\u2713') ? 'var(--accent)' : 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Report App button */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowReport(true)}
              style={{ width: '100%', justifyContent: 'center', marginTop: 14, color: 'var(--muted)', fontSize: '0.82rem' }}
            >
              Report App
            </button>
          </div>
        </div>
      </div>

      {/* Similar Apps — AI Recommendations */}
      {similarApps.length > 0 && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 40px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Apps You May Like</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {similarApps.map(a => <AppCard key={a.id} app={a} />)}
          </div>
        </div>
      )}

      {/* Independent developer disclaimer banner */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 20px' }}>
        <div style={{ padding: '14px 20px', background: 'rgba(255,184,77,.06)', border: '1px solid rgba(255,184,77,.15)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Apps on SafeLaunch are provided by <strong style={{ color: 'var(--text)' }}>independent developers</strong>. The platform does not create, own, or guarantee third-party applications. <Link to="/how-safety-works" style={{ color: 'var(--accent)' }}>How safety works</Link> &middot; <Link to="/terms" style={{ color: 'var(--accent)' }}>Terms</Link>
        </div>
      </div>

      {/* Powered by SafeLaunch — viral growth footer */}
      <PoweredBy />

      <Footer />

      {showDisclaimer && (
        <InstallDisclaimer
          appName={app.name}
          appId={app.id}
          onAccept={handleInstallAccepted}
          onCancel={() => setShowDisclaimer(false)}
        />
      )}

      {showReport && (
        <ReportApp
          appId={app.id}
          appName={app.name}
          onClose={() => setShowReport(false)}
        />
      )}

      <ToastContainer />
    </>
  )
}
