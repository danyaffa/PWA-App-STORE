import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import styles from './ManagementLogin.module.css'
import { useToast } from '../hooks/useToast.js'

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export default function ManagementLogin() {
  const nav = useNavigate()
  const { toast, ToastContainer } = useToast()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // If already authed with a valid (non-expired) session, go straight in
    try {
      const s = JSON.parse(localStorage.getItem('sl_mgmt_session') || 'null')
      if (s?.ts) {
        const age = Date.now() - Number(s.ts || 0)
        if (age >= 0 && age < 8 * 60 * 60 * 1000) {
          nav('/management', { replace: true })
        } else {
          // Expired session — clear it to avoid redirect loops
          localStorage.removeItem('sl_mgmt_session')
        }
      }
    } catch { /* ignore */ }
  }, [])

  function sendCode(e) {
    e?.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your management email.')
    const c = randomCode()
    setSentCode(c)
    toast('Verification code generated. (Demo: shown on screen)')
  }

  function confirm(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your management email.')
    if (!sentCode) return setError('Click "Send Code" first.')
    if (code.trim() !== sentCode) return setError('Verification code is incorrect.')

    localStorage.setItem('sl_mgmt_session', JSON.stringify({ email: email.trim(), ts: Date.now() }))
    toast('Management access granted.')
    setTimeout(() => nav('/management'), 350)
  }

  return (
    <>
      <SEO title="Management Login — SafeLaunch" description="Secure admin access with verification code." canonical="https://pwa-app-store.com/management-login" />
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Management Login</h1>
          <div className={styles.sub}>Secure admin access.</div>

          {sentCode && (
            <div className={styles.codeBanner}>
              Your 6-digit code is: <b>{sentCode}</b>
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
              <button type="button" className={styles.sendBtn} onClick={sendCode}>Send Code</button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.confirmBtn}>Confirm</button>

            <div className={styles.links}>
              <a href="#" onClick={(e) => { e.preventDefault(); toast('Use "Send Code" in this demo.'); }}>Try a different method</a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast('This will be added for team accounts later.'); }}>New team member? Set up your password</a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast('Password reset is not wired yet (demo).'); }}>Forgot password?</a>
              <Link to="/store">Return to Store</Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
