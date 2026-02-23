import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import AppCard from '../components/AppCard.jsx'
import { APPS, CATEGORIES } from '../utils/data.js'
import { useToast } from '../hooks/useToast.jsx'
import styles from './Store.module.css'

export default function Store() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const { toast, ToastContainer } = useToast()

  const visible = APPS.filter(a =>
    (filter === 'All' || a.category === filter) &&
    (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
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
          <button className="btn btn-primary" onClick={() => toast('📲 Installing FocusFlow...')}>Install Free</button>
        </div>

        {/* Filters + search */}
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
          <input
            className={`input ${styles.search}`}
            type="search"
            placeholder="🔍 Search apps..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {visible.length === 0
          ? <div className={styles.empty}>No apps found. Try a different filter.</div>
          : <div className={styles.grid}>{visible.map(a => <AppCard key={a.id} app={a} />)}</div>
        }
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
