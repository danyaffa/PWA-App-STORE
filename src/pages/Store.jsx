import { useState, useEffect } from 'react' import Nav from '../components/Nav.jsx' import Footer from '../components/Footer.jsx' import AppCard from '../components/AppCard.jsx' import SEO from '../components/SEO.jsx' import { trackSearch } from '../lib/analytics.js' import { APPS, CATEGORIES } from '../utils/data.js' import { useToast } from '../hooks/useToast.js' import styles from './Store.module.css'
const SORT_OPTIONS = [ { value: 'ranking', label: 'StoreRank' }, { value: 'popular', label: 'Most Popular' }, { value: 'newest', label: 'Newest' }, { value: 'safest', label: 'Safest (Low Risk)' }, { value: 'top_rated', label: 'Top Rated' }, { value: 'name', label: 'A → Z' }, ]
function parseInstalls(str) { const n = parseFloat(str) if (String(str).toLowerCase().includes('k')) return n * 1000 if (String(str).toLowerCase().includes('m')) return n * 1_000_000 return n }
function sortApps(apps, sortBy) { const sorted = [...apps] switch (sortBy) { case 'ranking': return sorted.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0)) case 'popular': return sorted.sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs)) case 'newest': return sorted.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)) case 'safest': return sorted.sort((a, b) => (a.safetyScore || a.score || 0) - (b.safetyScore || b.score || 0)) case 'top_rated': return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)) case 'name': return sorted.sort((a, b) => a.name.localeCompare(b.name)) default: return sorted } }
function getPublishedApps() { try { return JSON.parse(localStorage.getItem('sl_published_apps') || '[]') } catch { return [] } }
export default function Store() { const [filter, setFilter] = useState('All') const [search, setSearch] = useState('') const [sort, setSort] = useState('ranking') const [userApps, setUserApps] = useState(getPublishedApps) const { ToastContainer } = useToast()
useEffect(() => { function onFocus() { setUserApps(getPublishedApps()) } window.addEventListener('focus', onFocus) return () => window.removeEventListener('focus', onFocus) }, [])
useEffect(() => { function onStorage(e) { if (e.key === 'sl_published_apps') setUserApps(getPublishedApps()) } window.addEventListener('storage', onStorage) return () => window.removeEventListener('storage', onStorage) }, [])
const allApps = [...APPS, ...userApps]
const TRENDING = [...allApps].sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0)).slice(0, 4) const TOP_RATED = [...allApps].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)).slice(0, 4) const NEW_APPS = [...allApps].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)).slice(0, 4) const VERIFIED = allApps.filter(a => (a.safetyScore || 0) >= 85).slice(0, 4) const RISING_FAST = [...allApps].sort((a, b) => (b.installVelocity || 0) - (a.installVelocity || 0)).slice(0, 4)
const filtered = allApps.filter(a => (filter === 'All' || a.category === filter) && (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase())) ) const visible = sortApps(filtered, sort)
function handleSearch(e) { const q = e.target.value setSearch(q) if (q.length >= 3) trackSearch(q) }
const showSections = !search && filter === 'All'
return ( <> <SEO title="Browse Apps — SafeLaunch PWA App Store" description="Browse and install AI-verified progressive web apps. Every app scanned for safety." canonical="https://pwa-app-store.com/store" /> <Nav /> <div className="page-wrap"> <div className="section-label">The SafeLaunch Store</div> <h1 className="section-title display">AI-Verified Apps.<br />Every Single One.</h1>
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
          <button
            className={styles.heroSearchClear}
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.heroFilters}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`${styles.filterBtn} ${filter === c ? styles.active : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        )
   }
      </div>
    </div>

    <div className={styles.sortRow}>
      <div className={styles.sortLabel}>Sort</div>
      <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div className={styles.sortCount}>{visible.length} apps</div>
    </div>

    {showSections && (
      <>
        <h2 className={styles.sectionTitle}>Trending Now</h2>
        <div className={styles.grid}>{TRENDING.map(a => <AppCard key={a.id} app={a} />)}</div>

        <h2 className={styles.sectionTitle}>Top Rated</h2>
        <div className={styles.grid}>{TOP_RATED.map(a => <AppCard key={a.id} app={a} />)}</div>

        <h2 className={styles.sectionTitle}>New & Updated</h2>
        <div className={styles.grid}>{NEW_APPS.map(a => <AppCard key={a.id} app={a} />)}</div>

        <h2 className={styles.sectionTitle}>Verified Safe</h2>
        <div className={styles.grid}>{VERIFIED.map(a => <AppCard key={a.id} app={a} />)}</div>

        <h2 className={styles.sectionTitle}>Rising Fast</h2>
        <div className={styles.grid}>{RISING_FAST.map(a => <AppCard key={a.id} app={a} />)}</div>
      </>
    )}

    {!showSections && (
      <>
        <h2 className={styles.sectionTitle}>Results</h2>
        <div className={styles.grid}>
          {visible.map(a => <AppCard key={a.id} app={a} />)}
        </div>
      </>
    )}
  </div>
  <Footer />
  <ToastContainer />
</>

) }
