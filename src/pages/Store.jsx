import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import AppCard from '../components/AppCard.jsx'
import SEO from '../components/SEO.jsx'
import { useToast } from '../hooks/useToast.js'
import { APPS } from '../utils/data.js'
import styles from './Store.module.css'
import { getPublishedApps } from '../lib/publish.js'

const FILTERS = [
  'All', 'Productivity', 'Finance', 'Health', 'Developer Tools', 'Entertainment',
  'Education', 'Games', 'Security', 'Business', 'Food & Cooking', 'Social',
  'Shopping', 'Travel', 'Music', 'Photography', 'Weather', 'News', 'Sports', 'Utilities', 'Communication', 'Lifestyle'
]

function sortApps(apps, by) {
  const arr = [...apps]
  if (by === 'ranking') arr.sort((a,b) => (b.safetyScore || 0) - (a.safetyScore || 0))
  if (by === 'installs') arr.sort((a,b) => {
    const na = Number(String(a.installs || '0').replace(/[^\d.]/g,'')) || 0
    const nb = Number(String(b.installs || '0').replace(/[^\d.]/g,'')) || 0
    return nb - na
  })
  if (by === 'rating') arr.sort((a,b) => (b.averageRating || 0) - (a.averageRating || 0))
  if (by === 'newest') arr.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0))
  return arr
}

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sort, setSort]     = useState('ranking')
  const [userApps, setUserApps] = useState(getPublishedApps)
  const { toast, ToastContainer } = useToast()

  // Sync query param
  useEffect(() => {
    const q = search.trim()
    if (q) setSearchParams({ q })
    else setSearchParams({})
  }, [search])

  // Load user published apps on mount
  useEffect(() => {
    setUserApps(getPublishedApps())
  }, [])

  // Merge built-in apps + user apps
  const ALL_APPS = [...APPS, ...userApps]

  // Curated sections (from built-in)
  const TRENDING = APPS.filter(a => (a.badges || []).includes('trending'))
  const TOP_RATED = APPS.filter(a => (a.badges || []).includes('top_rated'))
  const NEW_APPS = APPS.filter(a => (a.badges || []).includes('new'))
  const VERIFIED = APPS.filter(a => (a.badges || []).includes('verified'))
  const RISING_FAST = APPS.filter(a => (a.badges || []).includes('rising'))

  // Featured app: top trending
  const FEATURED = TRENDING[0]

  const visible = sortApps(
    ALL_APPS.filter(a => {
      const matchFilter = filter === 'All' || a.category === filter
      const q = search.toLowerCase()
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || (a.keywords || []).join(' ').toLowerCase().includes(q)
      return matchFilter && matchSearch
    }),
    sort
  )

  const showSections = !search && filter === 'All'

  return (
    <>
      <SEO
        title="Store — SafeLaunch"
        description="AI-verified apps. Every single one. Browse trending, top-rated, and verified-safe apps."
        canonical="https://agentslock.com/store"
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 1200 }}>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.14em' }}>THE SAFELAUNCH STORE</div>
              <h1 className="display" style={{ margin: '6px 0 0' }}>AI-Verified Apps.<br />Every Single One.</h1>
            </div>
          </div>
        </div>

        {/* Hero Search */}
        <div className={styles.heroSearch}>
          <div className={styles.heroSearchInner}>
            <span className={styles.heroSearchIcon}>🔎</span>
            <input
              className={styles.heroSearchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by app name, category, or keyword..."
            />
            {search && (
              <button className={styles.heroSearchClear} onClick={() => setSearch('')} aria-label="Clear search">✕</button>
            )}
          </div>

          <div className={styles.heroFilters}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Featured App */}
        {FEATURED && (
          <div className={styles.featured}>
            <div className={styles.featuredTop}>
              <span className={styles.featuredEmoji}>{FEATURED.icon}</span>
              <div className={styles.featuredInfo}>
                <div className={styles.featuredLabel}>Featured App</div>
                <div className={styles.featuredName}>{FEATURED.name}</div>
                <div className={styles.featuredDesc}>
                  {FEATURED.desc}
                  {FEATURED.developer && <span style={{ display: 'block', marginTop: 4, fontSize: '0.82rem' }}>by {FEATURED.developer}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {FEATURED.url && (
                  <a href={FEATURED.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Open App</a>
                )}
                <Link to={`/app/${FEATURED.id}`} className="btn btn-primary">View App</Link>
              </div>
            </div>

            {Array.isArray(FEATURED.screenshots) && FEATURED.screenshots.length > 0 && (
              <div className={styles.featuredFeatures}>
                {FEATURED.screenshots.slice(0, 4).map((s, idx) => (
                  <div key={idx} className={styles.featureTile} style={{ background: s.color || 'var(--surface2)' }}>
                    <div className={styles.featureTitle}>{s.title}</div>
                    <div className={styles.featureCaption}>{s.caption}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Curated Sections */}
        {showSections && (
          <>
            {!!TRENDING.length && (
              <section className={styles.section}>
                <div className={styles.sectionTitle}>Trending Now</div>
                <div className={styles.scrollRow}>
                  {TRENDING.map(a => <AppCard key={a.id} app={a} />)}
                </div>
              </section>
            )}

            {!!TOP_RATED.length && (
              <section className={styles.section}>
                <div className={styles.sectionTitle}>Top Rated</div>
                <div className={styles.scrollRow}>
                  {TOP_RATED.map(a => <AppCard key={a.id} app={a} />)}
                </div>
              </section>
            )}

            {!!NEW_APPS.length && (
              <section className={styles.section}>
                <div className={styles.sectionTitle}>New & Noteworthy</div>
                <div className={styles.scrollRow}>
                  {NEW_APPS.map(a => <AppCard key={a.id} app={a} />)}
                </div>
              </section>
            )}

            {!!VERIFIED.length && (
              <section className={styles.section}>
                <div className={styles.sectionTitle}>Verified Safe</div>
                <div className={styles.scrollRow}>
                  {VERIFIED.map(a => <AppCard key={a.id} app={a} />)}
                </div>
              </section>
            )}

            {!!RISING_FAST.length && (
              <section className={styles.section}>
                <div className={styles.sectionTitle}>Rising Fast</div>
                <div className={styles.scrollRow}>
                  {RISING_FAST.map(a => <AppCard key={a.id} app={a} />)}
                </div>
              </section>
            )}
          </>
        )}

        {/* All Apps */}
        <div className={styles.allAppsHeader}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{showSections ? 'All Apps' : 'Results'}</h2>
          <select className={`select ${styles.sortSelect}`} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="ranking">Sort: Safety score</option>
            <option value="installs">Sort: Installs</option>
            <option value="rating">Sort: Rating</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>

        {visible.length === 0
          ? <div className={styles.empty}>No apps found. Try a different search.</div>
          : <div className={styles.grid}>{visible.map(a => <AppCard key={a.id} app={a} />)}</div>
        }

        <div className={styles.storeStats}>
          <div>{ALL_APPS.length} apps</div>
          <div>{VERIFIED.length} verified</div>
          <div>AI scanned weekly</div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
