import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import AppCard from '../components/AppCard.jsx'
import SEO from '../components/SEO.jsx'
import { trackSearch } from '../lib/analytics.js'
import { APPS, CATEGORIES } from '../utils/data.js'
import { useToast } from '../hooks/useToast.js'
import styles from './Store.module.css'

const SORT_OPTIONS = [
  { value: 'ranking',   label: 'StoreRank' },
  { value: 'popular',   label: 'Most Popular' },
  { value: 'newest',    label: 'Newest' },
  { value: 'safest',    label: 'Safest (Low Risk)' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'name',      label: 'A → Z' },
]

function parseInstalls(str) {
  const n = parseFloat(str)
  if (str.includes('k')) return n * 1000
  return n
}

function sortApps(apps, sortBy) {
  const sorted = [...apps]
  switch (sortBy) {
    case 'ranking':   return sorted.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0))
    case 'popular':   return sorted.sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs))
    case 'newest':    return sorted.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    case 'safest':    return sorted.sort((a, b) => a.score - b.score)
    case 'top_rated': return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    case 'name':      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:          return sorted
  }
}

function getPublishedApps() {
  try {
    return JSON.parse(localStorage.getItem('sl_published_apps') || '[]')
  } catch { return [] }
}

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sort, setSort]     = useState('ranking')
  const [userApps, setUserApps] = useState(getPublishedApps)
  const { toast, ToastContainer } = useToast()

  // Refresh user-published apps when tab becomes visible (e.g. after publishing)
  useEffect(() => {
    function onFocus() { setUserApps(getPublishedApps()) }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  // Also refresh on mount and storage changes
  useEffect(() => {
    function onStorage(e) { if (e.key === 'sl_published_apps') setUserApps(getPublishedApps()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Merge hardcoded sample apps with user-published apps
  const allApps = [...APPS, ...userApps]

  // Algorithm-driven sections
  const TRENDING    = [...allApps].sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0)).slice(0, 4)
  const TOP_RATED   = [...allApps].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)).slice(0, 4)
  const NEW_APPS    = [...allApps].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)).slice(0, 4)
  const VERIFIED    = allApps.filter(a => (a.safetyScore || 0) >= 85).slice(0, 4)
  const RISING_FAST = [...allApps].sort((a, b) => (b.installVelocity || 0) - (a.installVelocity || 0)).slice(0, 4)
  const FEATURED    = TRENDING[0]

  // Sync search from URL query param (e.g. /store?q=focus)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q !== search) setSearch(q)
  }, [searchParams])

  const filtered = allApps.filter(a =>
    (filter === 'All' || a.category === filter) &&
    (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))
  )
  const visible = sortApps(filtered, sort)

  function handleSearch(e) {
    const q = e.target.value
    setSearch(q)
    if (q.length >= 3) trackSearch(q)
  }

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

        {/* Hero search bar — always visible at top */}
        <div className={styles.heroSearch}>
          <div className={styles.heroSearchInner}>
            <span className={styles.heroSearchIcon}>🔍</span>
            <input
              className={styles.heroSearchInput}
              type="search"
              placeholder="Search by app name, category, or keyword..."
              value={search}
              onChange={handleSearch}
            />
            {search && (
              <button className={styles.heroSearchClear} onClick={() => setSearch('')} aria-label="Clear search">✕</button>
            )}
          </div>
          <div className={styles.heroFilters}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`${styles.filterBtn} ${filter === c ? styles.active : ''}`}
                onClick={() => setFilter(c)}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* Featured strip — algorithm selected */}
        {showSections && FEATURED && (
          <div className={styles.featured}>
            <span className={styles.featuredEmoji}>{FEATURED.icon}</span>
            <div className={styles.featuredInfo}>
              <div className={styles.featuredLabel}>Featured App</div>
              <div className={styles.featuredName}>{FEATURED.name}</div>
              <div className={styles.featuredDesc}>{FEATURED.desc} Safety: {FEATURED.safetyScore}/100 · {FEATURED.averageRating} stars · {FEATURED.installs} installs</div>
            </div>
            <Link to={`/app/${FEATURED.id}`} className="btn btn-primary">View App</Link>
          </div>
        )}

        {/* Algorithm-driven sections (only when not searching) */}
        {showSections && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Trending Now</h2>
              <div className={styles.scrollRow}>
                {TRENDING.map(a => <AppCard key={a.id} app={a} />)}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Top Rated</h2>
              <div className={styles.scrollRow}>
                {TOP_RATED.map(a => <AppCard key={a.id} app={a} />)}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>New Apps</h2>
              <div className={styles.scrollRow}>
                {NEW_APPS.map(a => <AppCard key={a.id} app={a} />)}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Verified Safe</h2>
              <div className={styles.scrollRow}>
                {VERIFIED.map(a => <AppCard key={a.id} app={a} />)}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Rising Fast</h2>
              <div className={styles.scrollRow}>
                {RISING_FAST.map(a => <AppCard key={a.id} app={a} />)}
              </div>
            </section>
          </>
        )}

        {/* All Apps heading + sort */}
        <div className={styles.allAppsHeader}>
          <h2 className={styles.sectionTitle} style={{ margin: 0 }}>{search || filter !== 'All' ? `Results${search ? ` for "${search}"` : ''}${filter !== 'All' ? ` in ${filter}` : ''}` : 'All Apps'}</h2>
          <select className={`input ${styles.sortSelect}`} value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {visible.length === 0
          ? <div className={styles.empty}>No apps found. Try a different filter or search term.</div>
          : <div className={styles.grid}>{visible.map(a => <AppCard key={a.id} app={a} />)}</div>
        }

        {/* Stats bar */}
        <div className={styles.storeStats}>
          <span>{allApps.length} verified apps</span>
          <span>6-layer AI safety scan</span>
          <span>Algorithm-ranked daily</span>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
