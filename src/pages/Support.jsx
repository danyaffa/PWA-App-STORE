import { useMemo, useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useToast } from '../hooks/useToast.js'
import styles from './Support.module.css'

const FAQ = [
  { q: 'How do I install SafeLaunch on my phone?', a: 'Open the Store in Chrome/Edge (Android/Windows) or Safari (iOS/macOS), then use the browser Install / Add to Home Screen option. See Install Guide for step-by-step.' },
  { q: 'How do I publish an app?', a: 'Create a publisher account, choose a plan, then upload your PWA via ZIP, GitHub, or URL. Our AI scans it automatically and publishes it to the store.' },
  { q: 'My app was rejected. What do I do?', a: 'Open the scan report. It explains what was found and how to fix it. After fixing, resubmit for a rescan.' },
  { q: 'How do I cancel my subscription?', a: 'Go to Dashboard > Billing and cancel. Your apps stay live until the end of the billing period.' },
  { q: 'Is my data safe?', a: 'We use secure login and TLS connections. We never store payment credentials in the app.' },
]

function aiAnswer(q) {
  const s = (q || '').toLowerCase()
  if (!s.trim()) return 'Ask me anything about publishing, installing, pricing, or safety.'
  if (s.includes('install') || s.includes('download')) {
    return 'If you mean installing SafeLaunch: use your browser\'s Install / Add to Home Screen option.\n\nIf you mean installing an app listed in the store: we can\'t "force-install" another website. Tap Open App, then use that site\'s Install option (if it\'s a real PWA).'
  }
  if (s.includes('publish') || s.includes('upload') || s.includes('zip') || s.includes('github')) {
    return 'Go to Publish → choose ZIP / GitHub / URL → Build & Scan → fix issues if any → Publish to Store.\n\nTip: make sure your app has a valid manifest.json + service worker to be installable.'
  }
  if (s.includes('price') || s.includes('paid') || s.includes('free')) {
    return 'In Publish, choose Free or Paid. If Paid, you\'ll set your pricing plan. For now, promo codes can enable free access to the platform.'
  }
  if (s.includes('blocked') || s.includes('remove') || s.includes('delete')) {
    return 'Management can block or delete apps from the Management Dashboard. Delete requires a verification code step.'
  }
  if (s.includes('privacy') || s.includes('tracker') || s.includes('safe') || s.includes('malware') || s.includes('security')) {
    return 'Safety is a mix of automated checks (permissions, trackers, phishing signals) + policy rules. If you want, paste an app URL and I\'ll tell you what to scan for.'
  }
  return 'Got it. Tell me what page you\'re on (Store / Publish / App Detail) and what you want to achieve, and I\'ll guide you step-by-step.'
}

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const [chat, setChat] = useState([{ role: 'assistant', text: aiAnswer('') }])
  const [chatInput, setChatInput] = useState('')

  const { toast, ToastContainer } = useToast()

  const quickPrompts = useMemo(() => ([
    'How do I publish a ZIP?',
    'Why doesn\'t Install work on external apps?',
    'What does "Verified Safe" mean?',
  ]), [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.message) return
    toast('Message sent! We will respond within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  function sendChat(text) {
    const t = (text || '').trim()
    if (!t) return
    setChat(prev => [...prev, { role: 'user', text: t }, { role: 'assistant', text: aiAnswer(t) }])
    setChatInput('')
  }

  return (
    <>
      <SEO
        title="Support — SafeLaunch"
        description="Get help with SafeLaunch. FAQs, AI help, and contact form."
        canonical="https://pwa-app-store.com/support"
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 900 }}>
        <div className="section-label">Help Center</div>
        <h1 className="section-title display">How Can We Help?</h1>
        <p className="section-sub" style={{ marginBottom: 32 }}>
          FAQs, AI help, or contact our team.
        </p>

        <h2 className={styles.sectionHead}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {FAQ.map((f, idx) => {
            const open = openFaq === idx
            return (
              <div key={idx} className={styles.faqItem} onClick={() => setOpenFaq(open ? null : idx)}>
                <div className={styles.faqQ}>
                  <span>{f.q}</span>
                  <span className={`${styles.faqChevron} ${open ? styles.open : ''}`}>›</span>
                </div>
                {open && <div className={styles.faqA}>{f.a}</div>}
              </div>
            )
          })}
        </div>

        <h2 className={styles.sectionHead}>AI Support</h2>
        <div className={styles.chatCard}>
          <div className={styles.chatLog}>
            {chat.map((m, i) => (
              <div key={i} className={`${styles.bubble} ${m.role === 'user' ? styles.user : styles.assistant}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className={styles.quickRow}>
            {quickPrompts.map(p => (
              <button key={p} className="btn btn-ghost btn-sm" onClick={() => sendChat(p)}>{p}</button>
            ))}
          </div>

          <div className={styles.chatInputRow}>
            <input
              className={styles.chatInput}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask a question..."
              onKeyDown={e => { if (e.key === 'Enter') sendChat(chatInput) }}
            />
            <button className="btn btn-primary" onClick={() => sendChat(chatInput)}>Ask</button>
          </div>

          <div className={styles.chatNote}>
            This is a lightweight built-in helper. Later you can connect it to a real AI backend.
          </div>
        </div>

        <h2 className={styles.sectionHead} style={{ marginTop: 28 }}>Contact Support</h2>
        <div className={styles.contactCard}>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className="form-group">
                <label>Name</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input className="input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea className="input" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <button className="btn btn-primary">Send</button>
          </form>

          <div className={styles.contactInfo}>
            <h3>Support</h3>
            <div className={styles.infoItem}><strong>Email</strong><span>support@agentslock.com</span></div>
            <div className={styles.infoItem}><strong>Hours</strong><span>Mon–Fri (AEST)</span></div>
            <div className={styles.infoItem}><strong>Response</strong><span>Within 24 hours</span></div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
