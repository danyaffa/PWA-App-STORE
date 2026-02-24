/**
 * Static Security Scan — Vercel Serverless Function
 * Scans submitted code for dangerous patterns.
 *
 * POST /api/security/staticScan
 * Body: { code: string, dependencies: string[], url: string }
 *
 * Checks:
 * - eval() usage
 * - obfuscated scripts
 * - crypto miners
 * - hidden redirects / iframe injections
 * - credential harvesting
 * - suspicious external domains
 */

const DANGEROUS_PATTERNS = [
  { pattern: /eval\s*\(/gi, risk: 20, label: 'eval() usage detected' },
  { pattern: /new\s+Function\s*\(/gi, risk: 15, label: 'Dynamic Function constructor' },
  { pattern: /document\.write/gi, risk: 10, label: 'document.write usage' },
  { pattern: /crypto\.?miner|coinhive|monero/gi, risk: 50, label: 'Crypto miner detected' },
  { pattern: /atob\s*\(\s*['"][A-Za-z0-9+/=]{50,}/gi, risk: 25, label: 'Obfuscated base64 payload' },
  { pattern: /window\.location\s*=\s*['"](https?:)?\/\//gi, risk: 15, label: 'Hidden redirect' },
  { pattern: /createElement\s*\(\s*['"]iframe/gi, risk: 20, label: 'Dynamic iframe injection' },
  { pattern: /\.credentials|password.*input|credit.?card/gi, risk: 15, label: 'Potential credential harvesting' },
  { pattern: /keylogger|keystroke|onkeypress.*capture/gi, risk: 40, label: 'Keylogger pattern' },
  { pattern: /navigator\.sendBeacon.*(?:\.ru|\.cn|\.tk)/gi, risk: 30, label: 'Data exfiltration to suspicious domain' },
]

const SUSPICIOUS_DOMAINS = [
  /\.tk\b/, /\.ml\b/, /\.ga\b/, /\.cf\b/, /\.gq\b/, // Free TLDs often used for phishing
  /bit\.ly|tinyurl|t\.co/, // URL shorteners in code
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code = '', dependencies = [], url = '' } = req.body || {}
  const findings = []
  let totalRisk = 0

  // 1. Pattern scanning
  for (const { pattern, risk, label } of DANGEROUS_PATTERNS) {
    const matches = code.match(pattern)
    if (matches) {
      totalRisk += risk
      findings.push({ type: 'pattern', severity: risk >= 30 ? 'critical' : risk >= 15 ? 'medium' : 'low', label, count: matches.length })
    }
  }

  // 2. Suspicious domain detection
  for (const domainPattern of SUSPICIOUS_DOMAINS) {
    if (domainPattern.test(code)) {
      totalRisk += 15
      findings.push({ type: 'domain', severity: 'medium', label: `Suspicious domain pattern: ${domainPattern.source}` })
    }
  }

  // 3. Dependency risk (placeholder — integrate npm audit / Snyk API)
  const riskyDeps = dependencies.filter(d =>
    /^(event-stream|flatmap-stream|ua-parser-js-hacked)$/i.test(d)
  )
  if (riskyDeps.length > 0) {
    totalRisk += 40
    findings.push({ type: 'dependency', severity: 'critical', label: `Known malicious dependencies: ${riskyDeps.join(', ')}` })
  }

  // 4. Obfuscation score (ratio of non-readable characters)
  const nonReadable = (code.match(/[^\x20-\x7E\n\r\t]/g) || []).length
  const obfuscationScore = code.length > 0 ? nonReadable / code.length : 0
  if (obfuscationScore > 0.3) {
    totalRisk += 20
    findings.push({ type: 'obfuscation', severity: 'medium', label: `High obfuscation score: ${obfuscationScore.toFixed(2)}` })
  }

  // 5. Google Safe Browsing check (placeholder — needs API key)
  if (url && process.env.GOOGLE_SAFE_BROWSING_KEY) {
    try {
      const safeBrowsingResp = await fetch('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + process.env.GOOGLE_SAFE_BROWSING_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'safelaunch', clientVersion: '1.0' },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
          },
        }),
      })
      const result = await safeBrowsingResp.json()
      if (result.matches && result.matches.length > 0) {
        totalRisk += 50
        findings.push({ type: 'safe_browsing', severity: 'critical', label: `Google Safe Browsing flagged: ${result.matches[0].threatType}` })
      }
    } catch {
      // Non-blocking
    }
  }

  const staticScore = Math.max(0, 100 - totalRisk)
  const status = staticScore >= 80 ? 'pass' : staticScore >= 60 ? 'review' : 'fail'

  return res.status(200).json({
    staticScore,
    status,
    totalRisk: Math.min(100, totalRisk),
    findingsCount: findings.length,
    findings,
    scannedAt: new Date().toISOString(),
  })
}
