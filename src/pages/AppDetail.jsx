import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import PayPalButton from '../components/PayPalButton.jsx'
import InstallDisclaimer from '../components/InstallDisclaimer.jsx'
import { APPS } from '../utils/data.js'
import { useToast } from '../hooks/useToast.js'
import { trackView, trackInstall } from '../lib/analytics.js'
import styles from './AppDetail.module.css'

const TABS = ['Overview', 'Safety Report', 'Reviews', 'Versions']

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

  const app = APPS.find(a => a.id === id) || APPS[0]

  // Track page view
  useState(() => { trackView(app.id) })

  function handleInstallClick() {
    setShowDisclaimer(true)
  }

  function handleInstallAccepted() {
    setShowDisclaimer(false)
    trackInstall(app.id)
    toast(`Installing ${app.name}...`)
  }

  // Simulate some apps being paid
  const isPaid = app.id === 'stockpulse' || app.id === 'datadash'
  const price = isPaid ? '4.99' : null

  const avgRating = (REVIEWS.reduce((sum, r) => sum + r.stars, 0) / REVIEWS.length).toFixed(1)

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
      ratingCount: REVIEWS.length,
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <>
      <SEO
        title={`${app.name} — SafeLaunch App Store`}
        description={`${app.desc} AI-verified safe with a risk score of ${app.score}/100. Install now on SafeLaunch.`}
        canonical={`https://agentslock.com/app/${app.id}`}
        type="product"
        jsonLd={jsonLd}
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 1100 }}>
        <Link to="/store" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Back to Store</Link>

        <div className={styles.hero}>
          {/* Left col */}
          <div className={styles.left}>
            <div className={styles.iconLg}>{app.icon}</div>
            <h1 className={`display ${styles.title}`}>{app.name}</h1>
            <div className={styles.publisher}>by <a href="#" style={{ color: 'var(--accent)' }}>Dev Studio</a> · Published 14 Jan 2026</div>
            <div className={styles.metaRow}>
              <span className="badge badge-pass">AI Verified Safe</span>
              <span className="badge badge-muted">{app.category}</span>
              <span className="badge badge-muted">v2.3.1</span>
              <span className="badge badge-muted">Risk: {app.score}</span>
              <span className="badge badge-muted">{app.installs} installs</span>
              {isPaid && <span className="badge badge-warn">${price}</span>}
            </div>
            <p className={styles.desc}>
              {app.name} is a fully offline-first PWA with no account required and no data collection.
              All data is stored locally in your browser. Available for install on any modern device.
            </p>

            {/* Screenshots */}
            <div className={styles.screenshots}>
              {[1, 2, 3, 4].map(n => (
                <div key={n} className={styles.screenshot}>Screenshot {n}</div>
              ))}
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map((t, i) => (
                <div key={t} className={`${styles.tab} ${tab === i ? styles.activeTab : ''}`} onClick={() => setTab(i)}>{t}</div>
              ))}
            </div>

            {/* Overview */}
            {tab === 0 && (
              <div className={styles.tabBody}>
                <h3 style={{ marginBottom: 10 }}>What's New in v2.3.1</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 24 }}>Dark/light theme toggle. Fixed timer drift on background tabs. Improved keyboard navigation. Bundle size reduced by 18%.</p>
                <h3 style={{ marginBottom: 10 }}>Permissions</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 24 }}>None. This app requests no device permissions and makes no network calls.</p>
                <h3 style={{ marginBottom: 10 }}>Privacy</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>All data stored in your browser's localStorage. Nothing is ever sent to any server. <Link to="/privacy" style={{ color: 'var(--accent)' }}>View Privacy Policy →</Link></p>
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
                  <Link to={`/report/${app.id}`} className="btn btn-ghost">View Full Scan Report →</Link>
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
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{REVIEWS.length} reviews</span>
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
                      <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{v.date} · Risk: {v.score} · Build: {v.build}</div>
                    </div>
                    <Link to={`/report/${app.id}`} style={{ color: v.current ? 'var(--accent)' : 'var(--muted)', fontSize: '0.82rem' }}>Report →</Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Install card */}
          <div className={styles.installCard}>
            <div className={styles.scoreDisplay}>
              <div className={`display ${styles.scoreBig}`}>{app.score}</div>
              <div className={styles.scoreLabel}>/ 100 Risk Score</div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreFill} style={{ width: `${app.score}%` }} />
              </div>
              <div className={styles.scoreZones}><span>ALLOW</span><span>REVIEW</span><span>BLOCK</span></div>
            </div>
            <div className={styles.trustBadge}>AI Verified Safe · v2.3.1</div>

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
            ) : (
              <button className={`btn btn-primary ${styles.installBtn}`} onClick={handleInstallClick}>Install Free</button>
            )}

            <Link to={`/report/${app.id}`} className={styles.reportLink}>View full safety report →</Link>
            <div className={styles.installMeta}>
              {[
                ['Version', '2.3.1'],
                ['Last scanned', '14 Jan 2026'],
                ['Build hash', 'a4f2c91'],
                ['Installs', `${app.installs}`],
                ['Offline support', '✓ Yes'],
                ['PWA installable', '✓ Yes'],
                ['Price', isPaid ? `$${price}` : 'Free'],
              ].map(([k, v]) => (
                <div key={k} className={styles.metaRow2}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, color: v.startsWith('✓') ? 'var(--accent)' : 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Independent developer disclaimer banner */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ padding: '14px 20px', background: 'rgba(255,184,77,.06)', border: '1px solid rgba(255,184,77,.15)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Apps on SafeLaunch are provided by <strong style={{ color: 'var(--text)' }}>independent developers</strong>. The platform does not create, own, or guarantee third-party applications. <Link to="/terms" style={{ color: 'var(--accent)' }}>Learn more</Link>
        </div>
      </div>

      <Footer />

      {showDisclaimer && (
        <InstallDisclaimer
          appName={app.name}
          appId={app.id}
          onAccept={handleInstallAccepted}
          onCancel={() => setShowDisclaimer(false)}
        />
      )}

      <ToastContainer />
    </>
  )
}
