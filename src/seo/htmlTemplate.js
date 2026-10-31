// Builds crawlable HTML for search engines, social previews and AI crawlers
// that do not run JavaScript. Pure string functions — no DOM, no Node APIs —
// so the build script (src/seo/vitePluginSeo.js) and the serverless
// function (api/app-page.js) produce identical markup.
//
// index.html marks the replaceable regions:
//   <!--seo-head:start--> … <!--seo-head:end-->   (title, description, canonical, OG, JSON-LD)
//   <div id="root"></div>                          (static summary injected inside; React replaces it on mount)

import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from './site.js'

const HEAD_RE = /<!--seo-head:start-->[\s\S]*?<!--seo-head:end-->/
const ROOT_RE = /<div id="root">[\s\S]*?<\/div><!--root:end-->|<div id="root"><\/div>/

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** JSON for a <script type="application/ld+json"> block, safe against "</script>" injection. */
export function jsonLdScript(data) {
  if (!data) return ''
  const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  return `<script type="application/ld+json" data-seo-static>${json}</script>`
}

export function renderHead({ title, description, canonical, image = DEFAULT_OG_IMAGE, type = 'website', jsonLd, noindex = false }) {
  const t = escapeHtml(title)
  const d = escapeHtml(description)
  const c = escapeHtml(canonical)
  const i = escapeHtml(image)
  const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []
  return [
    '<!--seo-head:start-->',
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
    `<link rel="canonical" href="${c}" />`,
    `<meta property="og:type" content="${escapeHtml(type)}" />`,
    `<meta property="og:url" content="${c}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:image" content="${i}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:url" content="${c}" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${i}" />`,
    ...blocks.map(jsonLdScript),
    '<!--seo-head:end-->',
  ].join('\n  ')
}

/**
 * Static, visible text for crawlers. React's createRoot() clears #root on first
 * render, so users see the normal app; this is the same information the page shows.
 */
export function renderStatic({ h1, summary = [], links = [], breadcrumbs = [] }) {
  const crumbs = breadcrumbs.length
    ? `<nav aria-label="Breadcrumb"><ol style="list-style:none;padding:0;display:flex;gap:8px;flex-wrap:wrap;font-size:.85rem">${breadcrumbs
        .map(([href, label]) => `<li><a href="${escapeHtml(href)}" style="color:#00e5a0">${escapeHtml(label)}</a></li>`)
        .join('<li aria-hidden="true">›</li>')}</ol></nav>`
    : ''
  const paras = summary.map(p => `<p style="line-height:1.6;color:#c0c0d8">${escapeHtml(p)}</p>`).join('')
  const nav = [['/', 'Home'], ['/store', 'Store'], ...links]
    .filter((v, idx, arr) => arr.findIndex(x => x[0] === v[0]) === idx)
    .map(([href, label]) => `<li><a href="${escapeHtml(href)}" style="color:#00e5a0">${escapeHtml(label)}</a></li>`)
    .join('')
  return (
    '<div id="root"><div data-prerender style="max-width:760px;margin:0 auto;padding:32px 20px;font-family:system-ui,sans-serif;color:#e8e8f0;background:#0a0a0f">' +
    crumbs +
    `<h1 style="font-size:1.6rem;line-height:1.25">${escapeHtml(h1)}</h1>` +
    paras +
    `<ul style="padding-left:18px;line-height:1.9">${nav}</ul>` +
    '</div></div><!--root:end-->'
  )
}

/** Swap the head block and #root contents of a built index.html. Throws if markers are missing. */
export function applyToShell(shellHtml, headHtml, rootHtml) {
  if (!HEAD_RE.test(shellHtml)) throw new Error('applyToShell: <!--seo-head:start/end--> markers not found in index.html')
  if (!ROOT_RE.test(shellHtml)) throw new Error('applyToShell: <div id="root"> not found in index.html')
  return shellHtml.replace(HEAD_RE, headHtml).replace(ROOT_RE, rootHtml)
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    // /store reads ?q= and filters results (src/pages/Store.jsx)
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/store?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([path, name], idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name,
      item: `${SITE_URL}${path}`,
    })),
  }
}

/** Visible FAQ → FAQPage. Only call with Q&As that are rendered on the page. */
export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/**
 * SoftwareApplication for an app listing. Deliberately omits aggregateRating:
 * ratings are only added once they come from genuine, displayed user reviews.
 */
export function appJsonLd(app, canonical) {
  const isFree = !app.price || app.price === 'Free' || app.price === '0' || Number(app.price) === 0
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.longDesc || app.desc || '',
    url: canonical,
    applicationCategory: app.category || 'WebApplication',
    operatingSystem: 'Web, iOS, Android, Windows, macOS',
    offers: {
      '@type': 'Offer',
      price: isFree ? '0' : String(app.price).replace(/[^0-9.]/g, '') || '0',
      priceCurrency: 'USD',
    },
  }
  if (app.url) data.installUrl = app.url
  if (app.version) data.softwareVersion = String(app.version)
  if (app.developer) data.author = { '@type': 'Organization', name: app.developer }
  return data
}
