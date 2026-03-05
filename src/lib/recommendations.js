/**
 * AI App Recommendation Engine
 *
 * Generates personalized "AI-picked" app sections for the homepage
 * and store. Uses category affinity, trust scores, and install signals
 * to surface relevant apps.
 *
 * This is the discovery engine that solves Pitfall #1:
 * "Where do I go to find apps?"
 */

/**
 * Get apps similar to the given app (by category + score proximity)
 */
export function getSimilarApps(app, allApps, limit = 4) {
  return allApps
    .filter(a => a.id !== app.id)
    .map(a => ({
      ...a,
      similarity: computeSimilarity(app, a),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

function computeSimilarity(source, target) {
  let score = 0
  // Same category = strong signal
  if (source.category === target.category) score += 40
  // Close safety score = trust alignment
  const safetyDiff = Math.abs((source.safetyScore || 0) - (target.safetyScore || 0))
  score += Math.max(0, 20 - safetyDiff)
  // High trust = bonus
  if ((target.safetyScore || 0) >= 85) score += 15
  // Good ratings
  if ((target.averageRating || 0) >= 4.0) score += 10
  // Matching tags
  const srcTags = new Set((source.tags || []).map(t => t.toLowerCase()))
  const tgtTags = (target.tags || []).map(t => t.toLowerCase())
  const tagOverlap = tgtTags.filter(t => srcTags.has(t)).length
  score += tagOverlap * 5
  return score
}

/**
 * Get "AI Picks" — highest trust + engagement apps
 * These are the apps SafeLaunch's AI would recommend to new users.
 */
export function getAIPicks(allApps, limit = 4) {
  return [...allApps]
    .map(a => ({
      ...a,
      aiScore: computeAIScore(a),
    }))
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, limit)
}

function computeAIScore(app) {
  let score = 0
  // Trust is the #1 signal (30%)
  score += (app.safetyScore || 0) * 0.3
  // Developer trust (20%)
  score += (app.developerTrust || 0) * 0.2
  // User satisfaction (25%)
  score += ((app.averageRating || 0) / 5) * 100 * 0.25
  // Engagement (15%)
  score += (app.rankingScore || 0) * 0.15
  // Freshness bonus (10%)
  if (app.publishedAt) {
    const days = (Date.now() - new Date(app.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(0, 10 - days * 0.1)
  }
  return Math.round(score)
}

/**
 * Get "Lightweight Apps" — small size, high safety
 */
export function getLightweightApps(allApps, limit = 4) {
  return allApps
    .filter(a => {
      const sizeStr = (a.size || '').toLowerCase()
      const mb = parseFloat(sizeStr)
      return !isNaN(mb) && mb <= 5
    })
    .sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0))
    .slice(0, limit)
}

/**
 * Get "Privacy Champions" — apps with no trackers, high safety
 */
export function getPrivacyChampions(allApps, limit = 4) {
  return allApps
    .filter(a => {
      const perms = (a.permissions || []).join(' ').toLowerCase()
      return (perms.includes('none') || perms.includes('offline') || perms.includes('no')) &&
        (a.safetyScore || 0) >= 80
    })
    .sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0))
    .slice(0, limit)
}

/**
 * Get installed app history from localStorage
 */
export function getInstalledCategories() {
  try {
    const installed = JSON.parse(localStorage.getItem('installedApps') || '[]')
    return installed
  } catch {
    return []
  }
}
