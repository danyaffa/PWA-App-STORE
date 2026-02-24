import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useToast } from '../hooks/useToast.js'
import styles from './Support.module.css'

const FAQ = [
  { q: 'How do I install SafeLaunch on my phone?', a: 'Visit agentslock.com/app-store in Safari (iOS) or Chrome (Android), then use "Add to Home Screen" to install. See our Install Guide for step-by-step instructions.' },
  { q: 'How do I publish an app?', a: 'Create a publisher account, choose a plan, then upload your PWA via ZIP, GitHub, or URL. Our AI scans it automatically and publishes it to the store.' },
  { q: 'My app was rejected. What do I do?', a: 'Check the scan report for details. It explains exactly what was found and how to fix it. Once fixed, resubmit for a free rescan.' },
  { q: 'How do I cancel my subscription?', a: 'Go to Dashboard > Billing and click Cancel Subscription. Your apps stay live until the end of the current billing period.' },
  { q: 'Is my data safe?', a: 'Yes. We use Firebase Authentication for secure login, encrypted connections (TLS), and never store payment credentials. All app data is scanned for security threats.' },
  { q: 'Can I get a refund?', a: 'Refunds are handled case-by-case. Contact support@agentslock.com within 14 days of your payment for consideration.' },
]

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const { toast, ToastContainer } = useToast()

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.message) return
    toast('Message sent! We will respond within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <SEO
        title="Support — SafeLaunch"
        description="Get help with SafeLaunch. FAQs, contact form, and support resources."
        canonical="https://agentslock.com/support"
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 900 }}>
        <div className="section-label">Help Center</div>
        <h1 className="section-title display">How Can We Help?</h1>
        <p className="section-sub" style={{ marginBottom: 48 }}>
          Find answers to common questions or reach out to our team directly.
        </p>

        {/* FAQ */}
        <h2 className={styles.sectionHead}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {FAQ.map((f, i) => (
            <div key={i} className={styles.faqItem} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className={styles.faqQ}>
                <span>{f.q}</span>
                <span className={`${styles.faqChevron} ${openFaq === i ? styles.open : ''}`}>&#8250;</span>
              </div>
              {openFaq === i && <p className={styles.faqA}>{f.a}</p>}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <h2 className={styles.sectionHead} style={{ marginTop: 64 }}>Contact Support</h2>
        <div className={styles.contactCard}>
          <form onSubmit={handleSubmit} className={styles.contactForm}>
            <div className={styles.formRow}>
              <div className="form-group">
                <label>Name</label>
                <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <select className="input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                <option value="">Select a topic</option>
                <option>Account & Billing</option>
                <option>App Submission Issue</option>
                <option>Safety Scan Question</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="input" rows="5" placeholder="Describe your issue or question..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required style={{resize:'vertical'}} />
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>

          <div className={styles.contactInfo}>
            <h3>Other Ways to Reach Us</h3>
            <div className={styles.infoItem}>
              <strong>Email</strong>
              <span>support@agentslock.com</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Response Time</strong>
              <span>Within 24 hours</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Hours</strong>
              <span>Mon-Fri, 9AM-6PM AEST</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
