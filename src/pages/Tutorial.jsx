import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Tutorial.module.css'

const STEPS = [
  {
    num: '01',
    title: 'What is a PWA?',
    icon: '📱',
    prompt: null,
    desc: 'A Progressive Web App (PWA) is a website that behaves like an app: it can be installed, works offline (if coded), loads fast, and feels native on mobile/desktop.',
    tip: 'A real PWA needs a valid manifest + service worker, served over HTTPS.',
  },
  {
    num: '02',
    title: 'Build a PWA with AI (Claude Code / Codex / ChatGPT)',
    icon: '🤖',
    prompt: 'Build a PWA for a simple habit tracker. Requirements: responsive UI, offline support, installable, local storage, and a clean dark theme.',
    desc: 'Use your AI coding tool to generate the full project. Ask for a complete Vite + React PWA, or a Vanilla JS PWA. The key is: "installable + offline + manifest + service worker".',
    tip: 'Always request "give me the full repo, not snippets".',
  },
  {
    num: '03',
    title: 'Minimum PWA Checklist (Must-Have Files)',
    icon: '✅',
    prompt: null,
    desc: 'Make sure your app includes: (1) manifest.json (name, icons, start_url, display), (2) service worker (offline caching), (3) icons (192/512), (4) HTTPS hosting, and (5) responsive design.',
    tip: 'If the Install prompt never appears, you\'re usually missing a valid manifest or service worker.',
  },
  {
    num: '04',
    title: 'Deploy (Vercel / Netlify / GitHub Pages)',
    icon: '🚀',
    prompt: 'Deploy this PWA to Vercel and give me the exact steps and commands.',
    desc: 'Deploy your PWA so it has a public URL. SafeLaunch can scan a URL, ZIP, or GitHub repo — but a URL is the fastest for testing install + offline.',
    tip: 'Test on mobile: open the URL in Chrome → "Install app" / "Add to Home Screen".',
  },
  {
    num: '05',
    title: 'Publish on SafeLaunch',
    icon: '🛡️',
    prompt: 'Prepare my app for SafeLaunch publishing. Include app name, category, privacy policy URL, contact email, and a short description.',
    desc: 'Go to Publish → choose ZIP / GitHub / URL → Build & Scan → Publish to Store. After publishing, users can open your app detail page and launch your PWA.',
    tip: 'Your app detail page should include: description, permissions/privacy, features, and your official URL.',
  },
]

const AI_PROMPTS = [
  {
    title: 'PWA Template Prompt (Vite + React)',
    text:
`Build a complete Vite + React PWA project.
Requirements:
- Installable PWA (manifest + service worker)
- Offline caching (basic)
- Mobile-first responsive UI
- / (home), /about pages
- Clean dark theme
- Include icons (192, 512) and a manifest.json
- Provide the full repo with file paths.`,
  },
  {
    title: 'Fix Install Prompt Prompt',
    text:
`My PWA does not show an Install button/prompt.
Audit my project and fix:
- manifest.json validity
- service worker registration
- HTTPS requirements
- Lighthouse PWA checks
Return full updated files, not snippets.`,
  },
  {
    title: 'SafeLaunch Publish Metadata Prompt',
    text:
`Create store metadata for my PWA:
- Short description (1 line)
- Full description (5–8 lines)
- Category suggestion
- Key features list (4–6 bullets)
- Privacy summary
- What data is collected (if any)
Be honest and concise.`,
  },
]

export default function Tutorial() {
  const [open, setOpen] = useState(0)

  return (
    <>
      <SEO
        title="Tutorial — Build & Publish PWAs"
        description="Learn what a PWA is, how to build it with AI tools, and how to publish on SafeLaunch."
        canonical="https://pwa-app-store.com/tutorial"
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 980 }}>
        <div className="section-label">Tutorial</div>
        <h1 className="section-title display">Build a PWA. Publish it. In minutes.</h1>
        <p className="section-sub" style={{ marginBottom: 28 }}>
          This guide explains PWAs in plain English — and gives you copy/paste prompts for Claude Code, Codex, or ChatGPT.
        </p>

        <div className={styles.stepGrid}>
          <div className={styles.stepList}>
            {STEPS.map((s, idx) => (
              <button
                key={s.num}
                className={`${styles.stepBtn} ${open === idx ? styles.stepBtnActive : ''}`}
                onClick={() => setOpen(idx)}
              >
                <span className={styles.stepNum}>{s.num}</span>
                <span className={styles.stepIcon}>{s.icon}</span>
                <span className={styles.stepTitle}>{s.title}</span>
              </button>
            ))}
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepCardHead}>
              <div className={styles.stepCardIcon}>{STEPS[open].icon}</div>
              <div>
                <div className={styles.stepCardNum}>Step {STEPS[open].num}</div>
                <div className={styles.stepCardTitle}>{STEPS[open].title}</div>
              </div>
            </div>

            <div className={styles.stepCardBody}>
              <p className={styles.stepDesc}>{STEPS[open].desc}</p>

              {STEPS[open].prompt && (
                <>
                  <div className={styles.promptLabel}>Example prompt</div>
                  <pre className={styles.promptBox}>{STEPS[open].prompt}</pre>
                </>
              )}

              <div className={styles.tipBox}>
                <div className={styles.tipTitle}>Tip</div>
                <div className={styles.tipText}>{STEPS[open].tip}</div>
              </div>
            </div>
          </div>
        </div>

        <h2 className={styles.sectionHead} style={{ marginTop: 26 }}>Copy/Paste AI Prompts</h2>
        <div className={styles.promptGrid}>
          {AI_PROMPTS.map(p => (
            <div key={p.title} className={styles.promptCard}>
              <div className={styles.promptTitle}>{p.title}</div>
              <pre className={styles.promptBox}>{p.text}</pre>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
