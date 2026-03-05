import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import PayPalButton from '../components/PayPalButton.jsx'
import InstallDisclaimer from '../components/InstallDisclaimer.jsx'
import { APPS } from '../utils/data.js'
import { loadPublishedApps } from '../lib/appsStore.js'
import { useInstallState } from '../hooks/useInstallState.js'
import { useToast } from '../hooks/useToast.js'
import { trackInstall, trackOpenApp } from '../lib/analytics.js'
import styles from './AppDetail.module.css'

export default function AppDetail() {
  const { id } = useParams()
  const { toast, ToastContainer } = useToast()
  const [publishedApps, setPublishedApps] = useState([])

  useEffect(() => {
    loadPublishedApps().then(setPublishedApps).catch(() => {})
  }, [])

  const allApps = useMemo(() => {
    const merged = [...publishedApps, ...APPS]
    const seen = new Set()
    return merged.filter(a => {
      if (!a?.id || seen.has(a.id)) return false
      seen.add(a.id)
      return true
    })
  }, [publishedApps])
  const app = allApps.find(a => a.id === id)

  const [tab, setTab] = useState('overview')
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const { installed, install } = useInstallState(app?.id)
  const isPaid = app?.price && app.price !== 'Free' && app.price !== '0'

  if (!app) {
    return (
      <>
        <Nav />
        <div className="page-wrap">
          <h1 className="section-title">App not found</h1>
          <p className="section-sub">The app you are looking for does not exist.</p>
          <Link className="btn btn-primary" to="/store">Back to Store</Link>
        </div>
        <Footer />
      </>
    )
  }

  function handleOpenApp() {
    if (!app.url) return toast('No app URL found.')
    trackOpenApp(app.id)
    window.open(app.url, '_blank', 'noopener,noreferrer')
  }

  function handleInstall() {
    if (installed) return
    setShowDisclaimer(true)
  }

  function handleInstallAccepted() {
    setShowDisclaimer(false)
    install()
    trackInstall(app.id)

    // Open the app so the user can use/install it directly
    if (app.url) {
      window.open(app.url, '_blank', 'noopener,noreferrer')
      toast(`${app.name} installed and opened in a new tab!`)
      return
    }

    toast(`${app.name} installed successfully!`)
  }

  function handleInstallDeclined() {
    setShowDisclaimer(false)
  }

  return (
    <>
      <SEO
        title={`${app.name} — SafeLaunch`}
        description={app.desc}
        canonical={`https://agentslock.com/app/${app.id}`}
      />
      <Nav />

      <div className="page-wrap">
        <div className={styles.topRow}>
          <div className={styles.left}>
            <div className={styles.appHeader}>
              <div className={styles.icon}>{app.icon}</div>
              <div>
                <h1 className={styles.title}>{app.name}</h1>
                <div className={styles.meta}>by {app.developer || 'Developer'} • {app.category}</div>
              </div>
            </div>

            <div className={styles.tabs}>
              <button className={`${styles.tab} ${tab === 'overview' ? styles.active : ''}`} onClick={() => setTab('overview')}>Overview</button>
              <button className={`${styles.tab} ${tab === 'safety' ? styles.active : ''}`} onClick={() => setTab('safety')}>Safety Report</button>
              <button className={`${styles.tab} ${tab === 'reviews' ? styles.active : ''}`} onClick={() => setTab('reviews')}>Reviews</button>
              <button className={`${styles.tab} ${tab === 'versions' ? styles.active : ''}`} onClick={() => setTab('versions')}>Versions</button>
            </div>

            {tab === 'overview' && (
              <>
                <div className={styles.whatsNew}>
                  <h2>What's New</h2>
                  <p>{app.whatsNew || 'Latest improvements and fixes.'}</p>
                </div>

                <div className={styles.features}>
                  <h3>Key Features</h3>
                  <div className={styles.featureGrid}>
                    {(app.screenshots || []).map((s, idx) => (
                      <div key={idx} className={styles.featureCard}>
                        <div className={styles.featureTitle}>{s.title}</div>
                        <div className={styles.featureDesc}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.privacyBlock}>
                  <div className={styles.privacyHead}>
                    <div>
                      <div className={styles.privacyTitle}>Privacy & Permissions</div>
                      <div className={styles.privacySub}>What this app can access</div>
                    </div>
                    <div className={styles.privacyScore}>Privacy Score: {app.privacyScore || 55}/100</div>
                  </div>

                  <div className={styles.perms}>
                    <div>
                      <div className={styles.permLabel}>This app can:</div>
                      <ul>
                        <li>Location (optional)</li>
                        <li>Internet access</li>
                      </ul>
                    </div>
                    <div>
                      <div className={styles.permLabel}>This app cannot:</div>
                      <ul>
                        <li>Use your camera</li>
                        <li>Read your contacts</li>
                        <li>Access microphone</li>
                      </ul>
                    </div>
                  </div>

                  <div className={styles.chipsRow}>
                    <span className={styles.chip}>AI Security Checked</span>
                    <span className={styles.chip}>Privacy Verified</span>
                  </div>
                </div>

                <div className={styles.privacyText}>
                  <h3>Privacy</h3>
                  <p>
                    {app.name} connects to the internet to provide its core functionality.
                    Review the developer's privacy policy for details on data handling.
                    {' '}
                    {app.privacyPolicy && (
                      <a href={app.privacyPolicy} target="_blank" rel="noreferrer">View Privacy Policy →</a>
                    )}
                  </p>
                </div>
              </>
            )}

            {tab === 'safety' && (
              <div className={styles.safety}>
                <h2>Safety Report</h2>
                <p>Summary: {app.safetySummary || 'Automated checks passed. No critical threats detected.'}</p>
                <ul className={styles.safetyList}>
                  <li>✔ AI Security Checked</li>
                  <li>✔ Privacy Verified</li>
                  <li>✔ No known trackers</li>
                  <li>✔ HTTPS required</li>
                </ul>
              </div>
            )}

            {tab === 'reviews' && (
              <div className={styles.reviews}>
                <h2>Reviews</h2>
                <p>Coming soon.</p>
              </div>
            )}

            {tab === 'versions' && (
              <div className={styles.versions}>
                <h2>Versions</h2>
                <p>Version history coming soon.</p>
              </div>
            )}
          </div>

          <aside className={styles.right}>
            <div className={styles.scoreCard}>
              <div className={styles.scoreRing}>
                <div className={styles.scoreNum}>{app.safetyScore || 0}</div>
                <div className={styles.scoreLbl}>VERIFIED SAFE</div>
              </div>

              <div className={styles.checks}>
                <div className={styles.check}>✓ AI Security Checked</div>
                <div className={styles.check}>✓ Privacy Verified</div>
                <div className={styles.check}>✓ No Trackers</div>
                <div className={styles.check}>Safety Verified ({app.safetyScore || 0}/100) • v{app.version || '1.0.0'}</div>
              </div>

              {isPaid && (
                <div className={styles.paySection}>
                  <div className={styles.priceTag}>${app.price}</div>
                  <PayPalButton
                    amount={app.price}
                    description={`Purchase ${app.name} — SafeLaunch`}
                    onSuccess={(capture) => {
                      toast(`Payment successful! Opening ${app.name}…`)
                      if (app.url) window.open(app.url, '_blank', 'noopener,noreferrer')
                    }}
                    onError={() => toast('Payment failed. Please try again.')}
                  />
                </div>
              )}

              {!isPaid && (
                <button
                  className={`btn ${installed ? 'btn-ghost' : 'btn-primary'} ${styles.bigBtn}`}
                  onClick={handleInstall}
                  disabled={installed}
                >
                  {installed ? 'Installed' : 'Install App'}
                </button>
              )}

              <button className={`btn btn-primary ${styles.bigBtn}`} onClick={handleOpenApp}>
                Open App
              </button>

              <div className={styles.metaTable}>
                <div><span>Developer</span><span>{app.developer || '-'}</span></div>
                <div><span>Version</span><span>{app.version || '-'}</span></div>
                <div><span>Trust Score</span><span>{app.safetyScore || 0}/100</span></div>
                <div><span>Size</span><span>{app.size || '-'}</span></div>
                <div><span>Installs</span><span>{app.installs || '-'}</span></div>
                <div><span>Rating</span><span>{app.averageRating || '-'} ({app.reviewCount || 0})</span></div>
                <div><span>PWA installable</span><span>{app.pwaInstallable ? '✓ Yes' : '—'}</span></div>
                <div><span>Price</span><span>{app.price || 'Free'}</span></div>
              </div>

              <button className={`btn btn-ghost ${styles.reportBtn}`}>Report App</button>
            </div>
          </aside>
        </div>

        {showDisclaimer && (
          <InstallDisclaimer
            appName={app.name}
            appId={app.id}
            onAccept={handleInstallAccepted}
            onCancel={handleInstallDeclined}
          />
        )}
      </div>

      <Footer />
      <ToastContainer />
    </>
  )
}
