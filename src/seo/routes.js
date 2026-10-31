// Public, indexable routes and their search/AI-crawler metadata.
// Used by:
//   - src/seo/vitePluginSeo.js  → writes dist/<route>/index.html with correct <head> + crawlable text
//   - api/sitemap.js             → builds /sitemap.xml
// Every sentence below is taken from (or summarises) copy already shown on the live page.
// Do not add claims here that the page itself does not make.

export const PUBLIC_ROUTES = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
    title: 'SafeLaunch — Trusted PWA App Store | AI-Verified Web Apps',
    description: 'SafeLaunch is the trusted PWA app store with AI-powered safety scanning. Browse, publish, and install verified progressive web apps with confidence.',
    h1: 'SafeLaunch — Trusted PWA App Store',
    summary: [
      'SafeLaunch is a progressive web app (PWA) store. Visitors browse and install web apps without creating an account; developers publish their PWA from a ZIP, a GitHub repo or a URL.',
      'Every submission runs through a 6-layer safety pipeline — static code scan, dependency and CVE check, sandboxed behaviour test, AI policy review, publisher reputation and Google Safe Browsing — and each listed app carries a public trust report.',
      'Publishing plans start from $9/month with no revenue cut.',
    ],
    links: [
      ['/store', 'Browse the store'],
      ['/how-safety-works', 'How safety works'],
      ['/pricing', 'Pricing'],
      ['/tutorial', 'Build and publish a PWA'],
    ],
  },
  {
    path: '/store',
    changefreq: 'daily',
    priority: '0.9',
    title: 'Store — SafeLaunch',
    description: 'Browse safe, verified PWAs with transparent trust scores.',
    h1: 'Safe Apps. Fast Install.',
    crumb: 'Store',
    summary: [
      'Find safe, verified progressive web apps with transparent trust scores. Filter by category, open any app to read its safety report, permissions and privacy details, then install it straight from your browser — no account needed.',
    ],
    links: [
      ['/app-store', 'How to install a PWA'],
      ['/how-safety-works', 'How apps are checked'],
    ],
  },
  {
    path: '/how-safety-works',
    changefreq: 'monthly',
    priority: '0.8',
    title: 'How Safety Works — SafeLaunch',
    description: 'Learn how SafeLaunch protects users with a 6-layer automated security scanning pipeline, continuous monitoring, and instant takedown capabilities.',
    h1: 'How We Keep You Safe',
    crumb: 'How Safety Works',
    summary: [
      'Every developer must verify their email, accept the Developer Agreement and self-certify that their apps comply with SafeLaunch policies.',
      'Submitted code is scanned for dangerous patterns such as eval() abuse, crypto miners, hidden iframes, credential harvesting and obfuscated payloads. Dependencies are inventoried into an SBOM and checked against CVE databases.',
      'Apps are loaded in an isolated headless browser to watch for unexpected redirects, popup spam, permission abuse and tracking scripts. Metadata is reviewed by AI for scams, impersonation and illegal services, and URLs are validated against Google Safe Browsing.',
      'All results are combined into a single 0–100 risk score. Published apps are re-scanned daily, and users can report apps for malware, scams or copyright violations.',
    ],
    links: [
      ['/safety', 'The 6-layer pipeline'],
      ['/store', 'Browse verified apps'],
    ],
  },
  {
    path: '/safety',
    changefreq: 'monthly',
    priority: '0.7',
    title: 'AI Safety Pipeline — SafeLaunch',
    description: "Learn how SafeLaunch's 6-layer AI safety pipeline scans every app for malware, CVEs, secrets, network behavior, and policy compliance.",
    h1: 'The 6-Layer AI Safety Pipeline',
    summary: [
      'Every submission runs through all six stages before a single user can install it. Transparent decisions, explainable results, zero mystery rejections.',
      'Findings produce a risk score: 0–29 is ALLOW, 30–59 is REVIEW, 60–100 is BLOCK.',
    ],
    links: [
      ['/how-safety-works', 'How safety works'],
      ['/pricing', 'Pricing'],
    ],
  },
  {
    path: '/pricing',
    changefreq: 'monthly',
    priority: '0.8',
    title: 'Pricing — SafeLaunch PWA App Store',
    description: 'Simple, flat pricing with no revenue cuts. Publish PWAs from $9/month. Every plan includes a full 6-layer AI safety scan.',
    h1: 'No Revenue Cuts. No Surprises.',
    crumb: 'Pricing',
    summary: [
      'SafeLaunch is subscription-only and takes no revenue cut. Plans: Creator Lite $9/month, Creator Pro $29/month, Business $99/month, each with a 14-day free trial. Every plan includes the full 6-layer AI safety scan.',
      'Store visitors can browse and install any app without signing up — only developers need a publisher account.',
    ],
    links: [
      ['/tutorial', 'Build and publish a PWA'],
      ['/how-safety-works', 'How safety works'],
    ],
  },
  {
    path: '/tutorial',
    changefreq: 'monthly',
    priority: '0.7',
    title: 'Tutorial — Build & Publish PWAs',
    description: 'Learn what a PWA is, how to build it with AI tools, and how to publish on SafeLaunch.',
    h1: 'Build a PWA. Publish it. In minutes.',
    crumb: 'Tutorial',
    summary: [
      'A Progressive Web App (PWA) is a website that behaves like an app: it can be installed, works offline (if coded), loads fast, and feels native on mobile and desktop.',
      'A real PWA needs a valid manifest and service worker, icons (192 and 512 px), HTTPS hosting and a responsive design. Deploy it to a public URL, then go to Publish, choose ZIP, GitHub or URL, run Build & Scan and publish to the store.',
    ],
    links: [
      ['/pricing', 'Pricing'],
      ['/app-store', 'Install guide'],
    ],
  },
  {
    path: '/app-store',
    changefreq: 'monthly',
    priority: '0.7',
    title: 'Install SafeLaunch — PWA App Store',
    description: 'Install SafeLaunch on your iPhone, iPad, Android, or Mac. Works like a native app — no App Store required.',
    h1: 'Install SafeLaunch',
    summary: [
      'Open the store in Chrome or Edge (Android, Windows) or Safari (iPhone, iPad, macOS), then use the browser’s Install or Add to Home Screen option. SafeLaunch then works like a native app — no App Store required.',
    ],
    links: [
      ['/store', 'Browse the store'],
      ['/support', 'Support'],
    ],
  },
  {
    path: '/support',
    changefreq: 'monthly',
    priority: '0.5',
    title: 'Support — SafeLaunch',
    description: 'Get help with SafeLaunch. FAQs and AI-powered support.',
    h1: 'How Can We Help?',
    crumb: 'Support',
    summary: [
      'To publish: create a publisher account, choose a plan, then upload your PWA via ZIP, GitHub or URL — the AI scan runs automatically. If an app is blocked, open the scan report, fix what it lists and resubmit for a rescan.',
    ],
    links: [
      ['/app-store', 'Install guide'],
      ['/pricing', 'Pricing'],
    ],
  },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3', title: 'Privacy Policy — SafeLaunch', description: 'SafeLaunch privacy policy. How we collect, use, and protect your data.', h1: 'Privacy Policy' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3', title: 'Terms of Service — SafeLaunch', description: 'SafeLaunch terms of service. Rules and guidelines for using the SafeLaunch PWA App Store.', h1: 'Terms of Service' },
  { path: '/developer-agreement', changefreq: 'yearly', priority: '0.3', title: 'Developer Agreement — SafeLaunch', description: 'SafeLaunch Developer Agreement. Terms and responsibilities for app publishers.', h1: 'Developer Agreement' },
  { path: '/dmca', changefreq: 'yearly', priority: '0.3', title: 'DMCA / Content Removal — SafeLaunch', description: 'Report copyright infringement or request content removal on SafeLaunch.', h1: 'DMCA / Content Removal Policy' },
]
