import { useEffect } from 'react'

export default function SEO({
  title       = 'SafeLaunch — Trusted PWA App Store',
  description = 'The trusted PWA app store with AI-powered safety scanning. Browse, publish, and install verified progressive web apps.',
  canonical,
  ogImage     = '/icons/og-image.png',
  type        = 'website',
  jsonLd,
}) {
  useEffect(() => {
    document.title = title

    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', type, 'property')
    setMeta('og:image', ogImage, 'property')
    setMeta('og:site_name', 'SafeLaunch', 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }

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
  }, [title, description, canonical, ogImage, type, jsonLd])

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
