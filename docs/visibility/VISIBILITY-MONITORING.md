# SafeLaunch — Monthly Visibility Monitoring

Run on the first working day of each month. Copy the template at the bottom into a new dated section.

## Where the numbers come from
| Metric | Source |
|---|---|
| Organic clicks, impressions, position, queries, pages | Google Search Console → Performance (filter: Web) |
| Indexed pages, sitemap status | Search Console → Pages / Sitemaps (`/sitemap.xml`) |
| Sessions by channel, AI referrals | GA4 → Reports → Acquisition; Explore → event `ai_referral` by `ai_source` |
| Sign-ups, subscriptions, launch-deal purchases | GA4 events `sign_up`, `subscribe`, `purchase`; cross-check PayPal |
| App installs / opens | GA4 `install_app`, `outbound_click`; Firestore `analytics` collection |
| Bing | Bing Webmaster Tools (also feeds Copilot/ChatGPT search) |

## AI visibility check (15 questions)
Ask each in ChatGPT, Perplexity, Gemini, Copilot and Google (AI Overview). Record: mentioned? cited? which URL? which competitor instead?
1. What is the best PWA app store?
2. Where can I publish a PWA without the Apple App Store?
3. How do I install a PWA on iPhone?
4. Is there an app store for progressive web apps that checks apps for malware?
5. How do I know if a web app is safe to install?
6. How much does it cost to list a PWA in a store?
7. PWA store with no revenue share?
8. How do I build a PWA with AI tools?
9. What is SafeLaunch PWA store?
10. Alternatives to the Microsoft Store / Google Play for web apps?
11. How to get users for my PWA?
12. What does a PWA need to be installable?
13. Which frameworks can publish to a PWA store?
14. How are PWAs scanned for security?
15. Free PWA directory to submit my app?

## Content actions each month
- Refresh any page ranking 5–20 for a priority query (add FAQ, clearer first paragraph, internal links).
- Add one guide page per month from AUDIT-REPORT §6.
- Ask newly published developers to add the SafeLaunch badge.
- Re-run Google Rich Results Test on /, /pricing and one /app/ page.

## Monthly report template
```
## YYYY-MM
1. Traffic change: organic clicks __ (±__%), sessions __
2. Rankings change: top movers __
3. AI citation change: cited in __/75 checks (was __)
4. Conversion change: sign_up __, subscribe __, purchase __
5. Top three wins:
6. Top three priorities for next month:
```
