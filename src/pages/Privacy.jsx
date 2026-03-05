import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Legal.module.css'

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy — SafeLaunch"
        description="SafeLaunch privacy policy. How we collect, use, and protect your data."
        canonical="https://agentslock.com/privacy"
      />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <h1 className={`display ${styles.title}`}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: February 24, 2026</p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>SafeLaunch ("we", "our", "us") operates the SafeLaunch PWA App Store at agentslock.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <h3>Account Information</h3>
          <p>When you create a publisher account, we collect your email address, display name, and authentication credentials (managed by Firebase Authentication).</p>
          <h3>App Submissions</h3>
          <p>When you submit an app, we collect the app metadata (name, description, category, icons, screenshots), source code or build artifacts for safety scanning, and your developer profile information.</p>
          <h3>Usage Data</h3>
          <p>We automatically collect information about your device and browsing activity, including IP address, browser type, pages visited, and interaction data to improve our services.</p>
          <h3>Payment Information</h3>
          <p>Payments are processed by PayPal. We do not store your credit card numbers or PayPal credentials. PayPal's privacy policy governs their handling of your payment data.</p>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide, maintain, and improve the SafeLaunch platform</li>
            <li>To process app submissions and run safety scans</li>
            <li>To manage your publisher account and dashboard</li>
            <li>To process payments for subscription plans</li>
            <li>To communicate with you about your account, apps, or services</li>
            <li>To detect, prevent, and address security issues or abuse</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Firebase (authentication, database), PayPal (payments), and hosting providers who assist in operating our platform.</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and the safety of our users.</li>
            <li><strong>Public App Listings:</strong> App names, descriptions, safety reports, and developer names are publicly visible on the store.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Data Security</h2>
          <p>We implement industry-standard security measures including encrypted connections (TLS/SSL), secure authentication via Firebase, and regular security audits. However, no method of electronic transmission or storage is 100% secure.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data. You can delete your account at any time from the Support page.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Cookies and Local Storage</h2>
          <p>SafeLaunch uses browser localStorage for app preferences and session tokens. We use minimal cookies required for authentication. No third-party tracking cookies are used.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Children's Privacy</h2>
          <p>SafeLaunch is not directed at children under 13. We do not knowingly collect data from children under 13.</p>
        </section>

        <section className={styles.section}>
          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
        </section>

        <section className={styles.section}>
          <h2>10. Questions</h2>
          <p>If you have questions about this Privacy Policy, please use our AI Support page for assistance.</p>
        </section>
      </div>
      <Footer />
    </>
  )
}
