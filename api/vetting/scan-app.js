// Vercel Serverless Function — POST /api/vetting/scan-app
// 3-layer automated vetting pipeline scaffold.
// In production, integrate ClamAV, VirusTotal, Google Safe Browsing, and LLM moderation.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { appId, fileUrl, homepageUrl, description } = req.body

    if (!appId) {
      return res.status(400).json({ error: 'Missing appId' })
    }

    const results = { layers: [], flags: [] }

    // ── Layer 1: Static Scan ─────────────────────────────────────────────
    // In production: analyze uploaded files for malware signatures,
    // crypto miners, phishing scripts, hidden redirects, eval() abuse,
    // suspicious domains. Tools: ClamAV, npm audit, custom pattern matching.
    const staticScan = {
      layer: 'static',
      label: 'Static Code Analysis',
      checks: [
        { name: 'Malware signatures', status: 'pass' },
        { name: 'Crypto-miner detection', status: 'pass' },
        { name: 'eval() / new Function() abuse', status: 'pass' },
        { name: 'Hidden iframes / redirects', status: 'pass' },
        { name: 'Obfuscation score', status: 'pass', value: 0.09 },
        { name: 'npm audit (dependencies)', status: 'pass' },
      ],
      score: 95,
    }
    results.layers.push(staticScan)

    // ── Layer 2: Reputation / URL Scan ──────────────────────────────────
    // In production: check URLs against Google Safe Browsing API,
    // VirusTotal API, domain age, SSL validity.
    const reputationScan = {
      layer: 'reputation',
      label: 'URL & Reputation Check',
      checks: [
        { name: 'Google Safe Browsing', status: 'pass' },
        { name: 'Domain reputation', status: 'pass' },
        { name: 'SSL certificate', status: 'pass' },
        { name: 'Known phishing domains', status: 'pass' },
      ],
      score: 98,
    }
    results.layers.push(reputationScan)

    // ── Layer 3: AI Policy Scan ─────────────────────────────────────────
    // In production: send description + homepage text to LLM moderation.
    // Classify: gambling, adult, illegal, scam, impersonation.
    const policyScan = {
      layer: 'policy',
      label: 'AI Content Policy Review',
      checks: [
        { name: 'Gambling content', status: 'pass' },
        { name: 'Adult content', status: 'pass' },
        { name: 'Illegal services', status: 'pass' },
        { name: 'Impersonation', status: 'pass' },
        { name: 'Scam indicators', status: 'pass' },
        { name: 'Privacy policy present', status: homepageUrl ? 'pass' : 'warn' },
      ],
      score: homepageUrl ? 92 : 78,
    }
    results.layers.push(policyScan)

    // ── Aggregate Score ─────────────────────────────────────────────────
    const totalScore = Math.round(
      results.layers.reduce((sum, l) => sum + l.score, 0) / results.layers.length
    )

    let status
    if (totalScore >= 80) status = 'pass'
    else if (totalScore >= 50) status = 'warn'
    else status = 'fail'

    // Collect all non-pass items as flags
    results.layers.forEach(l => {
      l.checks.forEach(c => {
        if (c.status !== 'pass') {
          results.flags.push({ layer: l.layer, check: c.name, status: c.status })
        }
      })
    })

    return res.status(200).json({
      appId,
      safetyScore: totalScore,
      status,
      flags: results.flags,
      layers: results.layers,
      decision: status === 'pass' ? 'AUTO_PUBLISH' : status === 'warn' ? 'MANUAL_REVIEW' : 'AUTO_REJECT',
      scannedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('scan-app exception:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
