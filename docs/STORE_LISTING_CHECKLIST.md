# Store Listing Checklist — Google Play & Apple App Store

Complete this checklist before submitting SafeLaunch to Google Play or Apple App Store.

---

## Required Assets

### Icons

| Asset | Size | Format | Notes |
|-------|------|--------|-------|
| App Icon (Android) | 512x512 | PNG, 32-bit | No transparency, no rounded corners (Play Store rounds them) |
| App Icon (iOS) | 1024x1024 | PNG, no alpha | No rounded corners (iOS rounds them) |
| Adaptive Icon Foreground | 432x432 | PNG | Android adaptive icon layer |
| Adaptive Icon Background | 432x432 | PNG or color | Android adaptive icon layer |

### Screenshots

#### Google Play (minimum 2, max 8 per device type)
- Phone: 1080x1920 or 1920x1080 (16:9)
- 7" Tablet: 1200x1920 (optional but recommended)
- 10" Tablet: 1800x2560 (optional but recommended)

#### Apple App Store (required for all supported devices)
- iPhone 6.7" (1290x2796)
- iPhone 6.5" (1242x2688)
- iPhone 5.5" (1242x2208)
- iPad Pro 12.9" 6th gen (2048x2732)
- iPad Pro 12.9" 2nd gen (2048x2732)

### Feature Graphic (Google Play only)
- 1024x500 PNG or JPG

---

## Store Listing Text

### App Name
**SafeLaunch — Trusted PWA App Store**

### Short Description (max 80 chars)
`AI-verified PWA app store. Browse, publish, and install safe web apps.`

### Long Description (max 4000 chars)

```
SafeLaunch is the trusted app store for Progressive Web Apps (PWAs). Every app listed on SafeLaunch has been verified through our 6-layer AI safety pipeline — so you can install with confidence.

FOR USERS:
• Browse a curated store of AI-verified web apps
• See detailed safety reports and risk scores for every app
• Install apps directly to your home screen — fast, lightweight, no bloat
• Apps work offline and update automatically
• No tracking, no ads in the store itself

FOR DEVELOPERS:
• Publish your PWA in minutes — upload ZIP, connect GitHub, or paste URL
• Automatic framework detection (React, Vue, Svelte, Angular, Vanilla)
• Full 6-layer AI safety scan: static analysis, CVE check, secrets detection, dynamic sandbox, policy compliance, and reputation scoring
• Transparent scan reports — know exactly what was found and how to fix it
• No revenue cuts — flat monthly subscription
• Dashboard with analytics, scan history, and version management

SAFETY PIPELINE:
1. Pre-build static intake (malware signatures, secrets, binary blobs)
2. Sandboxed build + SBOM generation + CVE dependency scan
3. Post-build artifact analysis (hidden iframes, crypto-miners, obfuscation)
4. Dynamic sandbox analysis (network calls, fingerprinting, redirects)
5. Policy & compliance check (privacy policy, contact info, content rules)
6. Publisher reputation & history scoring

Plans start at $9/month for indie developers. No certificates needed. No developer accounts required. Just publish and grow.

Visit agentslock.com to get started.
```

### Keywords / Tags (Apple: 100 char limit)
```
pwa,app store,web apps,safety,security,ai verified,progressive web app,install,publish,developer
```

### Category
- Google Play: **Tools** or **Productivity**
- Apple: **Utilities** or **Developer Tools**

### Content Rating
- ESRB: Everyone
- PEGI: 3
- No violence, no sexual content, no gambling

---

## Required URLs

| URL | Status | Value |
|-----|--------|-------|
| Privacy Policy | Required | `https://agentslock.com/privacy` |
| Terms of Service | Recommended | `https://agentslock.com/terms` |
| Support / Help | Required (Apple) | `https://agentslock.com/support` |
| Marketing Website | Recommended | `https://agentslock.com` |

---

## App Information

| Field | Value |
|-------|-------|
| Bundle ID / Package Name | `com.agentslock.safelaunch` |
| Version | `1.0.0` |
| Min Android SDK | 24 (Android 7.0) |
| Min iOS Version | 15.0 |
| Languages | English |
| Price | Free |
| In-App Purchases | No (subscriptions handled via web) |
| Ads | No |

---

## Pre-Submission Checklist

- [ ] App icon exported at all required sizes
- [ ] Screenshots taken for all required device sizes
- [ ] Feature graphic created (Google Play)
- [ ] Long and short descriptions written
- [ ] Privacy policy page live at /privacy
- [ ] Terms of service page live at /terms
- [ ] Support page live at /support
- [ ] Content rating questionnaire completed
- [ ] App tested on physical devices (Android + iOS)
- [ ] Offline functionality verified
- [ ] Deep links configured (if applicable)
- [ ] Version number and build number set correctly
- [ ] Release notes written for this version

---

## ASO (App Store Optimization) Tips

1. **Title**: Include primary keyword ("PWA App Store") in the title
2. **Screenshots**: Show the store browse experience, safety reports, and publishing flow
3. **Description**: Front-load the most important features in the first 2-3 lines
4. **Keywords**: Target "pwa", "web app store", "app safety", "ai verified"
5. **Reviews**: Encourage early users to leave reviews
6. **Updates**: Regular updates signal an active app to the algorithm
7. **Localization**: Translate listing to top markets (Spanish, French, German, Japanese) later
