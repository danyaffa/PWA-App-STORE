import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './ManagementLogin.module.css'
import { useToast } from '../hooks/useToast.js'

function hasValidSession() {
  try {
    const s = JSON.parse(localStorage.getItem('sl_mgmt_session') || 'null')
    if (!s || !s.ts) return false
    const age = Date.now() - Number(s.ts || 0)
    if (age >= 0 && age < 8 * 60 * 60 * 1000) return true
    localStorage.removeItem('sl_mgmt_session')
  } catch { /* ignore */ }
  return false
}

export default function ManagementLogin() {
  const nav = useNavigate()
  const { toast, ToastContainer } = useToast()

  // Check session synchronously on first render — avoid flash before redirect
  const [redirecting] = useState(() => hasValidSession())

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [token, setToken] = useState('')
  const [ts, setTs] = useState(0)
  const [sending, setSending] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (redirecting) {
      nav('/management', { replace: true })
    }
  }, [redirecting, nav])

  async function sendCode(e) {
    e?.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your management email.')

    setSending(true)
    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to send code.')
        return
      }

      setToken(data.token)
      setTs(data.ts)
      setCodeSent(true)
      toast('Verification code sent to your email.')
    } catch {
      setError('Network error. Could not send code.')
    } finally {
      setSending(false)
    }
  }

  async function confirm(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your management email.')
    if (!codeSent) return setError('Click "Send Code" first.')
    if (!code.trim()) return setError('Please enter the verification code.')

    setVerifying(true)
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: code.trim(), token, ts }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification failed.')
        return
      }

      localStorage.setItem('sl_mgmt_session', JSON.stringify({ email: email.trim(), ts: Date.now() }))
      toast('Management access granted.')
      setTimeout(() => nav('/management'), 350)
    } catch {
      setError('Network error. Could not verify code.')
    } finally {
      setVerifying(false)
    }
  }

  // While redirecting to /management, render just the Nav (keeps the screen consistent)
  if (redirecting) {
    return (
      <>
        <Nav />
        <div className="page-wrap" style={{ minHeight: '60vh' }} />
      </>
    )
  }

  return (
    <>
      <SEO title="Management Login — SafeLaunch" description="Secure admin access with verification code." canonical="https://pwa-app-store.com/management-login" />
      <Nav />
      <div className="page-wrap">
        <div className={styles.wrap}>
          <div className={styles.card}>
            <h1 className={styles.title}>Management Login</h1>
            <div className={styles.sub}>Secure admin access. A verification code will be sent to your email.</div>

            {codeSent && (
              <div className={styles.codeBanner}>
                Verification code sent to <b>{email}</b>. Check your inbox.
              </div>
            )}

            <form onSubmit={confirm} className={styles.form}>
              <div className={styles.group}>
                <label className={styles.label}>Management Email</label>
                <input className={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@yourcompany.com" />
              </div>

              <div className={styles.groupRow}>
                <div className={styles.group} style={{ flex: 1 }}>
                  <label className={styles.label}>Verification Code</label>
                  <input className={styles.input} value={code} onChange={e => setCode(e.target.value)} placeholder="Enter the 6-digit code" inputMode="numeric" />
                </div>
                <button type="button" className={styles.sendBtn} onClick={sendCode} disabled={sending}>
                  {sending ? 'Sending...' : (codeSent ? 'Resend' : 'Send Code')}
                </button>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button className={styles.confirmBtn} disabled={verifying}>
                {verifying ? 'Verifying...' : 'Confirm'}
              </button>

              <div className={styles.links}>
                <Link to="/store">Return to Store</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
