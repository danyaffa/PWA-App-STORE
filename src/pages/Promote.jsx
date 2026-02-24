import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { APPS } from '../utils/data.js'
import { useToast } from '../hooks/useToast.js'
import styles from './Promote.module.css'

export default function Promote() {
  const { id } = useParams()
  const { toast, ToastContainer } = useToast()
  const [copied, setCopied] = useState(null)

  const app = APPS.find(a => a.id === id) || APPS[0]
  const appUrl = `https://agentslock.com/app/${app.id}`

  function copy(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      toast(`Copied ${label}`)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const shareLink = appUrl
  const embedBadge = `<a href="${appUrl}" target="_blank" rel="noopener"><img src="https://agentslock.com/badge-safelaunch.svg" alt="Available on SafeLaunch" width="200" height="58" /></a>`
  const installButton = `<a href="${appUrl}" style="display:inline-block;padding:12px 24px;background:#00e5a0;color:#0a0a0f;border-radius:8px;font-weight:700;text-decoration:none;font-family:sans-serif">Install ${app.name} on SafeLaunch</a>`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`

  // Social content
  const tweetText = `Just launched ${app.name} on SafeLaunch — the AI-verified PWA app store. Install it now, no app store approvals needed.\n\n${appUrl}`
  const linkedInText = `Excited to announce ${app.name} is now live on SafeLaunch!\n\n${app.desc}\n\nSafeLaunch uses AI-powered safety scanning to verify every app before publishing. No developer accounts, no approval delays.\n\nTry it: ${appUrl}`
  const tiktokCaption = `${app.name} is LIVE on SafeLaunch — publish apps without App Store approvals. AI-verified safe. ${appUrl}`
  const productHuntText = `${app.name} — ${app.desc}\n\nPublished on SafeLaunch, the AI-verified PWA app store. Every app goes through a 6-layer automated safety scan before going live.\n\nKey features:\n- Fully offline-first PWA\n- AI safety verified (score: ${app.score}/100)\n- No account required\n- Install on any device\n\n${appUrl}`

  return (
    <>
      <SEO title={`Promote ${app.name} — SafeLaunch`} description={`Promote your app ${app.name} with share links, embed badges, and ready-made social posts.`} canonical={`https://agentslock.com/app/${app.id}/promote`} />
      <Nav />
      <div className="page-wrap page-wrap--narrow">
        <Link to={`/app/${app.id}`} style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Back to {app.name}</Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, marginBottom: 32 }}>
          <div className={styles.icon}>{app.icon}</div>
          <div>
            <h1 className={`display ${styles.title}`}>Promote {app.name}</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Share links, embed badges, and social posts to grow your installs.</p>
          </div>
        </div>

        {/* Share Link */}
        <section className={styles.section}>
          <h2>Share Link</h2>
          <div className={styles.codeBox}>
            <code>{shareLink}</code>
            <button className="btn btn-ghost btn-sm" onClick={() => copy(shareLink, 'share link')}>{copied === 'share link' ? 'Copied' : 'Copy'}</button>
          </div>
        </section>

        {/* QR Code */}
        <section className={styles.section}>
          <h2>QR Code</h2>
          <p className={styles.desc}>Print this or add it to presentations and packaging.</p>
          <div className={styles.qrBox}>
            <img src={qrUrl} alt={`QR code for ${app.name}`} width="200" height="200" style={{ borderRadius: 12, background: '#fff', padding: 8 }} />
          </div>
        </section>

        {/* Embed Badge */}
        <section className={styles.section}>
          <h2>Embed Badge</h2>
          <p className={styles.desc}>Add this badge to your website.</p>
          <div className={styles.badgePreview}>
            <div style={{ background: 'var(--accent)', color: '#0a0a0f', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.2rem' }}>🛡</span> Available on SafeLaunch
            </div>
          </div>
          <div className={styles.codeBox}>
            <code style={{ fontSize: '0.75rem' }}>{embedBadge}</code>
            <button className="btn btn-ghost btn-sm" onClick={() => copy(embedBadge, 'embed badge')}>{copied === 'embed badge' ? 'Copied' : 'Copy'}</button>
          </div>
        </section>

        {/* Install Button */}
        <section className={styles.section}>
          <h2>Install Button HTML</h2>
          <div className={styles.codeBox}>
            <code style={{ fontSize: '0.75rem' }}>{installButton}</code>
            <button className="btn btn-ghost btn-sm" onClick={() => copy(installButton, 'install button')}>{copied === 'install button' ? 'Copied' : 'Copy'}</button>
          </div>
        </section>

        {/* Social Content Generator */}
        <section className={styles.section}>
          <h2>Social Content Generator</h2>
          <p className={styles.desc}>Ready-made launch posts. Click to copy.</p>

          {[
            { label: 'Twitter / X', text: tweetText, icon: '🐦' },
            { label: 'LinkedIn', text: linkedInText, icon: '💼' },
            { label: 'TikTok Caption', text: tiktokCaption, icon: '🎵' },
            { label: 'Product Hunt', text: productHuntText, icon: '🚀' },
          ].map(({ label, text, icon }) => (
            <div key={label} className={styles.socialCard}>
              <div className={styles.socialHeader}>
                <span>{icon} {label}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => copy(text, label)}>{copied === label ? 'Copied' : 'Copy'}</button>
              </div>
              <pre className={styles.socialText}>{text}</pre>
            </div>
          ))}
        </section>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
