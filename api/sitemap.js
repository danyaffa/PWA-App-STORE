// Vercel Serverless Function — /sitemap.xml (rewritten here in vercel.json)
// Lists every public static route plus every app published through SafeLaunch (Firestore).
// If Firestore is unavailable the static routes are still returned (200), so the
// sitemap never breaks.
//
// Demo catalogue entries from src/utils/data.js are NOT listed: they show third-party
// apps with placeholder install/rating figures and need an owner decision first.

import { getAdminDb } from './apps.js'
import { rateLimit } from './_lib/rateLimit.js'
import { PUBLIC_ROUTES } from '../src/seo/routes.js'
import { SITE_URL } from '../src/seo/site.js'

const APP_ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/
const HIDDEN_STATUSES = new Set(['blocked', 'suspended', 'rejected', 'removed', 'draft', 'pending'])

function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function toIsoDate(value) {
  try {
    if (!value) return null
    if (typeof value === 'string') return new Date(value).toISOString().slice(0, 10)
    if (typeof value.toDate === 'function') return value.toDate().toISOString().slice(0, 10)
    if (typeof value._seconds === 'number') return new Date(value._seconds * 1000).toISOString().slice(0, 10)
  } catch { /* fall through */ }
  return null
}

export function isListable(app) {
  if (!app || !APP_ID_RE.test(String(app.id || ''))) return false
  if (app.trust === 'red') return false
  if (app.status && HIDDEN_STATUSES.has(String(app.status).toLowerCase())) return false
  if (app.blocked === true || app.suspended === true) return false
  return true
}

async function loadPublishedApps() {
  const { db, error } = getAdminDb()
  if (!db) {
    console.warn('[api/sitemap] Firestore unavailable, static routes only:', error)
    return []
  }
  const snap = await db.collection('apps').get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(isListable)
}

export default async function handler(req, res) {
  if (!rateLimit(req, res, { name: 'sitemap', limit: 30, windowMs: 60_000 })) return

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).send('Method not allowed')
  }

  let apps = []
  try {
    apps = await loadPublishedApps()
  } catch (e) {
    console.error('[api/sitemap] loadPublishedApps failed:', e?.message || e)
  }

  try {
    const urls = [
      ...PUBLIC_ROUTES.map(r => ({ loc: `${SITE_URL}${r.path}`, changefreq: r.changefreq, priority: r.priority })),
      ...apps.map(a => ({
        loc: `${SITE_URL}/app/${encodeURIComponent(a.id)}`,
        lastmod: toIsoDate(a.updatedAt) || toIsoDate(a.publishedAt) || toIsoDate(a.createdAt),
        changefreq: 'weekly',
        priority: '0.7',
      })),
    ]

    const body =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map(u =>
        '  <url>\n' +
        `    <loc>${xmlEscape(u.loc)}</loc>\n` +
        (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : '') +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        '  </url>'
      ).join('\n') +
      '\n</urlset>\n'

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).send(req.method === 'HEAD' ? '' : body)
  } catch (e) {
    console.error('[api/sitemap] render failed:', e?.message || e)
    return res.status(500).send('Sitemap temporarily unavailable')
  }
}
