import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
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

  useEffect(() => {
    animateCount(1247, setS1, '+')
    animateCount(389,  setS2)
    animateCount(4200, setS3, '+')
  }, [])

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
          <Link to="/publish" className="btn btn-primary btn-lg">Start Publishing →</Link>
          <Link to="/store"   className="btn btn-ghost   btn-lg">Browse Store</Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}><div className={`display ${styles.statNum}`}>{s1}</div><div className={styles.statLabel}>Apps Published</div></div>
          <div className={styles.stat}><div className={`display ${styles.statNum}`}>{s2}</div><div className={styles.statLabel}>Threats Blocked</div></div>
          <div className={styles.stat}><div className={`display ${styles.statNum}`}>{s3}</div><div className={styles.statLabel}>Developers</div></div>
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
          <Link to="/publish" className="btn btn-primary btn-lg">Start Publishing →</Link>
          <Link to="/app-store" className="btn btn-ghost btn-lg">Install the App</Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
