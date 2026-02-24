import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import styles from './Tutorial.module.css'

const STEPS = [
  {
    num: '01',
    title: 'Describe Your App Idea',
    icon: '💡',
    prompt: 'Build me a PWA todo app with offline support, dark mode, and local storage. Make it installable on mobile.',
    desc: 'Just tell Claude Code what you want in plain English. No technical jargon needed. Describe the features, the look, and who it\'s for.',
    tip: 'Be specific! Instead of "make an app", say "make a recipe app with search, favorites, and a shopping list".',
  },
  {
    num: '02',
    title: 'Claude Code Builds It',
    icon: '⚡',
    prompt: null,
    desc: 'Claude Code writes all the code for you — HTML, CSS, JavaScript, service worker, manifest, icons — everything a PWA needs. It creates a complete, working app in minutes.',
    tip: 'Claude Code handles the hard parts: offline caching, responsive design, install prompts, and app icons.',
  },
  {
    num: '03',
    title: 'Test & Refine',
    icon: '🔄',
    prompt: 'Change the color scheme to blue and green. Add a "clear all" button. Make the font bigger on mobile.',
    desc: 'Preview your app, then ask Claude Code to make changes. Adjust colors, add features, fix layout — just describe what you want different.',
    tip: 'You can iterate as many times as you want. Each change takes seconds, not hours.',
  },
  {
    num: '04',
    title: 'Deploy Your App',
    icon: '🚀',
    prompt: 'Deploy this to Vercel (or Netlify, or GitHub Pages).',
    desc: 'Claude Code can deploy your app to free hosting with one command. Your PWA gets a real URL that anyone can visit and install.',
    tip: 'Free hosting on Vercel, Netlify, or GitHub Pages — no credit card needed.',
  },
  {
    num: '05',
    title: 'Publish on SafeLaunch',
    icon: '🛡️',
    prompt: null,
    desc: 'Submit your PWA to SafeLaunch for AI safety scanning. Once approved, it appears in the store where thousands of users can discover and install it.',
    tip: 'Our 6-layer security pipeline automatically verifies your app is safe for users.',
  },
]

const EXAMPLES = [
  {
    icon: '📝',
    name: 'Note-Taking App',
    prompt: 'Build a PWA note-taking app with markdown support, categories, search, and offline sync. Use a clean dark theme.',
    features: ['Markdown editor', 'Categories & tags', 'Full-text search', 'Offline-first', 'Dark mode'],
  },
  {
    icon: '🏋️',
    name: 'Workout Tracker',
    prompt: 'Create a PWA workout tracker where I can log exercises with sets, reps, and weight. Include a weekly calendar view and progress charts.',
    features: ['Exercise logging', 'Weekly calendar', 'Progress charts', 'Custom routines', 'No account needed'],
  },
  {
    icon: '🧮',
    name: 'Budget Calculator',
    prompt: 'Make a PWA budget app with income/expense tracking, categories, monthly summaries, and pie charts. Everything stored locally, no server needed.',
    features: ['Income & expenses', 'Category breakdown', 'Monthly charts', 'CSV export', 'Privacy-first'],
  },
  {
    icon: '🎯',
    name: 'Habit Tracker',
    prompt: 'Build a PWA habit tracker with daily checkboxes, streak counting, and a heatmap calendar view. Make it colorful and motivating.',
    features: ['Daily habits', 'Streak counter', 'Heatmap calendar', 'Reminders', 'Installable PWA'],
  },
]

const FAQ = [
  { q: 'What is Claude Code?', a: 'Claude Code is an AI coding assistant by Anthropic that lives in your terminal. You describe what you want in plain English, and it writes production-ready code for you. No coding experience required.' },
  { q: 'Do I need to know how to code?', a: 'Not at all. Claude Code understands natural language. Just describe your app like you\'re talking to a developer — "I want a recipe app with search and favorites" — and it builds it.' },
  { q: 'What is a PWA?', a: 'A Progressive Web App (PWA) is a website that works like a native app. Users can install it on their phone or desktop, use it offline, and get a full-screen experience — no app store download needed.' },
  { q: 'Is Claude Code free?', a: 'Claude Code offers a free tier to get started. For larger projects, there are affordable plans. Visit claude.ai/code for current pricing.' },
  { q: 'How long does it take to build an app?', a: 'Simple apps take minutes. More complex apps with multiple screens might take an hour of back-and-forth. Either way, it\'s dramatically faster than traditional development.' },
  { q: 'Can I publish my app on SafeLaunch?', a: 'Yes! Once your PWA is deployed to a public URL, submit it to SafeLaunch. Our AI safety pipeline will scan it, and if it passes, it goes live in the store.' },
]

export default function Tutorial() {
  const [openFaq, setOpenFaq] = useState(null)
  const [copiedIdx, setCopiedIdx] = useState(null)

  function copyPrompt(text, idx) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <>
      <SEO
        title="Build a PWA App with Claude Code — Step-by-Step Tutorial"
        description="Learn how to create your own PWA app using Claude Code. No coding experience needed. From idea to published app in minutes."
        canonical="https://agentslock.com/tutorial"
      />
      <Nav />
      <div className="page-wrap">
        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.heroBadge}>Tutorial</span>
          <h1 className="display" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: 12 }}>
            Build Your Own App with <span style={{ color: 'var(--accent)' }}>Claude Code</span>
          </h1>
          <p className={styles.heroDesc}>
            No coding experience? No problem. Claude Code turns your ideas into real, installable apps.
            Follow this guide to go from zero to published PWA in minutes.
          </p>
          <div className={styles.heroActions}>
            <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Get Claude Code</a>
            <Link to="/publish" className="btn btn-ghost">Publish Your App</Link>
          </div>
        </div>

        {/* What you'll build */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What You'll Build</h2>
          <p className={styles.sectionDesc}>
            A real Progressive Web App (PWA) that users can install on their phone, use offline, and share with anyone — all without writing a single line of code yourself.
          </p>
          <div className={styles.featureGrid}>
            {[
              ['📱', 'Installable', 'Works like a native app on any device'],
              ['📡', 'Offline-First', 'Functions without internet connection'],
              ['🎨', 'Beautiful UI', 'Claude Code designs it for you'],
              ['🔒', 'Privacy-First', 'Data stays on the user\'s device'],
              ['⚡', 'Fast', 'Loads instantly, no app store needed'],
              ['🌍', 'Cross-Platform', 'One app for iOS, Android, and desktop'],
            ].map(([icon, title, desc]) => (
              <div key={title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{icon}</span>
                <strong>{title}</strong>
                <span className={styles.featureDesc}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>5 Simple Steps</h2>
          <p className={styles.sectionDesc}>From idea to published app — here's exactly how it works.</p>

          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepLeft}>
                  <div className={styles.stepNum}>{s.num}</div>
                  {i < STEPS.length - 1 && <div className={styles.stepLine} />}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepIcon}>{s.icon}</span>
                    <h3>{s.title}</h3>
                  </div>
                  <p className={styles.stepDesc}>{s.desc}</p>
                  {s.prompt && (
                    <div className={styles.promptBox}>
                      <div className={styles.promptLabel}>
                        <span>Example prompt</span>
                        <button className={styles.copyBtn} onClick={() => copyPrompt(s.prompt, i)}>
                          {copiedIdx === i ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <code className={styles.promptCode}>{s.prompt}</code>
                    </div>
                  )}
                  <div className={styles.tipBox}>
                    <strong>Tip:</strong> {s.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Apps */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>App Ideas to Get You Started</h2>
          <p className={styles.sectionDesc}>Copy any of these prompts and paste them into Claude Code. Each builds a complete, working PWA.</p>

          <div className={styles.examplesGrid}>
            {EXAMPLES.map((ex, i) => (
              <div key={ex.name} className={styles.exampleCard}>
                <div className={styles.exampleHeader}>
                  <span style={{ fontSize: '1.8rem' }}>{ex.icon}</span>
                  <h3>{ex.name}</h3>
                </div>
                <div className={styles.promptBox}>
                  <div className={styles.promptLabel}>
                    <span>Prompt</span>
                    <button className={styles.copyBtn} onClick={() => copyPrompt(ex.prompt, 100 + i)}>
                      {copiedIdx === 100 + i ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <code className={styles.promptCode}>{ex.prompt}</code>
                </div>
                <div className={styles.featureList}>
                  {ex.features.map(f => <span key={f} className={styles.featureChip}>{f}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {FAQ.map((f, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <span className={styles.faqArrow}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className={styles.faqA}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaSection}>
          <h2 className="display" style={{ fontSize: '1.8rem', marginBottom: 12 }}>Ready to Build Your First App?</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.95rem' }}>
            Open Claude Code, describe your idea, and watch it come to life. Then publish it here for the world to use.
          </p>
          <div className={styles.heroActions}>
            <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Start Building with Claude Code</a>
            <Link to="/store" className="btn btn-ghost">Browse Apps for Inspiration</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
