import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Legal.module.css'

export default function DMCA() {
  return (
    <>
      <SEO
        title="DMCA / Content Removal — SafeLaunch"
        description="Report copyright infringement or request content removal on SafeLaunch."
        canonical="https://agentslock.com/dmca"
      />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <h1 className={`display ${styles.title}`}>DMCA / Content Removal Policy</h1>
        <p className={styles.updated}>Last updated: February 24, 2026</p>

        <section className={styles.section}>
          <h2>1. Overview</h2>
          <p>SafeLaunch respects the intellectual property rights of others and expects our users to do the same. We respond to notices of alleged copyright infringement in accordance with the Digital Millennium Copyright Act (DMCA) and similar laws worldwide.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Platform Disclaimer</h2>
          <p><strong>Apps published on this platform are submitted by independent developers. We do not create, own, or guarantee the safety, legality, or functionality of third-party applications. Users install apps at their own discretion. If you believe an app violates laws or rights, please report it through our AI Support page for immediate review.</strong></p>
        </section>

        <section className={styles.section}>
          <h2>3. Filing a DMCA Takedown Notice</h2>
          <p>If you believe an application on SafeLaunch infringes your copyright, please submit a report through our AI Support page containing:</p>
          <ul>
            <li>Your full legal name and contact information (email, phone, mailing address).</li>
            <li>A description of the copyrighted work you claim has been infringed.</li>
            <li>The URL or identifier of the infringing app on SafeLaunch.</li>
            <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement, made under penalty of perjury, that the above information is accurate and that you are authorized to act on behalf of the copyright owner.</li>
            <li>Your physical or electronic signature.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Our Response Process</h2>
          <ul>
            <li><strong>Receipt:</strong> We will acknowledge your notice within 2 business days.</li>
            <li><strong>Review:</strong> We will review the claim and take action within 5 business days.</li>
            <li><strong>Action:</strong> If valid, the infringing app will be removed or disabled.</li>
            <li><strong>Notification:</strong> We will notify the app developer and provide them an opportunity to file a counter-notification.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Counter-Notification</h2>
          <p>If you believe your app was removed in error, you may file a counter-notification through our AI Support page containing:</p>
          <ul>
            <li>Your full legal name and contact information.</li>
            <li>Identification of the material that was removed and the URL where it appeared.</li>
            <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake or misidentification.</li>
            <li>A statement that you consent to the jurisdiction of the federal court in your district.</li>
            <li>Your physical or electronic signature.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Content Removal (Non-Copyright)</h2>
          <p>For non-copyright content removal requests (malware, illegal content, impersonation, privacy violations), please report through our AI Support page with:</p>
          <ul>
            <li>The app name and URL.</li>
            <li>Description of the issue.</li>
            <li>Any supporting evidence.</li>
          </ul>
          <p>We will review all reports within 48 hours and take appropriate action.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Repeat Infringers</h2>
          <p>SafeLaunch maintains a policy of terminating the accounts of repeat infringers in appropriate circumstances.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Reporting</h2>
          <p>For all DMCA and content removal requests, please use our AI Support page.</p>
        </section>
      </div>
      <Footer />
    </>
  )
}
