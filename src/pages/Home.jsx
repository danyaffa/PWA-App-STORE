import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import CampaignBanner from '../components/CampaignBanner.jsx'
import styles from './Home.module.css'

const KEY_FEATURES = [
  { icon: '🏪', title: 'Trusted App Store',       desc: 'Browse and install AI-verified PWAs with confidence. Every app carries a public trust report.' },
  { icon: '🚀', title: 'One-Click Publish',        desc: 'Upload a ZIP or connect GitHub. We auto-detect your framework, build it, and handle the rest.' },
  { icon: '🛡️', title: 'AI Safety Scanning',       desc: '6-layer pipeline checks for malware, CVEs, secrets, network behavior, and policy compliance.' },
  { icon: '📡', title: 'Continuous Monitoring',     desc: 'Daily rescans catch new vulnerabilities, changed behavior, and suspicious domain additions.' },
  { icon: '💡', title: 'Explainable Decisions',     desc: 'No mystery rejections. Every review comes with what we found, why it matters, and how to fix it.' },
  { icon: '💸', title: 'Simple Pricing',            desc: 'From $9/mo per app. No revenue cuts. No certificates. No developer accounts required.' },
]

export default function Home() {
  return (
    <>
      <SEO
        title="SafeLaunch — Trusted PWA App Store | AI-Verified Web Apps"
        description="SafeLaunch is the trusted PWA app store with AI-powered safety scanning. Browse, publish, and install verified progressive web apps with confidence."
        canonical="https://agentslock.com/"
      />
      <Nav />

      <div className={styles.homePage}>
        <img
          src="/homepage.png"
          alt="SafeLaunch — Trusted PWA App Store"
          className={styles.heroImage}
        />

        <CampaignBanner />

        <section className={styles.features}>
          <h2 className={`display ${styles.featuresTitle}`}>Key Features</h2>
          <div className={styles.featuresGrid}>
            {KEY_FEATURES.map(f => (
              <div key={f.title} className={styles.featCard}>
                <span className={styles.featIcon}>{f.icon}</span>
                <h3 className={styles.featName}>{f.title}</h3>
                <p className={styles.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.featuresActions}>
            <Link to="/store" className="btn btn-primary btn-lg">Browse Store</Link>
            <Link to="/publish" className="btn btn-ghost btn-lg">Start Publishing</Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
