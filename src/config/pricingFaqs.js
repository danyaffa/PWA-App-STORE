// Pricing page FAQs — shown on /pricing and mirrored into FAQPage JSON-LD.
// Edit here only; both the page and the structured data read this list.

export const PRICING_FAQS = [
  { q: 'Does SafeLaunch take a revenue cut?', a: 'No. SafeLaunch is subscription-only. We never touch your revenue, in-app purchases, or user payments. What you earn is 100% yours.' },
  { q: 'What happens if my app is blocked?', a: "You receive a full scan report detailing exactly what was found, why it matters, and how to fix it. Once fixed, you can resubmit for a free rescan." },
  { q: 'Is the 14-day trial really free?', a: 'Yes — no credit card required for the trial. You only pay if you decide to continue after 14 days.' },
  { q: 'Which frameworks are supported?', a: 'React, Vue, Svelte, SvelteKit, Next.js (static export), Astro, Angular, and vanilla HTML/JS/CSS. Auto-detected from your repo.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your dashboard or directly through PayPal. Your apps remain listed until the end of your billing period, then unpublish automatically.', link: '/cancel', linkLabel: 'See cancellation options →' },
  { q: 'Do users need accounts to install apps?', a: 'No. Store visitors can browse and install any app without signing up. Only developers need a SafeLaunch publisher account.' },
]
