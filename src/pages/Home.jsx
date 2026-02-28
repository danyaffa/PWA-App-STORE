import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Home.module.css'

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
      </div>

      <Footer />
    </>
  )
}
