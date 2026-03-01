/**
 * AI Policy Scan — Vercel Serverless Function
 * Analyzes app metadata and content for policy compliance.
 *
 * POST /api/security/policyScan
 * Body: { title, description, homepageText, category, screenshots[] }
 *
 * Classifies: adult, gambling, scam, copyright, impersonation,
 *             illegal services, financial fraud, malware intent
 *
 * Production: Send to AI model for classification.
 * Current: Keyword-based classification scaffold.
 */

const POLICY_RULES = [
  {
    category: 'adult',
    keywords: ['xxx', 'porn', 'nude', 'nsfw', 'adult content', 'explicit'],
    severity: 'high',
    penalty: 30,
  },
  {
    category: 'gambling',
    keywords: ['casino', 'bet now', 'gambling', 'slots', 'poker real money', 'sports betting'],
    severity: 'high',
    penalty: 25,
  },
  {
    category: 'scam',
    keywords: ['guaranteed profit', 'get rich quick', 'free money', 'no risk investment', 'double your', 'mlm'],
    severity: 'critical',
    penalty: 40,
  },
  {
    category: 'impersonation',
    keywords: ['official google', 'official apple', 'official microsoft', 'from facebook', 'meta official'],
    severity: 'critical',
    penalty: 40,
  },
  {
    category: 'financial_fraud',
    keywords: ['wire transfer', 'send money now', 'western union', 'gift card payment', 'crypto wallet recovery'],
    severity: 'critical',
    penalty: 50,
  },
  {
    category: 'malware_intent',
    keywords: ['hack tool', 'password cracker', 'ddos', 'rat tool', 'keylogger', 'phishing kit'],
    severity: 'critical',
    penalty: 50,
  },
  {
    category: 'illegal_services',
    keywords: ['fake id', 'counterfeit', 'illegal download', 'crack software', 'pirated'],
    severity: 'critical',
    penalty: 50,
  },
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body || {}
  const str = v => typeof v === 'string' ? v : ''
  const title = str(body.title)
  const description = str(body.description)
  const homepageText = str(body.homepageText)
  const category = str(body.category)
  const combined = `${title} ${description} ${homepageText} ${category}`.toLowerCase()

  const findings = []
  let totalPenalty = 0
  const riskCategories = []

  for (const rule of POLICY_RULES) {
    for (const keyword of rule.keywords) {
      if (combined.includes(keyword.toLowerCase())) {
        totalPenalty += rule.penalty
        riskCategories.push(rule.category)
        findings.push({
          type: 'policy',
          severity: rule.severity,
          category: rule.category,
          label: `Policy violation: "${keyword}" matched in ${rule.category}`,
        })
        break // One match per category is enough
      }
    }
  }

  const policyScore = Math.max(0, 100 - totalPenalty)
  const status = policyScore >= 80 ? 'pass' : policyScore >= 60 ? 'review' : 'fail'

  return res.status(200).json({
    policyScore,
    status,
    riskCategories: [...new Set(riskCategories)],
    findingsCount: findings.length,
    findings,
    scannedAt: new Date().toISOString(),
    note: 'Keyword-based scan. Upgrade to AI model for production accuracy.',
  })
}
