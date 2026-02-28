import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import IOSInstallGuide from '../components/IOSInstallGuide.jsx'
import { usePWAInstall } from '../hooks/usePWAInstall.js'
import { useToast } from '../hooks/useToast.js'
import styles from './InstallGuide.module.css'

export default function InstallGuide() {
  const [promo, setPromo] = useState('')
  const { toast, ToastContainer } = useToast()
  const {
    install,
    installed,
    isStandalone,
    showIOSGuide,
    dismissIOSGuide,
  } = usePWAInstall()

  function handlePromo(e) {
    e.preventDefault()
    if (!promo.trim()) return
    toast('Promo code applied!')
    setPromo('')
  }

  async function handleInstall() {
    if (installed || isStandalone) {
      toast('SafeLaunch is already installed!')
      return
    }
    const accepted = await install()
    if (accepted) {
      toast('SafeLaunch installed! Check your home screen.')
    }
  }

  return (
    <>
      <SEO
        title="Install SafeLaunch — PWA App Store"
        description="Install SafeLaunch on your iPhone, iPad, Android, or Mac. Works like a native app — no App Store required."
        canonical="https://agentslock.com/app-store"
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 900 }}>
        <div className="section-label">Install</div>
        <h1 className="section-title display">Install SafeLaunch</h1>
        <p className="section-sub" style={{ marginBottom: 32 }}>
          One tap. No App Store or Play Store needed.
        </p>

        {/* One big Install button */}
        <div className={styles.installHero}>
          {installed || isStandalone ? (
            <div className={styles.installedBanner}>
              <span className={styles.checkMark}>&#10003;</span>
              SafeLaunch is installed
            </div>
          ) : (
            <button className={`btn btn-primary ${styles.installBtn}`} onClick={handleInstall}>
              Install SafeLaunch
            </button>
          )}
          <p className={styles.installSub}>
            {installed || isStandalone
              ? 'Open it from your home screen or app drawer.'
              : 'Click the button above — it works on every device.'}
          </p>
        </div>

        {/* Info note */}
        <div className={styles.note}>
          SafeLaunch is a Progressive Web App (PWA). It installs directly from your browser and works
          like a native app — full screen, offline support, and no browser bar.
        </div>

        {/* Promo code */}
        <div className={styles.promoSection}>
          <h3 className={styles.promoTitle}>Have a Promo Code?</h3>
          <form onSubmit={handlePromo} className={styles.promoForm}>
            <input
              className="input"
              placeholder="Enter promo code"
              value={promo}
              onChange={e => setPromo(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Apply</button>
          </form>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <Link to="/store" className="btn btn-primary btn-lg">Browse the Store</Link>
          <Link to="/publish" className="btn btn-ghost btn-lg">Publish Your App</Link>
        </div>
      </div>

      {showIOSGuide && <IOSInstallGuide onDismiss={dismissIOSGuide} />}
      <Footer />
      <ToastContainer />
    </>
  )
}
