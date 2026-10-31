// Single source of truth for the public SafeLaunch origin.
// Shared by the React app (src/), the build script (scripts/) and API routes (api/).
// Live check (31 Oct 2026): pwa-app-store.com 308-redirects to www.pwa-app-store.com,
// so the www host is the canonical origin.

export const SITE_URL = 'https://www.pwa-app-store.com'
export const SITE_NAME = 'SafeLaunch'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/icons/og-image.png`

/** Build an absolute canonical URL for a path such as "/store". */
export function canonicalFor(path = '/') {
  const clean = String(path || '/').split('?')[0].split('#')[0]
  return `${SITE_URL}${clean.startsWith('/') ? clean : `/${clean}`}`
}

/** Rewrite any absolute URL (wrong host, apex host, etc.) onto SITE_URL, keeping the path. */
export function normalizeToSite(url) {
  if (!url) return url
  try {
    const u = new URL(url, SITE_URL)
    return `${SITE_URL}${u.pathname}${u.search}`
  } catch {
    return url
  }
}
