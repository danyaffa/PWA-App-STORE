import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast.jsx'
import styles from './SignIn.module.css'

export default function SignIn() {
  const [mode, setMode]           = useState('signin')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [name, setName]           = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError]         = useState('')
  const { toast, ToastContainer } = useToast()
  const navigate = useNavigate()

  function handleSignIn(e) {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError('')
    toast('✅ Signing in...')
    setTimeout(() => navigate('/dashboard'), 1200)
  }

  function handleRegister(e) {
    e.preventDefault()
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (password !== password2) { setError('Passwords do not match.'); return }
    setError('')
    toast('🎉 Account created!')
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  return (
    <div className={styles.page}>
      <div className="orb" style={{width:500,height:500,background:'rgba(0,229,160,.06)',top:-100,left:-150}} />
      <div className="orb" style={{width:400,height:400,background:'rgba(124,111,255,.06)',bottom:-100,right:-100}} />

      <div className={styles.card}>
        <Link to="/" className={styles.logo}>Safe<span>Launch</span></Link>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${mode==='signin' ? styles.active : ''}`} onClick={() => { setMode('signin'); setError('') }}>Sign In</button>
          <button className={`${styles.tab} ${mode==='register' ? styles.active : ''}`} onClick={() => { setMode('register'); setError('') }}>Create Account</button>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className={styles.form}>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@yourcompany.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            <div className={styles.forgot}>
              <button type="button" className={styles.forgotBtn} onClick={() => toast('📧 Reset email sent')}>Forgot password?</button>
            </div>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Sign In →</button>
            <div className={styles.divider}><span>or continue with</span></div>
            <button type="button" className={`btn btn-ghost ${styles.oauthBtn}`} onClick={() => toast('🐙 GitHub OAuth — coming soon')}>🐙 GitHub</button>
            <button type="button" className={`btn btn-ghost ${styles.oauthBtn}`} onClick={() => toast('🔑 Google OAuth — coming soon')}>🔑 Google</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <div className="form-group">
              <label>Publisher / Company Name</label>
              <input className="input" placeholder="Dev Studio" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@yourcompany.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input className="input" type="password" placeholder="Repeat password" value={password2} onChange={e => setPassword2(e.target.value)} />
            </div>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Create Account →</button>
            <p className={styles.terms}>By creating an account you agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
          </form>
        )}

        <Link to="/" className={styles.back}>← Back to SafeLaunch</Link>
      </div>

      <ToastContainer />
    </div>
  )
}
