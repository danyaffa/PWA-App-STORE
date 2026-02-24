// Auto-generate app descriptions from homepage content.
// In production this calls an LLM API. For now it uses heuristics.

/**
 * Summarize an app from its homepage URL or metadata.
 * @param {Object} opts
 * @param {string} opts.url - The app's homepage URL
 * @param {string} opts.title - Page title (from meta or crawl)
 * @param {string} opts.metaDescription - Meta description tag
 * @param {string[]} opts.headings - H1/H2 headings found on page
 * @returns {Object} Generated summary
 */
export function summarizeApp({ url, title, metaDescription, headings = [] }) {
  // Extract keywords from title and description
  const text = [title, metaDescription, ...headings].join(' ').toLowerCase()
  const keywords = extractKeywords(text)
  const category = classifyCategory(keywords)

  // Generate descriptions
  const shortDescription = metaDescription
    ? truncate(metaDescription, 120)
    : title
      ? `${title} — a web application you can install and use directly from your browser.`
      : 'A progressive web app available on SafeLaunch.'

  const longDescription = [
    metaDescription || `${title || 'This app'} is a progressive web app published on SafeLaunch.`,
    '',
    headings.length > 0
      ? `Key features include: ${headings.slice(0, 5).join(', ')}.`
      : '',
    '',
    'This app has been verified through SafeLaunch\'s 6-layer AI safety pipeline.',
    'Install it directly to your device — no app store download required.',
  ].filter(Boolean).join('\n')

  const installInstructions = [
    `1. Visit ${url || 'the app page'} on SafeLaunch.`,
    '2. Click the "Install" button.',
    '3. On iOS: use Safari → Share → Add to Home Screen.',
    '4. On Android/Desktop: follow the browser install prompt.',
  ].join('\n')

  return {
    shortDescription,
    longDescription,
    keywords,
    category,
    installInstructions,
    seoTitle: `${title || 'App'} — SafeLaunch PWA Store`,
    seoDescription: shortDescription,
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

const CATEGORY_MAP = {
  Productivity: ['task', 'todo', 'note', 'calendar', 'timer', 'focus', 'pomodoro', 'project', 'manage', 'organiz'],
  Finance:      ['money', 'budget', 'expense', 'invest', 'stock', 'crypto', 'bank', 'payment', 'finance', 'tax', 'calcul'],
  Health:       ['health', 'fitness', 'workout', 'exercise', 'diet', 'calorie', 'meditat', 'sleep', 'mental', 'wellbeing'],
  Entertainment:['game', 'music', 'video', 'stream', 'play', 'fun', 'quiz', 'trivia', 'entertain'],
  'Developer Tools': ['code', 'developer', 'api', 'debug', 'deploy', 'git', 'terminal', 'devtool', 'program'],
  Education:    ['learn', 'study', 'course', 'language', 'teach', 'educat', 'quiz', 'flash', 'vocab'],
}

function classifyCategory(keywords) {
  const text = keywords.join(' ')
  let best = 'Productivity'
  let bestScore = 0

  for (const [cat, terms] of Object.entries(CATEGORY_MAP)) {
    const score = terms.filter(t => text.includes(t)).length
    if (score > bestScore) {
      bestScore = score
      best = cat
    }
  }
  return best
}

function extractKeywords(text) {
  const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','and','but','or','nor','not','no','so','if','then','than','that','this','these','those','it','its','of','in','on','at','to','for','with','by','from','as','into','about','up','out','off','over','under','again','further','once'])
  const words = text
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w))

  const freq = {}
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w)
}

function truncate(str, max) {
  if (str.length <= max) return str
  return str.slice(0, max - 3).replace(/\s+\S*$/, '') + '...'
}
