// Best-effort in-memory rate limiter for Vercel serverless functions.
// Limits are per warm instance (Vercel may run several), so this blocks bursts
// from a single IP rather than enforcing a global quota. Files under api/_lib
// are not exposed as routes.

const buckets = new Map()
const MAX_TRACKED_IPS = 5000

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim()
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

/**
 * Returns true if the request may proceed. On false, a 429 has already been sent.
 * @param {object} req
 * @param {object} res
 * @param {{ name: string, limit?: number, windowMs?: number }} opts
 */
export function rateLimit(req, res, { name, limit = 60, windowMs = 60_000 }) {
  const now = Date.now()
  const key = `${name}:${clientIp(req)}`
  let entry = buckets.get(key)

  if (!entry || now - entry.start >= windowMs) {
    entry = { start: now, count: 0 }
    if (buckets.size >= MAX_TRACKED_IPS) {
      // Drop the oldest entry so memory stays bounded.
      buckets.delete(buckets.keys().next().value)
    }
    buckets.set(key, entry)
  }

  entry.count += 1
  const remaining = Math.max(0, limit - entry.count)
  res.setHeader('X-RateLimit-Limit', String(limit))
  res.setHeader('X-RateLimit-Remaining', String(remaining))

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000)
    res.setHeader('Retry-After', String(retryAfter))
    res.status(429).send('Too many requests')
    return false
  }
  return true
}
