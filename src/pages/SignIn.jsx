import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import styles from './SignIn.module.css'
import { useToast } from '../hooks/useToast.js'

export default function SignIn() {
  const nav = useNavigate()
  const { toast, ToastContainer } = useToast()
  const [tab, setTab] = useState('signin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [password2, setPassword2] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [error, setError] = useState('')

  function handleSignIn(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please enter email and password.')
    localStorage.setItem('sl_auth', JSON.stringify({ email, company: company || 'Publisher', ts: Date.now() }))
    toast('✅ Signed in.')
    setTimeout(() => nav('/dashboard'), 350)
  }

  function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (!company || !email || !password) return setError('Please fill all fields.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== password2) return setError('Passwords do not match.')

    localStorage.setItem('sl_auth', JSON.stringify({ email, company, ts: Date.now() }))

    // Promo code = free access path (skips payment for now)
    if (promoCode && promoCode.trim()) {
      localStorage.setItem('sl_promo_code', promoCode.trim())
      localStorage.setItem('sl_billing_status', 'active')
    }

    toast('🎉 Account created!')
    setTimeout(() => nav('/pricing'), 350)
  }

  return (
    <>
      <SEO title="Sign In — SafeLaunch" description="Sign in to publish and manage your apps." canonical="https://pwa-app-store.com/signin" />
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.logo}>Safe<span>Launch</span></div>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'signin' ? styles.active : ''}`} onClick={() => setTab('signin')}>Sign In</button>
            <button className={`${styles.tab} ${tab === 'register' ? styles.active : ''}`} onClick={() => setTab('register')}>Create Account</button>
          </div>

          {tab === 'signin' && (
            <form className={styles.form} onSubmit={handleSignIn}>
              <div className="form-group">
                <label>EMAIL</label>
                <input className="input" placeholder="you@yourcompany.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>PASSWORD</label>
                <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Sign In →</button>

              <div className={styles.rowBetween}>
                <Link className={styles.smallLink} to="/forgot">Forgot password?</Link>
              </div>

              <div className={styles.divider}><span>or continue with</span></div>
              <button type="button" className={`btn btn-ghost ${styles.oauthBtn}`}>🦑 GitHub</button>
              <button type="button" className={`btn btn-ghost ${styles.oauthBtn}`}>🔑 Google</button>

              <Link className={styles.back} to="/store">← Back to SafeLaunch</Link>
            </form>
          )}

          {tab === 'register' && (
            <form className={styles.form} onSubmit={handleRegister}>
              <div className="form-group">
                <label>PUBLISHER / COMPANY NAME</label>
                <input className="input" placeholder="Dev Studio" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div className="form-group">
                <label>EMAIL</label>
                <input className="input" placeholder="you@yourcompany.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>PASSWORD</label>
                <input className="input" type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label>CONFIRM PASSWORD</label>
                <input className="input" type="password" placeholder="Repeat password" value={password2} onChange={e => setPassword2(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Promo Code (optional)</label>
                <input className="input" placeholder="Enter promo code for free access" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Create Account →</button>

              <div className={styles.legal}>
                By creating an account you agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
              </div>

              <Link className={styles.back} to="/store">← Back to SafeLaunch</Link>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
