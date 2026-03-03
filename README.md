# SafeLaunch — PWA App Store

> The trusted PWA store. Upload → Auto-build → AI safety scan → Publish → Install.

![SafeLaunch](https://img.shields.io/badge/SafeLaunch-PWA%20Store-00e5a0?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge)

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/PWA-App-Store.git
cd PWA-App-Store
npm install
npm run dev        # → http://localhost:3000
```

## Build & Deploy

```bash
npm run build      # outputs to /dist
npm run preview    # preview production build locally
```

Push to GitHub → Settings → Pages → GitHub Actions → auto-deploys on every push to `main`.

---

## Project Structure

```
safelaunch/
├── index.html                  # Vite HTML entry point
├── vite.config.js              # Vite + React + PWA plugin
├── package.json
├── .gitignore
├── README.md
│
├── public/                     # Static assets (icons, screenshots)
│   └── icons/
│
└── src/
    ├── main.jsx                # React entry — mounts App
    ├── App.jsx                 # Router with all routes
    │
    ├── styles/
    │   └── global.css          # CSS variables, reset, shared utilities
    │
    ├── components/
    │   ├── Nav.jsx / .module.css
    │   ├── Footer.jsx / .module.css
    │   ├── AppCard.jsx / .module.css
    │   └── Toast.jsx
    │
    ├── hooks/
    │   └── useToast.js
    │
    ├── utils/
    │   └── data.js             # App data, scan steps, pipeline stages
    │
    └── pages/
        ├── Home.jsx / .module.css       # / — Hero + features
        ├── Store.jsx / .module.css      # /store — Browse & filter apps
        ├── Publish.jsx / .module.css    # /publish — Upload + live scan demo
        ├── Safety.jsx                   # /safety — Pipeline explainer
        ├── Pricing.jsx / .module.css    # /pricing — Plans + FAQ
        ├── AppDetail.jsx / .module.css  # /app/:id — App listing + trust tabs
        ├── Dashboard.jsx / .module.css  # /dashboard — Publisher dashboard
        ├── SignIn.jsx / .module.css     # /signin — Auth
        ├── TrustOps.jsx / .module.css   # /trust-ops — Admin review queue
        ├── ScanReport.jsx / .module.css # /report/:id — Full scan report
        └── NotFound.jsx / .module.css   # * — 404
```

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/store` | Browse apps |
| `/publish` | Upload + build + scan flow |
| `/safety` | 6-layer pipeline explainer |
| `/pricing` | Plans, FAQ, billing toggle |
| `/app/:id` | Individual app — tabs: overview, safety, reviews, versions |
| `/dashboard` | Publisher dashboard |
| `/signin` | Sign in / Create account |
| `/trust-ops` | Admin review queue (approve / block / hold) |
| `/report/:id` | Full per-version scan report |

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + React Router 6 |
| Bundler | Vite 5 |
| Styling | CSS Modules + CSS Variables |
| PWA | vite-plugin-pwa |
| Fonts | DM Serif Display, Syne, DM Mono |
| Backend (separate) | Node.js + Express + PostgreSQL |

## Risk Scoring

| Score | Decision |
|---|---|
| 0–29 | ✅ ALLOW |
| 30–59 | ⚠️ REVIEW |
| 60–100 | 🚫 BLOCK |

See `backend/` folder for the full scanner, risk-score model, Docker build sandbox, and PostgreSQL schema.

## PayPal setup

- Frontend setup guide: `/paypal/setup`
- Checkout APIs:
  - `POST /api/paypal/create-order`
  - `POST /api/paypal/capture-order`
- Webhook endpoint:
  - `POST /api/paypal/webhook`

Set these env vars in Vercel for server-side verification:

- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_ENV` (`sandbox` or `live`)
- `PAYPAL_WEBHOOK_ID` (from your PayPal webhook settings)
