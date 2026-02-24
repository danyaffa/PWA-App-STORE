import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './HowSafetyWorks.module.css'

const LAYERS = [
  {
    num: '01',
    title: 'Developer Verification',
    icon: '👤',
    desc: 'Every developer must verify their email, accept our Developer Agreement, and self-certify their apps comply with our policies. We track trust scores based on publishing history and violations.',
  },
  {
    num: '02',
    title: 'Static Code Analysis',
    icon: '🔍',
    desc: 'Submitted code is scanned for dangerous patterns: eval() abuse, crypto miners, hidden iframes, credential harvesting, obfuscated payloads, and known malicious dependencies.',
  },
  {
    num: '03',
    title: 'Dependency Audit',
    icon: '📦',
    desc: 'All npm packages are inventoried into an SBOM (Software Bill of Materials). We check every dependency against CVE databases and known supply-chain attacks.',
  },
  {
    num: '04',
    title: 'Behavior Sandbox',
    icon: '🧪',
    desc: 'Apps are loaded in an isolated headless browser. We monitor for unexpected redirects, popup spam, permission abuse, tracking scripts, auto-downloads, and CPU spikes from crypto mining.',
  },
  {
    num: '05',
    title: 'AI Policy Review',
    icon: '🤖',
    desc: 'App metadata, descriptions, and homepage content are analyzed by AI to detect policy violations: scams, impersonation, adult content, gambling, and illegal services.',
  },
  {
    num: '06',
    title: 'Reputation Check',
    icon: '🛡',
    desc: 'We check publisher history, prior violations, version history, and user report rates. URLs are validated against Google Safe Browsing.',
  },
]

const CONTINUOUS = [
  { icon: '🔄', title: 'Daily Re-scans', desc: 'Published apps are automatically re-scanned daily. If risk increases, the app is suspended instantly.' },
  { icon: '🚨', title: 'User Reporting', desc: 'Users can report apps for malware, scams, copyright violations, or illegal content. Reports above threshold trigger automatic suspension.' },
  { icon: '⚡', title: 'Instant Takedown', desc: 'We reserve the right to remove any application immediately, without notice, to protect users.' },
]

export default function HowSafetyWorks() {
  return (
    <>
      <SEO
        title="How Safety Works — SafeLaunch"
        description="Learn how SafeLaunch protects users with a 6-layer automated security scanning pipeline, continuous monitoring, and instant takedown capabilities."
        canonical="https://agentslock.com/how-safety-works"
      />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <div className="section-label">Trust & Transparency</div>
        <h1 className="section-title display">How We Keep You Safe</h1>
        <p className="section-sub" style={{ marginBottom: 48 }}>
          Every app on SafeLaunch goes through a 6-layer automated security pipeline before publishing — and continuous monitoring after.
          We use automated systems to detect harmful applications but cannot guarantee absolute security.
        </p>

        {/* 6-Layer Pipeline */}
        <div className={styles.pipeline}>
          {LAYERS.map(layer => (
            <div key={layer.num} className={styles.layer}>
              <div className={styles.layerNum}>{layer.num}</div>
              <div className={styles.layerIcon}>{layer.icon}</div>
              <div className={styles.layerContent}>
                <h3>{layer.title}</h3>
                <p>{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Score */}
        <section className={styles.scoreSection}>
          <h2 className={styles.sectionTitle}>Combined Safety Score</h2>
          <p className={styles.sectionDesc}>All scan results are combined into a single 0–100 risk score using a weighted formula.</p>
          <div className={styles.formula}>
            <div className={styles.formulaRow}>
              <span className={styles.weight}>40%</span>
              <span>Static Code Analysis</span>
            </div>
            <div className={styles.formulaRow}>
              <span className={styles.weight}>30%</span>
              <span>Behavior Sandbox</span>
            </div>
            <div className={styles.formulaRow}>
              <span className={styles.weight}>20%</span>
              <span>AI Policy Review</span>
            </div>
            <div className={styles.formulaRow}>
              <span className={styles.weight}>10%</span>
              <span>Developer Trust Score</span>
            </div>
          </div>
          <div className={styles.decisionGrid}>
            <div className={styles.decisionCard} style={{ borderColor: 'rgba(0,229,160,.3)' }}>
              <div className={styles.decisionScore} style={{ color: 'var(--accent)' }}>80–100</div>
              <div className={styles.decisionLabel}>Auto Publish</div>
            </div>
            <div className={styles.decisionCard} style={{ borderColor: 'rgba(255,184,77,.3)' }}>
              <div className={styles.decisionScore} style={{ color: 'var(--warn)' }}>60–79</div>
              <div className={styles.decisionLabel}>Limited Publish</div>
            </div>
            <div className={styles.decisionCard} style={{ borderColor: 'rgba(255,77,109,.3)' }}>
              <div className={styles.decisionScore} style={{ color: 'var(--danger)' }}>&lt;60</div>
              <div className={styles.decisionLabel}>Auto Reject</div>
            </div>
          </div>
        </section>

        {/* Continuous Monitoring */}
        <section style={{ marginBottom: 48 }}>
          <h2 className={styles.sectionTitle}>Continuous Protection</h2>
          <p className={styles.sectionDesc}>Security doesn't stop at publish. We monitor every app continuously.</p>
          <div className={styles.continuousGrid}>
            {CONTINUOUS.map(item => (
              <div key={item.title} className={styles.continuousCard}>
                <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className={styles.disclaimer}>
          <p>
            <strong>Important:</strong> We use automated systems to detect harmful applications but cannot guarantee absolute security.
            Applications are submitted by independent developers. SafeLaunch provides hosting and discovery services only and does not create, endorse, or guarantee third-party applications.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
            <Link to="/terms" className="btn btn-ghost btn-sm">Terms of Service</Link>
            <Link to="/developer-agreement" className="btn btn-ghost btn-sm">Developer Agreement</Link>
            <Link to="/dmca" className="btn btn-ghost btn-sm">DMCA Policy</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
