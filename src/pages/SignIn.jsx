import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import SEO from '../components/SEO.jsx'
import styles from './SignIn.module.css'
import { useToast } from '../hooks/useToast.js'

export default function SignIn() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast, ToastContainer } = useToast()
  const { login, register, loginWithGoogle, loginWithGithub, isConfigured } = useAuth()
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'signin')
  const redirectTo = searchParams.get('redirect') || ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [password2, setPassword2] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleOAuthLogin(provider) {
    setError('')
    setBusy(true)
    try {
      const result = provider === 'google' ? await loginWithGoogle() : await loginWithGithub()
      const u = result?.user
      localStorage.setItem('sl_auth', JSON.stringify({
        email: u?.email || '',
        company: u?.displayName || 'Publisher',
        ts: Date.now(),
      }))
      toast('Signed in.')
      if (redirectTo) {
        const params = new URLSearchParams()
        if (u?.email) params.set('email', u.email)
        if (u?.displayName) params.set('name', u.displayName)
        const sep = redirectTo.includes('?') ? '&' : '?'
        setTimeout(() => nav(`${redirectTo}${params.toString() ? sep + params.toString() : ''}`), 350)
      } else {
        setTimeout(() => nav('/dashboard'), 350)
      }
    } catch (err) {
      const code = err?.code || ''
      if (code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.')
      } else if (code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email. Try a different sign-in method.')
      } else {
        setError(err.message || `${provider} sign-in failed. Please try again.`)
      }
    } finally {
      setBusy(false)
    }
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please enter email and password.')

    setBusy(true)
    try {
      // Authenticate with Firebase when configured
      if (isConfigured) {
        await login(email, password)
      }

      // Store supplementary data in localStorage
      localStorage.setItem('sl_auth', JSON.stringify({ email, company: company || 'Publisher', ts: Date.now() }))
      if (promoCode && promoCode.trim()) {
        localStorage.setItem('sl_promo_code', promoCode.trim())
        localStorage.setItem('sl_billing_status', 'active')
      }

      toast('Signed in.')
      if (redirectTo) {
        const params = new URLSearchParams()
        params.set('email', email.trim().toLowerCase())
        if (company.trim()) params.set('name', company.trim())
        const sep = redirectTo.includes('?') ? '&' : '?'
        setTimeout(() => nav(`${redirectTo}${sep}${params.toString()}`), 350)
      } else {
        setTimeout(() => nav('/dashboard'), 350)
      }
    } catch (err) {
      const code = err?.code || ''
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.')
      } else if (code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (code === 'auth/network-request-failed') {
        setError('Cannot reach authentication server. Please check your connection and try again.')
      } else if (code === 'auth/invalid-api-key') {
        setError('Authentication is misconfigured. Please contact support.')
      } else {
        setError(err.message || 'Sign in failed. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (!company || !email || !password) return setError('Please fill all fields.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== password2) return setError('Passwords do not match.')

    setBusy(true)
    try {
      // Register with Firebase when configured
      if (isConfigured) {
        await register(email, password, company)
      }

      localStorage.setItem('sl_auth', JSON.stringify({ email, company, ts: Date.now() }))

      // Promo code = free access path (skips payment for now)
      if (promoCode && promoCode.trim()) {
        localStorage.setItem('sl_promo_code', promoCode.trim())
        localStorage.setItem('sl_billing_status', 'active')
      }

      toast('Account created!')

      // Promo/free users go straight to dashboard; everyone else sees the pricing/payment page
      if (promoCode && promoCode.trim()) {
        setTimeout(() => nav('/dashboard'), 350)
      } else {
        const dest = redirectTo || '/payment'
        const paymentParams = new URLSearchParams()
        paymentParams.set('email', email.trim().toLowerCase())
        if (company.trim()) paymentParams.set('name', company.trim())
        const sep = dest.includes('?') ? '&' : '?'
        setTimeout(() => nav(`${dest}${sep}${paymentParams.toString()}`), 350)
      }
    } catch (err) {
      const code = err?.code || ''
      if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try signing in instead.')
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (code === 'auth/network-request-failed') {
        setError('Cannot reach authentication server. Please check your connection and try again.')
      } else if (code === 'auth/invalid-api-key') {
        setError('Authentication is misconfigured. Please contact support.')
      } else {
        setError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <SEO title="Sign In — SafeLaunch" description="Sign in to publish and manage your apps." canonical="https://agentslock.com/signin" />
      <div className={styles.page}>
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
                <div className={styles.pwWrap}>
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" className={styles.pwToggle} onClick={() => setShowPw(v => !v)} tabIndex={-1}>{showPw ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div className="form-group">
                <label>PROMO CODE (OPTIONAL)</label>
                <input className="input" placeholder="Enter promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
              </div>

              {error && <div className={styles.errorBox}>{error}</div>}

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={busy}>
                {busy ? 'Signing in...' : 'Sign In →'}
              </button>

              <div className={styles.forgot}>
                <button
                  type="button"
                  className={styles.forgotBtn}
                  disabled={busy}
                  onClick={async () => {
                    if (!email) return setError('Enter your email first, then click "Forgot password".')
                    setBusy(true)
                    try {
                      if (isConfigured) {
                        const { sendPasswordResetEmail } = await import('firebase/auth')
                        const { auth } = await import('../lib/firebase.js')
                        await sendPasswordResetEmail(auth, email)
                      }
                      toast('Password reset email sent. Check your inbox.')
                      setError('')
                    } catch (err) {
                      const code = err?.code || ''
                      if (code === 'auth/user-not-found') {
                        setError('No account found with this email.')
                      } else {
                        setError(err?.message || 'Failed to send reset email.')
                      }
                    } finally {
                      setBusy(false)
                    }
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <div className={styles.divider}><span>or continue with</span></div>
              <button type="button" className={`btn btn-ghost ${styles.oauthBtn}`} disabled={busy} onClick={() => handleOAuthLogin('github')}>🦑 GitHub</button>
              <button type="button" className={`btn btn-ghost ${styles.oauthBtn}`} disabled={busy} onClick={() => handleOAuthLogin('google')}>🔑 Google</button>

              <Link className={styles.back} to="/">← Back to SafeLaunch</Link>
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
                <div className={styles.pwWrap}>
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" className={styles.pwToggle} onClick={() => setShowPw(v => !v)} tabIndex={-1}>{showPw ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div className="form-group">
                <label>CONFIRM PASSWORD</label>
                <div className={styles.pwWrap}>
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="Repeat password" value={password2} onChange={e => setPassword2(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>PROMO CODE (OPTIONAL)</label>
                <input className="input" placeholder="Enter promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
              </div>

              {error && <div className={styles.errorBox}>{error}</div>}

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={busy}>
                {busy ? 'Creating account...' : 'Create Account →'}
              </button>

              <div className={styles.terms}>
                By creating an account you agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
              </div>

              <Link className={styles.back} to="/">← Back to SafeLaunch</Link>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
