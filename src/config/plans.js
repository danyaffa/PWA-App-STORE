// ── PayPal Plan Constants ────────────────────────────────────────────────
// Single source of truth for plan IDs, prices, and features.
// Used by both Payment.jsx and Pricing.jsx.

/* ── Launch deal (first 100 users pay $2 one-time) ────────────────────── */
export const LAUNCH_DEAL = {
  price: 2,
  totalSlots: 100,
  claimed: 0, // TODO: wire to Firestore counter
  features: [
    'One-time $2 — no subscription needed',
    'Full 6-layer AI safety scan included',
    'Public trust report & verified badge',
    'Listed in the store permanently',
    'Upgrade to a plan anytime later',
  ],
}

/* ── Subscription plans (monthly billing only) ────────────────────────── */
export const PLANS = {
  'creator-lite': {
    name: 'Creator Lite',
    slug: 'creator-lite',
    price: 9,
    planId: 'P-3DN45660DX3919046NGUPOHA',
    trial: 14,
    desc: 'Perfect for indie devs shipping a single app.',
    cta: 'Start 14-Day Free Trial',
    featured: false,
    features: [
      { label: '1 published app', included: true },
      { label: '1 active version slot', included: true },
      { label: 'Full 6-layer safety scan', included: true },
      { label: 'Public trust report', included: true },
      { label: 'Dynamic sandbox (DAST)', included: false },
      { label: 'Continuous monitoring', included: false },
      { label: 'Priority review queue', included: false },
      { label: 'Team seats', included: false },
      { label: 'SLA / compliance reports', included: false },
    ],
  },
  'creator-pro': {
    name: 'Creator Pro',
    slug: 'creator-pro',
    price: 29,
    planId: 'P-2JS06822B95082352NGUPR5Q',
    trial: 14,
    desc: 'For studios shipping multiple apps with full pipeline access.',
    cta: 'Start 14-Day Free Trial',
    featured: true,
    features: [
      { label: 'Up to 5 published apps', included: true },
      { label: '3 active version slots / app', included: true },
      { label: 'Full 6-layer safety scan', included: true },
      { label: 'Public trust report', included: true },
      { label: 'Dynamic sandbox (DAST)', included: true },
      { label: 'Continuous monitoring', included: true },
      { label: 'Priority review queue', included: false },
      { label: 'Team seats', included: false },
      { label: 'SLA / compliance reports', included: false },
    ],
  },
  'business': {
    name: 'Business',
    slug: 'business',
    price: 99,
    planId: 'P-3J957709U19092246NGTH2PY',
    trial: 14,
    desc: 'For enterprises needing unlimited apps, team seats, and compliance.',
    cta: 'Start 14-Day Free Trial',
    featured: false,
    features: [
      { label: 'Up to 20 published apps', included: true },
      { label: 'Unlimited version slots', included: true },
      { label: 'Full 6-layer safety scan', included: true },
      { label: 'Public trust report', included: true },
      { label: 'Dynamic sandbox (DAST)', included: true },
      { label: 'Continuous monitoring', included: true },
      { label: 'Priority review queue', included: true },
      { label: 'Team seats (up to 20)', included: true },
      { label: 'SLA + compliance reports', included: true },
    ],
  },
}

// Array form for Pricing.jsx iteration
export const PLANS_LIST = Object.values(PLANS)
