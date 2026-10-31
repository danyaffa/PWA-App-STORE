// Vercel Serverless Function — serves /app/:id (rewritten here in vercel.json)
//
// Why: the store is a client-rendered SPA, so link previews (WhatsApp, X, Facebook,
// LinkedIn, Slack) and AI crawlers that do not run JavaScript saw the homepage title
// for every app. This returns the normal app shell with the app's own title,
// description, canonical, Open Graph tags, JSON-LD and a short visible summary.
// React then mounts exactly as before.
//
// Failure mode: any error → the unmodified shell is served, so the page still works.

import fs from 'node:fs'
import path from 'node:path'
import { getAdminDb } from './apps.js'
import { isListable } from './sitemap.js'
import { rateLimit } from './_lib/rateLimit.js'
import { APPS as DEMO_APPS } from '../src/utils/data.js'
import { canonicalFor } from '../src/seo/site.js'
import { applyToShell, renderHead, renderStatic, appJsonLd, breadcrumbJsonLd } from '../src/seo/htmlTemplate.js'

const APP_ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/
const SHELL_TTL_MS = 60_000
let shellCache = { html: null, at: 0 }

function readBundledShell() {
  // vercel.json → functions["api/app-page.js"].includeFiles ships dist/index.html with this function.
  for (const p of [path.join(process.cwd(), 'dist', 'index.html'), path.join(process.cwd(), 'index.html')]) {
    try {
      const html = fs.readFileSync(p, 'utf8')
      // Only a built shell (hashed /assets/ bundle) is usable; the source index.html points at /src/main.jsx.
      if (html.includes('<div id="root">') && html.includes('/assets/')) return html
    } catch { /* try next */ }
  }
  return null
}

async function fetchShell(req) {
  if (shellCache.html && Date.now() - shellCache.at < SHELL_TTL_MS) return shellCache.html
  const bundled = readBundledShell()
  if (bundled) {
    shellCache = { html: bundled, at: Date.now() }
    return bundled
  }
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0]
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const headers = { accept: 'text/html' }
  // Lets preview deployments with Vercel Deployment Protection fetch their own shell.
  if (req.headers.cookie) headers.cookie = req.headers.cookie
  if (req.headers['x-vercel-protection-bypass']) headers['x-vercel-protection-bypass'] = req.headers['x-vercel-protection-bypass']

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 5000)
  try {
    const r = await fetch(`${proto}://${host}/index.html`, { headers, signal: ctrl.signal })
    if (!r.ok) throw new Error(`shell fetch HTTP ${r.status}`)
    const html = await r.text()
    if (!html.includes('<div id="root">')) throw new Error('shell fetch returned unexpected HTML')
    if (!req.headers.cookie) shellCache = { html, at: Date.now() }
    return html
  } finally {
    clearTimeout(timer)
  }
}

async function findApp(id) {
  const { db, error } = getAdminDb()
  if (db) {
    const snap = await db.collection('apps').doc(id).get()
    if (snap.exists) return { app: { id: snap.id, ...snap.data() }, source: 'firestore' }
  } else {
    console.warn('[api/app-page] Firestore unavailable:', error)
  }
  const demo = DEMO_APPS.find(a => a.id === id)
  if (demo) return { app: demo, source: 'demo' }
  return { app: null, source: db ? 'not_found' : 'unknown' }
}

function genericHead(id, notFound) {
  return renderHead({
    title: notFound ? 'App not found — SafeLaunch' : 'App — SafeLaunch',
    description: 'Browse safe, verified PWAs with transparent trust scores on SafeLaunch.',
    canonical: id ? canonicalFor(`/app/${encodeURIComponent(id)}`) : canonicalFor('/store'),
    noindex: notFound,
  })
}

function send(res, status, html, cache) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', cache)
  return res.status(status).send(html)
}

export default async function handler(req, res) {
  if (!rateLimit(req, res, { name: 'app-page', limit: 120, windowMs: 60_000 })) return

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).send('Method not allowed')
  }

  const id = String(req.query.id || '')

  let shell
  try {
    shell = await fetchShell(req)
  } catch (e) {
    console.error('[api/app-page] fetchShell failed:', { id, error: e?.message })
    // Last resort: minimal page that still gets the visitor to the store.
    return send(
      res,
      503,
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1"><title>SafeLaunch</title></head>' +
        '<body style="font-family:system-ui,sans-serif;background:#0a0a0f;color:#e8e8f0;text-align:center;padding:48px 20px">' +
        '<h1>SafeLaunch is busy</h1><p>Please reload, or <a style="color:#00e5a0" href="/store">open the store</a>.</p></body></html>',
      'no-store'
    )
  }

  if (!APP_ID_RE.test(id)) {
    return send(
      res,
      404,
      applyToShell(shell, genericHead('', true), renderStatic({ h1: 'App not found', summary: [], links: [] })),
      'public, max-age=0, s-maxage=300'
    )
  }

  try {
    const { app, source } = await findApp(id)

    if (!app) {
      // Firestore answered "no such app" → real 404, noindex (React shows "App not found").
      // Firestore unreachable → 200, still indexable, so a database blip never de-indexes listings.
      const notFound = source === 'not_found'
      return send(
        res,
        notFound ? 404 : 200,
        applyToShell(shell, genericHead(id, notFound), renderStatic({ h1: notFound ? 'App not found' : 'SafeLaunch app', summary: [], links: [] })),
        'public, max-age=0, s-maxage=60'
      )
    }

    const canonical = canonicalFor(`/app/${app.id}`)
    const name = String(app.name || app.id).slice(0, 120)
    const desc = String(app.desc || app.longDesc || `${name} on SafeLaunch, the trusted PWA app store.`).slice(0, 300)
    const head = renderHead({
      title: `${name} — SafeLaunch`,
      description: desc,
      canonical,
      type: 'website',
      noindex: !isListable(app),
      jsonLd: [appJsonLd(app, canonical), breadcrumbJsonLd([['/', 'Home'], ['/store', 'Store'], [`/app/${app.id}`, name]])],
    })
    const summary = [desc]
    if (app.longDesc && app.longDesc !== desc) summary.push(String(app.longDesc).slice(0, 800))
    if (app.category) summary.push(`Category: ${app.category}. Price: ${app.price || 'Free'}.`)
    const body = renderStatic({
      h1: name,
      summary,
      links: [['/how-safety-works', 'How apps are checked']],
      breadcrumbs: [['/', 'Home'], ['/store', 'Store'], [`/app/${app.id}`, name]],
    })

    return send(res, 200, applyToShell(shell, head, body), 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400')
  } catch (e) {
    console.error('[api/app-page] render failed:', { id, error: e?.message })
    return send(res, 200, shell, 'no-store')
  }
}
