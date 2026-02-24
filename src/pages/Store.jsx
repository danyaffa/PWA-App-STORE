import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import AppCard from '../components/AppCard.jsx'
import SEO from '../components/SEO.jsx'
import { APPS, CATEGORIES } from '../utils/data.js'
import { useToast } from '../hooks/useToast.js'
import styles from './Store.module.css'

const SORT_OPTIONS = [
  { value: 'popular',  label: 'Most Popular' },
  { value: 'newest',   label: 'Newest' },
  { value: 'safest',   label: 'Safest (Low Risk)' },
  { value: 'name',     label: 'A → Z' },
]

function parseInstalls(str) {
  const n = parseFloat(str)
  if (str.includes('k')) return n * 1000
  return n
}

function sortApps(apps, sortBy) {
  const sorted = [...apps]
  switch (sortBy) {
    case 'popular': return sorted.sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs))
    case 'newest':  return sorted.reverse()
    case 'safest':  return sorted.sort((a, b) => a.score - b.score)
    case 'name':    return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:        return sorted
  }
}

// Derive sections from data
const TRENDING  = APPS.filter(a => parseInstalls(a.installs) >= 5000).slice(0, 4)
const NEW_APPS  = [...APPS].reverse().slice(0, 4)
const TOP_RATED = [...APPS].sort((a, b) => a.score - b.score).slice(0, 4)

export default function Store() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort]     = useState('popular')
  const { toast, ToastContainer } = useToast()

  const filtered = APPS.filter(a =>
    (filter === 'All' || a.category === filter) &&
    (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))
  )
  const visible = sortApps(filtered, sort)

  const showSections = !search && filter === 'All'

  return (
    <>
      <SEO
        title="Browse Apps — SafeLaunch PWA App Store"
        description="Browse and install AI-verified progressive web apps. Every app scanned for safety. Productivity, finance, health, developer tools, entertainment, and education."
        canonical="https://agentslock.com/store"
      />
      <Nav />
      <div className="page-wrap">
        <div className="section-label">The SafeLaunch Store</div>
        <h1 className="section-title display">AI-Verified Apps.<br />Every Single One.</h1>

        {/* Featured strip */}
        <div className={styles.featured}>
          <span className={styles.featuredEmoji}>✅</span>
          <div className={styles.featuredInfo}>
            <div className={styles.featuredLabel}>Featured App</div>
            <div className={styles.featuredName}>FocusFlow</div>
            <div className={styles.featuredDesc}>Pomodoro-powered task manager. Offline-first, no account needed. Risk score: 5/100.</div>
          </div>
          <Link to="/app/focusflow" className="btn btn-primary">View App</Link>
        </div>

        {/* Trending / New / Top Rated (only when not searching) */}
        {showSections && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Trending Now</h2>
              <div className={styles.scrollRow}>
                {TRENDING.map(a => <AppCard key={a.id} app={a} />)}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>New Arrivals</h2>
              <div className={styles.scrollRow}>
                {NEW_APPS.map(a => <AppCard key={a.id} app={a} />)}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Top Rated (Safest)</h2>
              <div className={styles.scrollRow}>
                {TOP_RATED.map(a => <AppCard key={a.id} app={a} />)}
              </div>
            </section>
          </>
        )}

        {/* Filters + search + sort */}
        <h2 className={styles.sectionTitle} style={{ marginTop: showSections ? 48 : 0 }}>All Apps</h2>
        <div className={styles.controls}>
          <div className={styles.filters}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`${styles.filterBtn} ${filter === c ? styles.active : ''}`}
                onClick={() => setFilter(c)}
              >{c}</button>
            ))}
          </div>
          <div className={styles.controlsRight}>
            <select className={`input ${styles.sortSelect}`} value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input
              className={`input ${styles.search}`}
              type="search"
              placeholder="Search apps..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {visible.length === 0
          ? <div className={styles.empty}>No apps found. Try a different filter or search term.</div>
          : <div className={styles.grid}>{visible.map(a => <AppCard key={a.id} app={a} />)}</div>
        }

        {/* Stats bar */}
        <div className={styles.storeStats}>
          <span>{APPS.length} verified apps</span>
          <span>6-layer AI safety scan</span>
          <span>Updated daily</span>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
