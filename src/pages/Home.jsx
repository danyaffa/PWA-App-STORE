import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import AppCard from '../components/AppCard.jsx'
import { APPS } from '../utils/data.js'
import { getAIPicks, getLightweightApps, getPrivacyChampions } from '../lib/recommendations.js'
import { usePWAInstall } from '../hooks/usePWAInstall.js'
import IOSInstallGuide from '../components/IOSInstallGuide.jsx'
import styles from './Home.module.css'

const FEATURES = [
  { icon:'📦', title:'One-Click Publish',       desc:'Upload a ZIP or connect GitHub. We auto-detect your framework, build it in a sandbox, and handle everything else.' },
  { icon:'🛡️', title:'AI Safety Pipeline',      desc:'6-layer scanning: static code, CVEs, secrets, dynamic sandbox, policy compliance, and publisher reputation.' },
  { icon:'🏪', title:'Trusted Store',            desc:'Every listed app carries an AI Verified badge and a public trust report. Users install with confidence.' },
  { icon:'💡', title:'Explainable Decisions',   desc:'No mystery rejections. Every block or review comes with what we found, why it matters, and how to fix it.' },
  { icon:'📡', title:'Continuous Monitoring',   desc:'Post-publish daily rescans catch new CVEs, changed behaviour, and suspicious domain additions automatically.' },
  { icon:'💸', title:'Low Monthly Cost',        desc:'From $9/mo per app. No revenue cuts. No certificates. No developer accounts. Just publish and grow.' },
]

function animateCount(end, setter, suffix='') {
  let v = 0
  const step = Math.ceil(end / 60)
  const iv = setInterval(() => {
    v = Math.min(v + step, end)
    setter(v.toLocaleString() + suffix)
    if (v >= end) clearInterval(iv)
  }, 20)
}

export default function Home() {
  const [s1, setS1] = useState('0')
  const [s2, setS2] = useState('0')
  const [s3, setS3] = useState('0')
  const { canInstall, install: installPWA, installed, isStandalone, showIOSGuide, dismissIOSGuide } = usePWAInstall()

  useEffect(() => {
    animateCount(1247, setS1, '+')
    animateCount(389,  setS2)
    animateCount(4200, setS3, '+')
  }, [])

  // AI-driven discovery sections
  const trending   = [...APPS].sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0)).slice(0, 4)
  const aiPicks    = getAIPicks(APPS, 4)
  const lightweight = getLightweightApps(APPS, 4)
  const privacyApps = getPrivacyChampions(APPS, 4)

  return (
    <>
      <SEO
        title="SafeLaunch — Trusted PWA App Store | AI-Verified Web Apps"
        description="SafeLaunch is the trusted PWA app store with AI-powered safety scanning. Browse, publish, and install verified progressive web apps with confidence. From $9/month."
        canonical="https://agentslock.com/"
      />
      <Nav />

      <section className={styles.hero}>
        <div className={styles.grid} />
        <div className={`orb ${styles.orb1}`} />
        <div className={`orb ${styles.orb2}`} />

        <div className={styles.badge}>
          <span className={styles.pulse} />
          Now Open — AI-Verified App Store
        </div>

        <h1 className={`display ${styles.h1}`}>
          Publish PWAs with<br /><em>Zero Trust Gaps</em>
        </h1>

        <p className={styles.sub}>
          Upload your repo or ZIP. We auto-build, AI-scan for threats, and publish to a store
          users can actually trust — all for under $40/month.
        </p>

        <div className={styles.actions}>
          <Link to="/publish" className="btn btn-primary btn-lg">Start Publishing &rarr;</Link>
          <Link to="/store"   className="btn btn-ghost   btn-lg">Browse Store</Link>
          {!installed && !isStandalone && (
            <button className="btn btn-ghost btn-lg" onClick={installPWA}>
              Install SafeLaunch
            </button>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}><div className={`display ${styles.statNum}`}>{s1}</div><div className={styles.statLabel}>Apps Published</div></div>
          <div className={styles.stat}><div className={`display ${styles.statNum}`}>{s2}</div><div className={styles.statLabel}>Threats Blocked</div></div>
          <div className={styles.stat}><div className={`display ${styles.statNum}`}>{s3}</div><div className={styles.statLabel}>Developers</div></div>
        </div>
      </section>

      {/* ── Discovery Engine — users see apps IMMEDIATELY ── */}
      <section className={styles.discovery}>
        <div className="section-label" style={{ textAlign: 'center' }}>Discover Apps</div>
        <h2 className="section-title display" style={{ textAlign: 'center', marginBottom: 48 }}>
          AI-Picked Safe Apps
        </h2>

        {/* AI Picks */}
        <div className={styles.discSection}>
          <div className={styles.discHeader}>
            <h3 className={styles.discTitle}>AI Recommended</h3>
            <Link to="/store" className={styles.discMore}>View all &rarr;</Link>
          </div>
          <div className={styles.discGrid}>
            {aiPicks.map(a => <AppCard key={a.id} app={a} />)}
          </div>
        </div>

        {/* Trending */}
        <div className={styles.discSection}>
          <div className={styles.discHeader}>
            <h3 className={styles.discTitle}>Trending Today</h3>
            <Link to="/store" className={styles.discMore}>View all &rarr;</Link>
          </div>
          <div className={styles.discGrid}>
            {trending.map(a => <AppCard key={a.id} app={a} />)}
          </div>
        </div>

        {/* Privacy Champions */}
        {privacyApps.length >= 2 && (
          <div className={styles.discSection}>
            <div className={styles.discHeader}>
              <h3 className={styles.discTitle}>Privacy Champions</h3>
              <Link to="/store" className={styles.discMore}>View all &rarr;</Link>
            </div>
            <div className={styles.discGrid}>
              {privacyApps.map(a => <AppCard key={a.id} app={a} />)}
            </div>
          </div>
        )}

        {/* Lightweight Apps */}
        {lightweight.length >= 2 && (
          <div className={styles.discSection}>
            <div className={styles.discHeader}>
              <h3 className={styles.discTitle}>Best Lightweight Apps</h3>
              <Link to="/store" className={styles.discMore}>View all &rarr;</Link>
            </div>
            <div className={styles.discGrid}>
              {lightweight.map(a => <AppCard key={a.id} app={a} />)}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/store" className="btn btn-primary btn-lg">Browse All Apps &rarr;</Link>
        </div>
      </section>

      {/* How it Works */}
      <section className={styles.howItWorks}>
        <div className="section-label">How It Works</div>
        <h2 className="section-title display" style={{ textAlign: 'center', marginBottom: 48 }}>
          From Upload to Live in Three Steps
        </h2>
        <div className={styles.stepsRow}>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>1</div>
            <h3>Upload Your App</h3>
            <p>Drop a ZIP, paste a GitHub URL, or link to a hosted PWA. We auto-detect your framework.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>2</div>
            <h3>AI Safety Scan</h3>
            <p>Our 6-layer pipeline checks for malware, CVEs, secrets, network behavior, and policy compliance.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>3</div>
            <h3>Publish to Store</h3>
            <p>Passed? Your app goes live with an AI Verified badge and public trust report.</p>
          </div>
        </div>
      </section>

      {/* Trust Score Explanation — Investor "aha" moment */}
      <section className={styles.trustExplain}>
        <div className="section-label" style={{ textAlign: 'center' }}>Universal Trust Score</div>
        <h2 className="section-title display" style={{ textAlign: 'center', marginBottom: 16 }}>
          Every App Gets a Trust Score
        </h2>
        <p className="section-sub" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>
          Our AI analyzes security, privacy, permissions, and developer reputation to generate a single Trust Score from 0 to 100. Users install without fear.
        </p>
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <div className={styles.trustPercent}>30%</div>
            <div className={styles.trustFactor}>Security Scan</div>
            <div className={styles.trustDesc}>Static analysis, malware detection, CVE checks</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustPercent}>20%</div>
            <div className={styles.trustFactor}>Permission Risk</div>
            <div className={styles.trustDesc}>Camera, location, contacts, network access</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustPercent}>20%</div>
            <div className={styles.trustFactor}>Privacy Behavior</div>
            <div className={styles.trustDesc}>Trackers, data collection, third-party calls</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustPercent}>15%</div>
            <div className={styles.trustFactor}>Performance</div>
            <div className={styles.trustDesc}>Load time, size, offline capability</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustPercent}>15%</div>
            <div className={styles.trustFactor}>Developer Trust</div>
            <div className={styles.trustDesc}>History, violations, verification level</div>
          </div>
        </div>
      </section>

      <div className={styles.features}>
        {FEATURES.map(f => (
          <div key={f.title} className={`card ${styles.featCard}`}>
            <span className={styles.featIcon}>{f.icon}</span>
            <h3 className={styles.featTitle}>{f.title}</h3>
            <p className={styles.featDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA strip */}
      <section className={styles.ctaSection}>
        <h2 className={`display ${styles.ctaTitle}`}>Ready to Ship with Confidence?</h2>
        <p className={styles.ctaSub}>Join 4,200+ developers publishing PWAs people trust.</p>
        <div className={styles.ctaActions}>
          <Link to="/publish" className="btn btn-primary btn-lg">Start Publishing &rarr;</Link>
          {!installed && !isStandalone ? (
            <button className="btn btn-ghost btn-lg" onClick={installPWA}>Install SafeLaunch</button>
          ) : (
            <Link to="/store" className="btn btn-ghost btn-lg">Browse Store</Link>
          )}
        </div>
      </section>

      {showIOSGuide && <IOSInstallGuide onDismiss={dismissIOSGuide} />}
      <Footer />
    </>
  )
}
