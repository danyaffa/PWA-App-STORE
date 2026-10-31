# SafeLaunch — Website Visibility Audit

Site: https://www.pwa-app-store.com · Repo: danyaffa/PWA-App-STORE · Audit date: 31 Oct 2026
Method: `WEBSITE-VISIBILITY-AUDIT.md` from the Website Visibility Upgrade Kit, plus live HTTP checks with curl and headless Chromium checks against a local production build.

## 1. Overall visibility score: 3.5 / 10 (before this change)

| Area | Score | Main reason |
|---|---:|---|
| Technical foundations | 2 | Every canonical, `og:url` and the robots.txt sitemap line pointed at **agentslock.com**, which is a different product (AgentsLock). |
| Search intent & content | 5 | Good pages exist (tutorial, safety, pricing FAQ), but the SPA served the same homepage HTML to every crawler. |
| AI search readiness | 3 | No llms.txt, no crawlable text without JavaScript, no FAQ/breadcrumb structured data. |
| Structured data | 3 | One site-wide `WebApplication` block with the wrong domain. |
| Conversion paths | 6 | Clear CTAs, but the developer share links on /app/:id/promote sent traffic to agentslock.com, and the embed badge image did not exist (404). |
| Tracking & measurement | 2 | Firestore install/view counters only. No GA4, no conversion events, no Search Console verification wired in, no AI-referral tracking. |
| Local visibility | n/a | Online product, no physical location. |
| Accessibility & trust | 6 | Homepage had no H1 (the headline is inside an image). Hero PNG was 1.2 MB. |

## 2. Top 10 opportunities (ranked by expected impact)

1. **Fix the domain** in canonicals, OG tags, robots.txt and the sitemap (P0). Google was being told the canonical copy of every page lives on agentslock.com.
2. **Serve a real sitemap.** Live `/robots.txt` pointed to `https://agentslock.com/sitemap.xml`, which returns 404. The repo sitemap listed 12 `/app/*` URLs (focusflow, splitwise, …) that no longer exist and render "App not found".
3. **Pre-render per-route HTML** (title, description, canonical, OG, JSON-LD, visible summary) so crawlers and link previews that don't run JavaScript see the right page.
4. **Per-app share previews.** /app/:id links shared on WhatsApp, X, LinkedIn and Facebook showed the homepage title. These pages are the store's main growth loop.
5. **Fix the Promote page** share URL and embed badge so developers' backlinks point to SafeLaunch.
6. **Add GA4 + conversion events** (sign_up, purchase, subscribe, install_app, outbound_click, search, ai_referral).
7. **Wire Search Console and Bing verification** (the env vars were already documented but never used).
8. **Add structured data**: Organization, WebSite + SearchAction, FAQPage (pricing), BreadcrumbList, SoftwareApplication (apps).
9. **Add llms.txt** with factual site summary for AI assistants.
10. **Hero image weight:** 1.2 MB PNG → 52 KB (mobile) / 128 KB (desktop) WebP.

## 3. P0 — critical (implemented)

- Domain fix everywhere → `src/seo/site.js` (`SITE_URL = https://www.pwa-app-store.com`).
- robots.txt → correct sitemap URL; private routes disallowed.
- Dynamic `/sitemap.xml` (`api/sitemap.js`): static public routes + Firestore-published apps; stale demo URLs removed.
- Homepage H1 (wraps the existing hero image; no visual change — measured identical box size and page height at 375 px and 1280 px).
- `noindex` on private/utility pages: dashboard, sign-in, publish, payment, cancel, management, diagnostics, trust-ops, PayPal setup, promote, scan reports, 404.

## 4. P1 — high impact (implemented)

- Build-time pre-rendered HTML for 12 public routes (`src/seo/vitePluginSeo.js`).
- `/app/:id` server-rendered head + summary (`api/app-page.js`), real 404 for unknown apps.
- JSON-LD: Organization, WebSite + SearchAction, BreadcrumbList, FAQPage, SoftwareApplication.
- GA4 (optional, env-driven) + conversion events + AI-referral detection (`src/lib/track.js`).
- Search Console / Bing verification meta from env.
- `public/llms.txt`, `public/badge-safelaunch.svg`, Promote links fixed.
- WebP hero with `srcset`, explicit width/height.

## 5. P2 — useful enhancements (not implemented)

- Route-level code splitting (main JS bundle is 1.13 MB). Not done: this app already has stale-cache recovery code, and lazy chunks add a "failed to fetch module" risk after deploys. Needs a deliberate rollout.
- Sign-in page has no H1.
- Dedicated landing pages for high-intent questions (see §6).
- `og:image` per app (generated card) instead of the site image.

## 6. Missing pages & content opportunities

| Query intent | Suggested page | Status |
|---|---|---|
| "what is a PWA" / "PWA vs native app" | /guides/what-is-a-pwa | Not created (needs owner review of copy) |
| "how to install a PWA on iPhone" | Extend /app-store with iOS-specific steps + FAQ | Exists, could be deepened |
| "publish PWA without App Store" / "PWA app store" | /publish-a-pwa (public landing; /publish is behind login) | Not created |
| "is [app] safe" | Per-app safety summary on /app/:id | Partly (blocked by placeholder report data, see §8) |
| "PWA store alternatives" / comparison | /compare (vs. app stores, vs. self-hosting) | Not created — must avoid unsupported claims |

## 7. Tracking gaps

Closed in code (needs `GA4_MEASUREMENT_ID` set to start reporting): `sign_up`, `purchase` (launch deal capture), `subscribe` (PayPal subscription return), `install_app`, `outbound_click`, `search`, `view_item` (function exists, not currently called by any page), `ai_referral`.
Still open: `generate_lead` / `contact` on the Support chat, `begin_checkout` on PayPal button click, UTM convention adoption in campaigns.

## 8. Risks & compliance issues (owner decision needed — not changed)

1. **Privacy Policy and Terms say the service runs "at agentslock.com".** Legal text — needs your approval to change to www.pwa-app-store.com.
2. **Demo catalogue (`src/utils/data.js`)** lists 33 third-party apps (Notion, Spotify, Google Maps, …) with install counts, star ratings and review totals that are not from SafeLaunch users. These appear as store listings. Excluded from the sitemap and from structured data (no `AggregateRating` anywhere). Recommend labelling them "Featured web apps" with no ratings, or removing the numbers.
3. **Scan report pages** show the same hardcoded build, version and scan date for every app. Marked `noindex` until they show real per-app data.
4. **Launch-deal count conflicts:** homepage banner says "First 1,000 Apps", Pricing and Payment say "First 100".
5. Blocked apps are stored in browser localStorage (`sl_blocked_apps`) only, so a block made in Management doesn't hide the app for other visitors or from the sitemap. The sitemap does exclude apps with `trust: 'red'` or a blocked/suspended status field.
6. Adding GA4 sets analytics cookies. Update the Privacy Policy (and add consent if you serve EU/UK users) before setting `GA4_MEASUREMENT_ID`.

## 9. 30 / 60 / 90-day plan

- **Days 1–30:** Merge, verify in Search Console, submit sitemap, set GA4, request indexing for /, /store, /pricing, /how-safety-works, /tutorial. Decide on items 1–4 in §8.
- **Days 31–60:** Publish 2–3 guide pages from §6. Ask every published developer to add the SafeLaunch badge (backlinks). List SafeLaunch on PWA directories and Product Hunt.
- **Days 61–90:** Per-app OG images, code splitting, monthly AI-citation checks (see VISIBILITY-MONITORING.md), refresh pages ranking in positions 5–20.
