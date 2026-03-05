import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Legal.module.css'

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Service — SafeLaunch"
        description="SafeLaunch terms of service. Rules and guidelines for using the SafeLaunch PWA App Store."
        canonical="https://agentslock.com/terms"
      />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <h1 className={`display ${styles.title}`}>Terms of Service</h1>
        <p className={styles.updated}>Last updated: February 24, 2026</p>

        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using SafeLaunch at agentslock.com ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part, you may not access the Service.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Description of Service</h2>
          <p>SafeLaunch is a Progressive Web App (PWA) marketplace that enables developers to publish, and users to discover and install, web applications that have been verified through our AI-powered safety scanning pipeline.</p>
        </section>

        <section className={styles.section}>
          <h2>3. User Accounts</h2>
          <ul>
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must be at least 18 years old to create a publisher account.</li>
            <li>One person may not maintain more than one account.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Developer Responsibilities</h2>
          <p>As a developer publishing apps on SafeLaunch, you agree to:</p>
          <ul>
            <li>Submit only apps you have the right to distribute.</li>
            <li>Provide accurate descriptions, screenshots, and metadata for your apps.</li>
            <li>Not submit malware, spyware, or apps that violate user privacy.</li>
            <li>Comply with all applicable laws and regulations.</li>
            <li>Maintain a valid privacy policy URL for each published app.</li>
            <li>Respond to abuse reports and user concerns in a timely manner.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Subscription Plans and Payments</h2>
          <ul>
            <li>Publisher subscriptions are billed monthly or annually via PayPal.</li>
            <li>SafeLaunch does not take revenue cuts from your app earnings.</li>
            <li>You may cancel your subscription at any time from your dashboard.</li>
            <li>Refunds are handled on a case-by-case basis.</li>
            <li>Apps will be unpublished automatically at the end of a cancelled billing period.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Safety Scanning</h2>
          <p>All apps submitted to SafeLaunch undergo automated safety scanning. SafeLaunch reserves the right to:</p>
          <ul>
            <li>Reject or remove apps that fail safety scans.</li>
            <li>Place apps under review for manual inspection.</li>
            <li>Suspend publisher accounts that repeatedly submit harmful content.</li>
          </ul>
          <p>Safety scans are provided as-is. While we strive for accuracy, no automated system can guarantee 100% detection of all threats.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Intellectual Property</h2>
          <p>Developers retain all rights to their submitted applications. By publishing on SafeLaunch, you grant us a non-exclusive license to host, display, and distribute your app through our platform.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Prohibited Conduct</h2>
          <ul>
            <li>Attempting to circumvent safety scans or security measures.</li>
            <li>Submitting fraudulent reviews or manipulating ratings.</li>
            <li>Scraping or data mining the SafeLaunch platform.</li>
            <li>Impersonating other developers or companies.</li>
            <li>Using the platform for any illegal purpose.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>9. Limitation of Liability</h2>
          <p>SafeLaunch is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of apps installed from our platform or from interruptions to the service.</p>
        </section>

        <section className={styles.section}>
          <h2>10. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section className={styles.section}>
          <h2>11. Questions</h2>
          <p>Questions about these Terms? Please use our AI Support page for assistance.</p>
        </section>
      </div>
      <Footer />
    </>
  )
}
