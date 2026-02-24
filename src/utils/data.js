export const APPS = [
  { id: 'focusflow',    icon:'✅', name:'FocusFlow',      desc:'Pomodoro-powered task manager. Offline-first, no account needed.',              category:'Productivity',    score:5,  trust:'green',  installs:'12k',  rankingScore:88, safetyScore:95, averageRating:4.8, totalReviews:142, publishedAt:'2025-06-15', developerTrust:92, installVelocity:85, badges:['trending','verified','top_rated'] },
  { id: 'splitwise',   icon:'💸', name:'SplitWise Lite',  desc:'Split bills with friends. No server, all local, completely private.',           category:'Finance',         score:15, trust:'green',  installs:'8.4k', rankingScore:72, safetyScore:85, averageRating:4.5, totalReviews:89,  publishedAt:'2025-08-22', developerTrust:78, installVelocity:60, badges:['verified'] },
  { id: 'mindtrack',   icon:'🧘', name:'MindTrack',       desc:'Daily mood journal with habit tracking and streak visualization.',               category:'Health',          score:11, trust:'green',  installs:'5.7k', rankingScore:65, safetyScore:89, averageRating:4.3, totalReviews:57,  publishedAt:'2025-09-10', developerTrust:70, installVelocity:55, badges:['verified'] },
  { id: 'datadash',    icon:'📊', name:'DataDash',        desc:'Real-time analytics dashboard. Connect any API, visualize anything.',           category:'Developer Tools', score:8,  trust:'green',  installs:'2.1k', rankingScore:58, safetyScore:92, averageRating:4.6, totalReviews:34,  publishedAt:'2025-11-05', developerTrust:65, installVelocity:70, badges:['rising'] },
  { id: 'vaultpass',   icon:'🔐', name:'VaultPass',       desc:'Zero-knowledge password manager. Your data never leaves your device.',          category:'Productivity',    score:22, trust:'green',  installs:'3.2k', rankingScore:61, safetyScore:78, averageRating:4.2, totalReviews:41,  publishedAt:'2025-10-18', developerTrust:72, installVelocity:45, badges:[] },
  { id: 'stockpulse',  icon:'📈', name:'StockPulse',      desc:'Portfolio tracker with live prices, alerts, and portfolio analytics.',          category:'Finance',         score:31, trust:'yellow', installs:'1.8k', rankingScore:45, safetyScore:69, averageRating:3.9, totalReviews:28,  publishedAt:'2025-12-01', developerTrust:55, installVelocity:40, badges:[] },
  { id: 'waveform',    icon:'🎵', name:'WaveForm',        desc:'Simple audio visualizer and recorder. Works fully offline.',                    category:'Entertainment',   score:4,  trust:'green',  installs:'920',  rankingScore:52, safetyScore:96, averageRating:4.7, totalReviews:19,  publishedAt:'2026-01-20', developerTrust:60, installVelocity:75, badges:['new','verified'] },
  { id: 'langleap',    icon:'🌍', name:'LangLeap',        desc:'Flashcard-based language learning. Spaced repetition built-in.',                category:'Education',       score:9,  trust:'green',  installs:'6.1k', rankingScore:70, safetyScore:91, averageRating:4.4, totalReviews:73,  publishedAt:'2025-07-28', developerTrust:82, installVelocity:50, badges:['verified'] },
  { id: 'notevault',   icon:'🗂️', name:'NoteVault',       desc:'Markdown notes with offline sync. Clean, fast, private.',                      category:'Productivity',    score:7,  trust:'green',  installs:'4.3k', rankingScore:64, safetyScore:93, averageRating:4.5, totalReviews:52,  publishedAt:'2025-08-14', developerTrust:75, installVelocity:48, badges:['verified'] },
  { id: 'caltrack',    icon:'🍎', name:'CalTrack',        desc:'Simple calorie and macro tracker. No ads, no account.',                         category:'Health',          score:13, trust:'green',  installs:'9.1k', rankingScore:78, safetyScore:87, averageRating:4.6, totalReviews:98,  publishedAt:'2025-05-30', developerTrust:88, installVelocity:62, badges:['trending','verified'] },
  { id: 'fincalc',     icon:'🧮', name:'FinCalc Pro',     desc:'Financial calculator suite — mortgage, tax, compound interest.',               category:'Finance',         score:6,  trust:'green',  installs:'7.8k', rankingScore:74, safetyScore:94, averageRating:4.7, totalReviews:86,  publishedAt:'2025-06-22', developerTrust:85, installVelocity:55, badges:['verified','top_rated'] },
  { id: 'pixelrunner', icon:'🎮', name:'PixelRunner',     desc:'Endless runner game. PWA, installable, fully offline.',                        category:'Entertainment',   score:3,  trust:'green',  installs:'14k',  rankingScore:91, safetyScore:97, averageRating:4.9, totalReviews:210, publishedAt:'2025-04-10', developerTrust:95, installVelocity:90, badges:['trending','verified','top_rated'] },

  // Games
  { id: 'puzzlequest',  icon:'🧩', name:'PuzzleQuest',    desc:'Daily brain puzzles — crosswords, sudoku, and logic games. Fully offline.',       category:'Games',           score:5,  trust:'green',  installs:'18k',  rankingScore:89, safetyScore:96, averageRating:4.8, totalReviews:245, publishedAt:'2025-05-20', developerTrust:93, installVelocity:88, badges:['trending','verified','top_rated'] },
  { id: 'chesslite',    icon:'♟️', name:'ChessLite',       desc:'Play chess offline or challenge friends over P2P. No servers needed.',              category:'Games',           score:4,  trust:'green',  installs:'9.2k', rankingScore:76, safetyScore:94, averageRating:4.7, totalReviews:130, publishedAt:'2025-07-15', developerTrust:87, installVelocity:72, badges:['verified','top_rated'] },

  // Security
  { id: 'shieldguard',  icon:'🛡️', name:'ShieldGuard',     desc:'Real-time virus and malware scanner for your device. Privacy-first protection.',  category:'Security',        score:6,  trust:'green',  installs:'22k',  rankingScore:92, safetyScore:98, averageRating:4.9, totalReviews:310, publishedAt:'2025-03-18', developerTrust:96, installVelocity:91, badges:['trending','verified','top_rated'] },
  { id: 'privacywall',  icon:'🔒', name:'PrivacyWall',     desc:'Block trackers, ads, and fingerprinting across all your browsing. Open source.',  category:'Security',        score:8,  trust:'green',  installs:'15k',  rankingScore:84, safetyScore:95, averageRating:4.7, totalReviews:198, publishedAt:'2025-06-02', developerTrust:90, installVelocity:78, badges:['trending','verified'] },

  // Business
  { id: 'invoicepro',   icon:'📋', name:'InvoicePro',      desc:'Create, send, and track invoices. PDF export, no subscription required.',         category:'Business',        score:7,  trust:'green',  installs:'11k',  rankingScore:79, safetyScore:93, averageRating:4.6, totalReviews:156, publishedAt:'2025-04-25', developerTrust:88, installVelocity:65, badges:['verified','top_rated'] },
  { id: 'teamboard',    icon:'📌', name:'TeamBoard',       desc:'Kanban project board for small teams. Real-time sync, works offline.',             category:'Business',        score:9,  trust:'green',  installs:'7.5k', rankingScore:71, safetyScore:90, averageRating:4.4, totalReviews:94,  publishedAt:'2025-08-10', developerTrust:82, installVelocity:58, badges:['verified'] },

  // Food & Cooking
  { id: 'chefpal',      icon:'👨‍🍳', name:'ChefPal',         desc:'10,000+ recipes with step-by-step guides. Meal planner and grocery lists.',      category:'Food & Cooking',  score:5,  trust:'green',  installs:'16k',  rankingScore:86, safetyScore:95, averageRating:4.8, totalReviews:220, publishedAt:'2025-05-08', developerTrust:91, installVelocity:82, badges:['trending','verified','top_rated'] },
  { id: 'mealprep',     icon:'🥗', name:'MealPrep Weekly', desc:'Plan your weekly meals, auto-generate shopping lists, track nutrition.',          category:'Food & Cooking',  score:8,  trust:'green',  installs:'6.3k', rankingScore:68, safetyScore:91, averageRating:4.5, totalReviews:78,  publishedAt:'2025-09-22', developerTrust:76, installVelocity:55, badges:['verified'] },

  // Social
  { id: 'circlechat',   icon:'💬', name:'CircleChat',      desc:'End-to-end encrypted group chat. No data collection, no ads.',                    category:'Social',          score:10, trust:'green',  installs:'13k',  rankingScore:82, safetyScore:92, averageRating:4.5, totalReviews:175, publishedAt:'2025-06-30', developerTrust:85, installVelocity:74, badges:['verified'] },

  // Shopping
  { id: 'dealfinder',   icon:'🏷️', name:'DealFinder',      desc:'Compare prices across stores. Get alerts when prices drop on your wishlist.',     category:'Shopping',         score:12, trust:'green',  installs:'10k',  rankingScore:77, safetyScore:88, averageRating:4.4, totalReviews:135, publishedAt:'2025-07-05', developerTrust:80, installVelocity:68, badges:['verified'] },

  // Travel
  { id: 'tripplan',     icon:'✈️', name:'TripPlan',        desc:'Plan trips, save maps offline, and track expenses while traveling.',               category:'Travel',          score:7,  trust:'green',  installs:'8.8k', rankingScore:75, safetyScore:93, averageRating:4.6, totalReviews:112, publishedAt:'2025-08-18', developerTrust:84, installVelocity:63, badges:['verified','top_rated'] },

  // Music
  { id: 'beatmaker',    icon:'🎹', name:'BeatMaker',       desc:'Create beats and loops right in your browser. Export to WAV and MP3.',             category:'Music',           score:6,  trust:'green',  installs:'7.1k', rankingScore:73, safetyScore:94, averageRating:4.6, totalReviews:88,  publishedAt:'2025-09-01', developerTrust:81, installVelocity:66, badges:['verified'] },

  // Photography
  { id: 'snapedit',     icon:'📸', name:'SnapEdit',        desc:'Photo editor with filters, crop, resize, and batch processing. No uploads.',      category:'Photography',     score:4,  trust:'green',  installs:'12k',  rankingScore:83, safetyScore:96, averageRating:4.7, totalReviews:168, publishedAt:'2025-05-15', developerTrust:89, installVelocity:79, badges:['trending','verified'] },

  // Weather
  { id: 'skycast',      icon:'🌤️', name:'SkyCast',         desc:'Hyperlocal weather forecasts. 7-day outlook with rain alerts.',                    category:'Weather',         score:9,  trust:'green',  installs:'9.5k', rankingScore:74, safetyScore:91, averageRating:4.5, totalReviews:140, publishedAt:'2025-06-12', developerTrust:83, installVelocity:61, badges:['verified'] },

  // News
  { id: 'newsdigest',   icon:'📰', name:'NewsDigest',      desc:'AI-curated news from 500+ sources. No ads, no tracking, just news.',               category:'News',            score:11, trust:'green',  installs:'11k',  rankingScore:80, safetyScore:89, averageRating:4.4, totalReviews:152, publishedAt:'2025-07-20', developerTrust:79, installVelocity:70, badges:['verified'] },

  // Sports
  { id: 'fittrack',     icon:'🏋️', name:'FitTrack',        desc:'Track workouts, set goals, and monitor progress. Works offline at the gym.',      category:'Sports',          score:6,  trust:'green',  installs:'14k',  rankingScore:85, safetyScore:94, averageRating:4.7, totalReviews:195, publishedAt:'2025-04-28', developerTrust:90, installVelocity:80, badges:['trending','verified','top_rated'] },

  // Utilities
  { id: 'unitconvert',  icon:'🔧', name:'UniConvert',      desc:'Convert any unit — length, weight, temperature, currency. Works offline.',         category:'Utilities',       score:3,  trust:'green',  installs:'8.5k', rankingScore:72, safetyScore:97, averageRating:4.8, totalReviews:110, publishedAt:'2025-08-05', developerTrust:86, installVelocity:56, badges:['verified','top_rated'] },

  // Communication
  { id: 'quickmail',    icon:'📧', name:'QuickMail',       desc:'Lightweight email client with smart sorting and offline mode.',                    category:'Communication',   score:10, trust:'green',  installs:'6.8k', rankingScore:69, safetyScore:90, averageRating:4.3, totalReviews:82,  publishedAt:'2025-10-02', developerTrust:77, installVelocity:52, badges:['verified'] },

  // Lifestyle
  { id: 'habitloop',    icon:'🔄', name:'HabitLoop',       desc:'Build good habits with streaks, reminders, and visual progress charts.',           category:'Lifestyle',       score:5,  trust:'green',  installs:'10k',  rankingScore:81, safetyScore:95, averageRating:4.7, totalReviews:145, publishedAt:'2025-06-25', developerTrust:88, installVelocity:73, badges:['verified','top_rated'] },
]

export const CATEGORIES = ['All', 'Productivity', 'Finance', 'Health', 'Developer Tools', 'Entertainment', 'Education', 'Games', 'Security', 'Business', 'Food & Cooking', 'Social', 'Shopping', 'Travel', 'Music', 'Photography', 'Weather', 'News', 'Sports', 'Utilities', 'Communication', 'Lifestyle']

export const SCAN_STEPS = [
  { pct:8,  label:'Initializing sandbox',       cls:'info', text:'[init] Pulling node:20-alpine...' },
  { pct:18, label:'Installing dependencies',    cls:'info', text:'[build] npm ci — 47 packages' },
  { pct:30, label:'Building PWA bundle',        cls:'ok',   text:'[build] ✓ Built in 34s — 2.1MB' },
  { pct:40, label:'Generating SBOM',            cls:'info', text:'[sbom] 47 packages inventoried' },
  { pct:50, label:'CVE dependency scan',        cls:'warn', text:'[cve] ⚠ lodash@4.17.20 medium CVE' },
  { pct:60, label:'Static artifact analysis',   cls:'ok',   text:'[sast] ✓ No miners or hidden iframes' },
  { pct:70, label:'Secrets detection',          cls:'ok',   text:'[secrets] ✓ No credentials found' },
  { pct:80, label:'Dynamic sandbox run',        cls:'ok',   text:'[dast] ✓ 0 outbound calls detected' },
  { pct:90, label:'Policy compliance',          cls:'ok',   text:'[policy] ✓ Privacy URL + email verified' },
  { pct:97, label:'Reputation check',           cls:'ok',   text:'[rep] ✓ Publisher clean, 0 strikes' },
  { pct:100,label:'Pipeline complete',          cls:'ok',   text:'[done] Risk score: 12/100 → ALLOW ✅' },
]

export const PIPELINE_STAGES = [
  { num:'01', title:'Pre-Build Static Intake',     desc:'File validation, secrets scan, malware signatures', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ No binary blobs detected' },
      { sev:'pass', msg:'✓ No API keys or private keys in source' },
      { sev:'pass', msg:'✓ No known malware signatures matched' },
    ]},
  { num:'02', title:'Sandboxed Build + SBOM',      desc:'Docker sandbox, SBOM generation, CVE check', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ Build succeeded in 34s (React 18)' },
      { sev:'pass', msg:'✓ 47 dependencies inventoried, 0 critical CVEs' },
      { sev:'medium', msg:'⚠ lodash@4.17.20 — 1 medium CVE (no RCE path)' },
    ]},
  { num:'03', title:'Post-Build Artifact Analysis', desc:'Hidden iframes, redirect chains, clipboard hijack, crypto-miners', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ No hidden iframes or drive-by patterns' },
      { sev:'pass', msg:'✓ No crypto-miner bytecode found' },
      { sev:'pass', msg:'✓ Obfuscation score: 0.12 (normal minification)' },
    ]},
  { num:'04', title:'Dynamic Sandbox Analysis',    desc:'Headless browser — network calls, fingerprinting, redirects', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ 0 outbound network calls during 60s session' },
      { sev:'pass', msg:'✓ No device fingerprinting detected' },
      { sev:'pass', msg:'✓ No unexpected permission prompts' },
    ]},
  { num:'05', title:'Policy & Compliance',         desc:'Privacy policy, ToS, contact, category-specific rules', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ Privacy policy URL verified and live' },
      { sev:'pass', msg:'✓ Contact email validated' },
      { sev:'pass', msg:'✓ No restricted health/finance claims in copy' },
    ]},
  { num:'06', title:'Reputation & History',        desc:'Publisher age, prior strikes, version history, report rate', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ Publisher account: 8 months, 0 strikes' },
      { sev:'pass', msg:'✓ 3 prior clean versions on record' },
      { sev:'pass', msg:'✓ User report rate: 0.00%' },
    ]},
]
