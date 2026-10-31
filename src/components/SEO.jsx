import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_NAME, DEFAULT_OG_IMAGE, canonicalFor, normalizeToSite } from '../seo/site.js'

export default function SEO({
  title       = 'SafeLaunch — Trusted PWA App Store',
  description = 'The trusted PWA app store with AI-powered safety scanning. Browse, publish, and install verified progressive web apps.',
  canonical,
  ogImage     = DEFAULT_OG_IMAGE,
  type        = 'website',
  jsonLd,
  noindex     = false,
}) {
  const location = useLocation()

  useEffect(() => {
    // Canonical always points at the real SafeLaunch origin, whatever host was passed in.
    const canonicalUrl = canonical ? normalizeToSite(canonical) : canonicalFor(location.pathname)
    const imageUrl = normalizeToSite(ogImage)

    // Pre-rendered JSON-LD (from src/seo/vitePluginSeo.js / api/app-page.js) is replaced
    // by this component's own jsonLd once React runs, so crawlers never see duplicates.
    document.querySelectorAll('script[data-seo-static]').forEach(el => el.remove())

    document.title = title

    setMeta('description', description)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', type, 'property')
    setMeta('og:url', canonicalUrl, 'property')
    setMeta('og:image', imageUrl, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:url', canonicalUrl)
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', imageUrl)

    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', canonicalUrl)

    if (jsonLd) {
      let script = document.getElementById('json-ld')
      if (!script) {
        script = document.createElement('script')
        script.id = 'json-ld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    }

    return () => {
      const existing = document.getElementById('json-ld')
      if (existing) existing.remove()
    }
  }, [title, description, canonical, ogImage, type, jsonLd, noindex, location.pathname])

  return null
}

function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
