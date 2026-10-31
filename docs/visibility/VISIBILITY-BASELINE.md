# SafeLaunch — Visibility Baseline

Recorded 31 Oct 2026, before this change went live. Blank cells need data only you can export (Search Console, PayPal, Firebase).

## Business details
- Business name: SafeLaunch
- Website: https://www.pwa-app-store.com (apex redirects 308 → www)
- Primary location / service area: online, worldwide
- Primary customer: indie developers and studios who build PWAs; secondary: people looking for safe web apps
- Primary product: PWA store listing + safety scan (subscription $9 / $29 / $99 per month; $2 launch deal)
- Primary conversion goal: publisher sign-up → paid plan
- Current main traffic sources: unknown (no web analytics installed)

## Current performance
- Monthly organic sessions: unknown — no GA4
- Top landing pages: unknown
- Current rankings for priority keywords: unknown — Search Console not verified via code
- Current AI citations: not tested yet (do the first check from VISIBILITY-MONITORING.md)
- Conversion rate / sales per month: export from PayPal

## Technical baseline (measured)
| Check | Before | Evidence |
|---|---|---|
| robots.txt | 200, but `Sitemap:` → agentslock.com/sitemap.xml | curl, 31 Oct 2026 |
| agentslock.com/sitemap.xml | 404 | curl |
| Canonical on every page | https://agentslock.com/… (different product) | source + headless Chromium |
| Sitemap app URLs | 12 listed, none exist in current data | `public/sitemap.xml` vs `src/utils/data.js` |
| Homepage H1 | none | headless Chromium |
| Structured data | 1 × WebApplication (wrong domain) | source |
| Search Console verification | No (env var documented, unused) | source |
| Analytics | Firestore counters only | source |
| Conversion tracking | No | source |
| Hero image | 1,224,557 bytes PNG | file size |
| Main JS bundle | 1,129,933 bytes | build output |
| llms.txt | 404 | curl |
| Core Web Vitals | not measured — run PageSpeed Insights on / and /store after deploy | — |

## Priority keywords and questions
| Keyword or question | Current position | Target page | Priority |
|---|---:|---|---|
| pwa app store | unknown | / | High |
| publish pwa without app store | unknown | /pricing → /tutorial | High |
| how to install pwa on iphone | unknown | /app-store | High |
| is this web app safe / pwa security scan | unknown | /how-safety-works | Medium |
| build a pwa with ai | unknown | /tutorial | Medium |
| progressive web app store free install | unknown | /store | Medium |
