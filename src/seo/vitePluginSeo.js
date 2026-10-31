// Vite plugin: makes the SPA visible to search engines, social previews and AI crawlers.
//   1. transformIndexHtml → injects optional Search Console / Bing verification and GA4,
//      plus the homepage head + crawlable summary into index.html.
//   2. closeBundle        → writes dist/<route>/index.html for every public route with
//      its own title, description, canonical, Open Graph, JSON-LD and visible summary.
//
// Env vars (all optional, read at build time — set in Vercel → Settings → Environment Variables):
//   GA4_MEASUREMENT_ID       e.g. G-ABC123XYZ
//   GOOGLE_SITE_VERIFICATION Search Console "HTML tag" content value
//   BING_SITE_VERIFICATION   Bing Webmaster "msvalidate.01" content value

import fs from 'node:fs'
import path from 'node:path'
import { loadEnv } from 'vite'
import { PUBLIC_ROUTES } from './routes.js'
import { PRICING_FAQS } from '../config/pricingFaqs.js'
import { canonicalFor } from './site.js'
import {
  applyToShell, renderHead, renderStatic,
  organizationJsonLd, websiteJsonLd, breadcrumbJsonLd, faqJsonLd,
} from './htmlTemplate.js'

const TOKEN_RE = /^[A-Za-z0-9_-]{8,120}$/
const GA4_RE = /^G-[A-Z0-9]{4,20}$/

function routeJsonLd(route) {
  if (route.path === '/') return [organizationJsonLd(), websiteJsonLd()]
  const blocks = [breadcrumbJsonLd([['/', 'Home'], [route.path, route.crumb || route.h1]])]
  if (route.path === '/pricing') blocks.push(faqJsonLd(PRICING_FAQS))
  return blocks
}

function routeHtml(route) {
  const head = renderHead({
    title: route.title,
    description: route.description,
    canonical: canonicalFor(route.path),
    jsonLd: routeJsonLd(route),
  })
  const body = renderStatic({
    h1: route.h1,
    summary: route.summary || [route.description],
    links: route.links || [],
    breadcrumbs: route.path === '/' ? [] : [['/', 'Home'], [route.path, route.crumb || route.h1]],
  })
  return { head, body }
}

function verificationTags(env) {
  const tags = []
  const g = (env.GOOGLE_SITE_VERIFICATION || '').trim()
  const b = (env.BING_SITE_VERIFICATION || '').trim()
  if (g) {
    if (TOKEN_RE.test(g)) tags.push(`<meta name="google-site-verification" content="${g}" />`)
    else console.warn('[seo] GOOGLE_SITE_VERIFICATION ignored — unexpected format')
  }
  if (b) {
    if (TOKEN_RE.test(b)) tags.push(`<meta name="msvalidate.01" content="${b}" />`)
    else console.warn('[seo] BING_SITE_VERIFICATION ignored — unexpected format')
  }
  return tags
}

function ga4Tags(env) {
  const id = (env.GA4_MEASUREMENT_ID || '').trim()
  if (!id) return []
  if (!GA4_RE.test(id)) {
    console.warn('[seo] GA4_MEASUREMENT_ID ignored — expected format G-XXXXXXX')
    return []
  }
  return [
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`,
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');</script>`,
  ]
}

export default function seoPlugin() {
  let env = {}
  let outDir = 'dist'
  let isBuild = false

  return {
    name: 'safelaunch-seo',
    configResolved(config) {
      env = loadEnv(config.mode, config.root, '')
      outDir = path.resolve(config.root, config.build.outDir)
      isBuild = config.command === 'build'
    },
    transformIndexHtml(html) {
      const extra = [...verificationTags(env), ...ga4Tags(env)]
      let out = extra.length ? html.replace('<!--seo-head:start-->', `${extra.join('\n  ')}\n  <!--seo-head:start-->`) : html
      if (isBuild) {
        const home = PUBLIC_ROUTES.find(r => r.path === '/')
        const { head, body } = routeHtml(home)
        out = applyToShell(out, head, body)
      }
      return out
    },
    closeBundle() {
      if (!isBuild) return
      const shellPath = path.join(outDir, 'index.html')
      if (!fs.existsSync(shellPath)) {
        console.warn('[seo] dist/index.html missing — skipped per-route pages')
        return
      }
      const shell = fs.readFileSync(shellPath, 'utf8')
      let written = 0
      for (const route of PUBLIC_ROUTES) {
        if (route.path === '/') continue
        const { head, body } = routeHtml(route)
        const file = path.join(outDir, route.path.replace(/^\//, ''), 'index.html')
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, applyToShell(shell, head, body))
        written += 1
      }
      console.log(`[seo] wrote ${written} pre-rendered route pages`)
    },
  }
}
