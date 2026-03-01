import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import AppCard from '../components/AppCard.jsx'
import SEO from '../components/SEO.jsx'
import { trackSearch } from '../lib/analytics.js'
import { APPS, CATEGORIES } from '../utils/data.js'
import { loadPublishedApps, getAppsStoreStatus } from '../lib/appsStore.js'
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
  if (String(str).toLowerCase().includes('m')) return Math.round(n * 1_000_000)
  if (String(str).toLowerCase().includes('k')) return Math.round(n * 1_000)
  return Number.isFinite(n) ? n : 0
}

export default function Store() {
  const { toast, ToastContainer } = useToast()
  const [baseApps, setBaseApps] = useState(APPS)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('ranking')
  const [showSections, setShowSections] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pq = params.get('q') || ''
    if (pq) {
      setQ(pq)
      setShowSections(false)
      trackSearch(pq)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const published = await loadPublishedApps()

        const status = getAppsStoreStatus()
        if (!status.firebaseEnabled) {
          toast('Firebase is not configured — published apps may only appear on THIS browser (not incognito/other devices).')
        } else if (status.lastRemoteError) {
          toast('Firebase error — showing local apps only. Check Vercel env vars.')
        }

        if (!mounted) return
        const merged = [...published, ...APPS]
        const seen = new Set()
        const deduped = merged.filter(a => {
          const id = a?.id
          if (!id) return false
          if (seen.has(id)) return false
          seen.add(id)
          return true
        })
        setBaseApps(deduped)
      } catch (e) {
        console.error(e)
        setBaseApps(APPS)
      }
    })()
    return () => { mounted = false }
  }, [])

  const BASE = [...baseApps]

  const filtered = BASE.filter(a => {
    const matchesQ = !q.trim() || `${a.name} ${a.desc} ${a.category}`.toLowerCase().includes(q.toLowerCase())
    const matchesCat = cat === 'All' || a.category === cat
    return matchesQ && matchesCat
  })

  const sorted = filtered.sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name)
    if (sort === 'popular') return parseInstalls(b.installs) - parseInstalls(a.installs)
    if (sort === 'newest') return (b.publishedAt || '').localeCompare(a.publishedAt || '')
    if (sort === 'safest') return (b.safetyScore || 0) - (a.safetyScore || 0)
    if (sort === 'top_rated') return (b.averageRating || 0) - (a.averageRating || 0)
    return (b.rankingScore || 0) - (a.rankingScore || 0)
  })

  const visible = sorted.slice(0, 24)

  const TRENDING = BASE.filter(a => (a.badges || []).includes('trending')).slice(0, 6)
  const NEW_APPS = BASE.filter(a => (a.badges || []).includes('new')).slice(0, 6)
  const VERIFIED = BASE.filter(a => (a.badges || []).includes('verified')).slice(0, 6)
  const RISING_FAST = BASE.filter(a => (a.badges || []).includes('rising')).slice(0, 6)

  return (
    <>
      <SEO title="Store — SafeLaunch" description="Browse safe, verified PWAs with transparent trust scores." canonical="https://pwa-app-store.com/store" />
      <Nav />
      <div className="page-wrap">
        <div className="section-label">Store</div>
        <h1 className="section-title display">Safe Apps. Fast Install.</h1>
        <p className="section-sub">Find safe, verified apps with transparent trust scores.</p>

        <div className={styles.filters}>
          <input
            className={styles.search}
            placeholder="Search apps..."
            value={q}
            onChange={e => { setQ(e.target.value); setShowSections(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { toast('Searching…'); trackSearch(q) } }}
          />

          <select className={styles.select} value={cat} onChange={e => { setCat(e.target.value); setShowSections(false) }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={styles.select} value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button className="btn btn-ghost" onClick={() => { setQ(''); setCat('All'); setSort('ranking'); setShowSections(true); toast('Reset.') }}>
            Reset
          </button>
        </div>

        {showSections && (
          <>
            <h2 className={styles.sectionTitle}>Trending</h2>
            <div className={styles.grid}>{TRENDING.map(a => <AppCard key={a.id} app={a} />)}</div>

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

        <h2 className={styles.sectionTitle}>Browse</h2>
        <div className={styles.grid}>
          {visible.map(a => <AppCard key={a.id} app={a} />)}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
