/**
 * StoreRank Engine
 * Computes ranking scores similar to Google Play / Apple App Store.
 *
 * StoreRank (0–100) =
 *   25% Install Velocity
 * + 20% Retention
 * + 15% Rating Score
 * + 15% Safety Score
 * + 10% Engagement
 * + 10% Freshness
 * +  5% Developer Trust
 */

const WEIGHTS = {
  installVelocity: 0.25,
  retention:       0.20,
  ratingScore:     0.15,
  safetyScore:     0.15,
  engagement:      0.10,
  freshness:       0.10,
  developerTrust:  0.05,
}

/**
 * Compute install velocity (0–100).
 * velocity = installs_last_24h / avg_installs_last_7_days
 * Normalized: 1.0x = 50, 2.0x = 75, 3.0x+ = 100
 */
export function computeInstallVelocity(installsLast24h, avgInstalls7d) {
  if (avgInstalls7d <= 0) return installsLast24h > 0 ? 100 : 0
  const ratio = installsLast24h / avgInstalls7d
  return Math.min(100, Math.round(ratio * 50))
}

/**
 * Retention score (0–100).
 * retention = returningUsers / totalInstalls * 100
 */
export function computeRetention(returningUsers, totalInstalls) {
  if (totalInstalls <= 0) return 0
  return Math.min(100, Math.round((returningUsers / totalInstalls) * 100))
}

/**
 * Rating quality (0–100).
 * ratingScore = averageRating * log(totalReviews + 1) normalized to 100
 * Max: 5 * log(1001) = ~15 → normalized
 */
export function computeRatingScore(averageRating, totalReviews) {
  if (totalReviews <= 0) return 0
  const raw = averageRating * Math.log10(totalReviews + 1)
  const maxPossible = 5 * Math.log10(1001)
  return Math.min(100, Math.round((raw / maxPossible) * 100))
}

/**
 * Safety boost (0–100).
 * Inverted: low risk score = high safety boost
 */
export function computeSafetyBoost(riskScore) {
  return Math.max(0, 100 - riskScore)
}

/**
 * Engagement score (0–100).
 * engagement = (installClicks / impressions) * 100
 */
export function computeEngagement(installClicks, impressions) {
  if (impressions <= 0) return 0
  return Math.min(100, Math.round((installClicks / impressions) * 100))
}

/**
 * Freshness (0–100).
 * Decays over time: 100 for today, ~50 at 7 days, ~25 at 30 days
 */
export function computeFreshness(publishedDate) {
  const daysSince = Math.max(0, (Date.now() - new Date(publishedDate).getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, Math.round(100 * Math.exp(-0.1 * daysSince)))
}

/**
 * Combined StoreRank score (0–100)
 */
export function computeStoreRank({
  installVelocity = 0,
  retention = 0,
  ratingScore = 0,
  safetyScore = 0,
  engagement = 0,
  freshness = 0,
  developerTrust = 0,
}) {
  return Math.round(
    WEIGHTS.installVelocity * installVelocity +
    WEIGHTS.retention       * retention +
    WEIGHTS.ratingScore     * ratingScore +
    WEIGHTS.safetyScore     * safetyScore +
    WEIGHTS.engagement      * engagement +
    WEIGHTS.freshness       * freshness +
    WEIGHTS.developerTrust  * developerTrust
  )
}

/**
 * Auto-decision based on safety score
 */
export function getPublishDecision(safetyScore) {
  if (safetyScore >= 80) return { action: 'auto_publish', label: 'Auto Publish' }
  if (safetyScore >= 60) return { action: 'limited', label: 'Publish Limited' }
  return { action: 'reject', label: 'Auto Reject' }
}

/**
 * Detect abuse: install spikes, rating spam
 */
export function detectAbuse({ installsLast24h, avgInstalls7d, ratingsLast24h }) {
  const flags = []
  if (avgInstalls7d > 0 && installsLast24h > avgInstalls7d * 10) {
    flags.push({ type: 'install_spike', penalty: -20, reason: 'Suspicious install spike detected' })
  }
  if (ratingsLast24h > 20) {
    flags.push({ type: 'rating_spam', penalty: -15, reason: 'Unusual rating volume' })
  }
  return flags
}

/**
 * Get badge for app based on ranking signals
 */
export function getAppBadges(app) {
  const badges = []
  if (app.rankingScore >= 75) badges.push({ type: 'trending', label: 'Trending', icon: '🔥' })
  if (app.safetyScore >= 85) badges.push({ type: 'verified', label: 'Verified Safe', icon: '🛡' })
  if (app.averageRating >= 4.5 && app.totalReviews >= 3) badges.push({ type: 'top_rated', label: 'Top Rated', icon: '⭐' })
  if (app.freshness >= 70) badges.push({ type: 'new', label: 'New', icon: '🚀' })
  if (app.installVelocity >= 80) badges.push({ type: 'rising', label: 'Rising Fast', icon: '📈' })
  return badges
}
