// GA4 conversion events + AI-assistant referral detection.
// Safe no-op when GA4 is not configured (GA4_MEASUREMENT_ID unset at build time):
// events are still pushed to window.dataLayer so a tag manager can pick them up later.
// Never throws — tracking must not break installs, sign-ups or checkout.

const AI_REFERRERS = [
  ['chatgpt.com', 'chatgpt'],
  ['chat.openai.com', 'chatgpt'],
  ['perplexity.ai', 'perplexity'],
  ['gemini.google.com', 'gemini'],
  ['bard.google.com', 'gemini'],
  ['copilot.microsoft.com', 'copilot'],
  ['bing.com/chat', 'copilot'],
  ['claude.ai', 'claude'],
  ['you.com', 'you'],
  ['phind.com', 'phind'],
  ['meta.ai', 'meta_ai'],
  ['grok.com', 'grok'],
  ['deepseek.com', 'deepseek'],
]

const SESSION_KEY = 'sl_ai_ref_logged'

/** Send a GA4 event. `params` must not contain personal data (no emails, names, IDs of people). */
export function trackEvent(name, params = {}) {
  try {
    if (typeof window === 'undefined') return
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params)
    } else {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: name, ...params })
    }
  } catch (e) {
    console.warn('[track] trackEvent failed', { name, error: e?.message })
  }
}

/** Returns e.g. "perplexity" when the visit came from an AI assistant, else null. */
export function detectAiSource(referrer = '', search = '') {
  try {
    const params = new URLSearchParams(search)
    const utmSource = (params.get('utm_source') || '').toLowerCase()
    const utmMedium = (params.get('utm_medium') || '').toLowerCase()
    if (utmMedium === 'ai_search' && utmSource) return utmSource
    const ref = String(referrer || '').toLowerCase()
    for (const [host, source] of AI_REFERRERS) {
      if (ref.includes(host)) return source
    }
    if (AI_REFERRERS.some(([, source]) => source === utmSource)) return utmSource
  } catch { /* ignore malformed input */ }
  return null
}

/** Fire once per browser session when the landing visit came from an AI assistant. */
export function trackAiReferral() {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return
    const source = detectAiSource(document.referrer, window.location.search)
    if (!source) return
    sessionStorage.setItem(SESSION_KEY, '1')
    trackEvent('ai_referral', { ai_source: source, landing_page: window.location.pathname })
  } catch (e) {
    console.warn('[track] trackAiReferral failed', e?.message)
  }
}
