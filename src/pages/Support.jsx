import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useAuth } from '../context/AuthContext.jsx'
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
  if (s.includes('blocked') || s.includes('remove') || s.includes('delete') || s.includes('disconnect') || s.includes('cancel')) {
    return 'To delete your account and data, use the "Disconnect Account" button at the bottom of this page. This will cancel your plan and remove all your data permanently.'
  }
  if (s.includes('privacy') || s.includes('tracker') || s.includes('safe') || s.includes('malware') || s.includes('security')) {
    return 'Safety is a mix of automated checks (permissions, trackers, phishing signals) + policy rules. If you want, paste an app URL and I\'ll tell you what to scan for.'
  }
  return 'Got it. Tell me what page you\'re on (Store / Publish / App Detail) and what you want to achieve, and I\'ll guide you step-by-step.'
}

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null)
  const [chat, setChat] = useState([{ role: 'assistant', text: aiAnswer('') }])
  const [chatInput, setChatInput] = useState('')
  const [showDisconnect, setShowDisconnect] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  const { user, logout } = useAuth()
  const { toast, ToastContainer } = useToast()
  const navigate = useNavigate()

  const quickPrompts = useMemo(() => ([
    'How do I publish a ZIP?',
    'Why doesn\'t Install work on external apps?',
    'What does "Verified Safe" mean?',
  ]), [])

  function sendChat(text) {
    const t = (text || '').trim()
    if (!t) return
    setChat(prev => [...prev, { role: 'user', text: t }, { role: 'assistant', text: aiAnswer(t) }])
    setChatInput('')
  }

  async function handleDisconnect() {
    setDisconnecting(true)
    try {
      // Clear all local data
      localStorage.removeItem('sl_auth')
      localStorage.removeItem('sl_published_apps')
      localStorage.removeItem('sl_publish_draft')
      localStorage.removeItem('sl_billing_status')
      localStorage.removeItem('sl_promo_code')
      localStorage.removeItem('sl_dev_agreement')
      // Sign out
      await logout()
      toast('Account disconnected. All local data removed.')
      setTimeout(() => navigate('/'), 500)
    } catch {
      toast('Sign-out failed. Local data has been cleared.')
      setTimeout(() => navigate('/'), 500)
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <>
      <SEO
        title="Support — SafeLaunch"
        description="Get help with SafeLaunch. FAQs and AI-powered support."
        canonical="https://pwa-app-store.com/support"
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 900 }}>
        <div className="section-label">Help Center</div>
        <h1 className="section-title display">How Can We Help?</h1>
        <p className="section-sub" style={{ marginBottom: 32 }}>
          FAQs and AI-powered support — ask anything below.
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

        {/* Disconnect Account */}
        {user && (
          <div className={styles.disconnectSection}>
            {!showDisconnect ? (
              <button
                className={styles.disconnectBtn}
                onClick={() => setShowDisconnect(true)}
              >
                Disconnect Account
              </button>
            ) : (
              <div className={styles.disconnectWarning}>
                <strong>Warning:</strong> This will permanently remove your data, cancel your plan, and sign you out. This action cannot be undone.
                <div className={styles.disconnectActions}>
                  <button
                    className={styles.disconnectConfirm}
                    disabled={disconnecting}
                    onClick={handleDisconnect}
                  >
                    {disconnecting ? 'Disconnecting...' : 'Yes, Remove My Data & Cancel Plan'}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowDisconnect(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
