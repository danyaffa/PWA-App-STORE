export const APPS = [
  // Productivity
  { id: 'excalidraw',   icon:'🎨', name:'Excalidraw',      desc:'Virtual whiteboard for sketching hand-drawn diagrams. Open source, works offline.', category:'Productivity',    price:'Free', score:3,  trust:'green',  installs:'2.1M', rankingScore:96, safetyScore:99, averageRating:4.9, totalReviews:4200, publishedAt:'2024-01-15', developerTrust:98, installVelocity:95, badges:['trending','verified','top_rated'] },
  { id: 'todoist',      icon:'✅', name:'Todoist',          desc:'Powerful task manager with projects, labels, filters, and natural language input.',  category:'Productivity',    price:'Free', score:5,  trust:'green',  installs:'1.8M', rankingScore:93, safetyScore:97, averageRating:4.8, totalReviews:3800, publishedAt:'2024-03-10', developerTrust:96, installVelocity:90, badges:['trending','verified','top_rated'] },
  { id: 'notion',       icon:'📝', name:'Notion',           desc:'All-in-one workspace for notes, docs, wikis, and project management.',              category:'Productivity',    price:'Free', score:4,  trust:'green',  installs:'3.5M', rankingScore:97, safetyScore:98, averageRating:4.8, totalReviews:5100, publishedAt:'2024-02-20', developerTrust:97, installVelocity:93, badges:['trending','verified','top_rated'] },

  // Finance
  { id: 'mint-alt',     icon:'💰', name:'Actual Budget',    desc:'Privacy-first budgeting app. Local-first, open source, sync across devices.',       category:'Finance',         price:'Free', score:6,  trust:'green',  installs:'180k', rankingScore:82, safetyScore:95, averageRating:4.6, totalReviews:920,  publishedAt:'2024-05-12', developerTrust:88, installVelocity:72, badges:['verified','top_rated'] },
  { id: 'wise',         icon:'💸', name:'Wise',             desc:'Send money internationally with real exchange rates and low fees.',                 category:'Finance',         price:'Free', score:8,  trust:'green',  installs:'950k', rankingScore:88, safetyScore:94, averageRating:4.7, totalReviews:2800, publishedAt:'2024-04-08', developerTrust:94, installVelocity:82, badges:['trending','verified'] },

  // Health
  { id: 'wger',         icon:'🏃', name:'wger Fitness',     desc:'Open source fitness tracker. Log workouts, manage routines, track nutrition.',      category:'Health',          price:'Free', score:5,  trust:'green',  installs:'120k', rankingScore:72, safetyScore:93, averageRating:4.4, totalReviews:560,  publishedAt:'2024-06-20', developerTrust:82, installVelocity:58, badges:['verified'] },

  // Developer Tools
  { id: 'stackblitz',   icon:'⚡', name:'StackBlitz',       desc:'Full-stack web IDE running entirely in the browser. Instant dev environments.',     category:'Developer Tools', price:'Free', score:4,  trust:'green',  installs:'1.2M', rankingScore:94, safetyScore:97, averageRating:4.8, totalReviews:3200, publishedAt:'2024-01-30', developerTrust:96, installVelocity:88, badges:['trending','verified','top_rated'] },
  { id: 'codesandbox',  icon:'📦', name:'CodeSandbox',      desc:'Online code editor and prototyping tool. Instant previews and collaboration.',      category:'Developer Tools', price:'Free', score:5,  trust:'green',  installs:'890k', rankingScore:90, safetyScore:96, averageRating:4.7, totalReviews:2600, publishedAt:'2024-02-15', developerTrust:95, installVelocity:85, badges:['trending','verified','top_rated'] },

  // Entertainment
  { id: 'spotify',      icon:'🎵', name:'Spotify',          desc:'Stream millions of songs, podcasts, and audiobooks. Free tier with ads.',           category:'Entertainment',   price:'Free', score:3,  trust:'green',  installs:'5.2M', rankingScore:98, safetyScore:98, averageRating:4.8, totalReviews:8400, publishedAt:'2024-01-05', developerTrust:99, installVelocity:97, badges:['trending','verified','top_rated'] },
  { id: 'youtube-music',icon:'🎶', name:'YouTube Music',    desc:'Official music streaming from YouTube. Free with ads, background play.',            category:'Entertainment',   price:'Free', score:4,  trust:'green',  installs:'4.1M', rankingScore:96, safetyScore:97, averageRating:4.6, totalReviews:6200, publishedAt:'2024-01-10', developerTrust:99, installVelocity:95, badges:['trending','verified','top_rated'] },

  // Education
  { id: 'duolingo',     icon:'🦉', name:'Duolingo',         desc:'Learn 40+ languages for free with bite-sized lessons and gamification.',            category:'Education',       price:'Free', score:3,  trust:'green',  installs:'3.8M', rankingScore:97, safetyScore:98, averageRating:4.7, totalReviews:7100, publishedAt:'2024-01-18', developerTrust:98, installVelocity:94, badges:['trending','verified','top_rated'] },
  { id: 'khan-academy', icon:'🎓', name:'Khan Academy',     desc:'Free world-class education. Math, science, computing, and more.',                   category:'Education',       price:'Free', score:2,  trust:'green',  installs:'2.6M', rankingScore:95, safetyScore:99, averageRating:4.9, totalReviews:5500, publishedAt:'2024-02-01', developerTrust:99, installVelocity:88, badges:['verified','top_rated'] },

  // Games
  { id: 'wordle',       icon:'🟩', name:'Wordle',           desc:'Guess the 5-letter word in 6 tries. Daily puzzle, share your results.',             category:'Games',           price:'Free', score:2,  trust:'green',  installs:'4.5M', rankingScore:97, safetyScore:99, averageRating:4.9, totalReviews:9200, publishedAt:'2024-01-02', developerTrust:99, installVelocity:92, badges:['trending','verified','top_rated'] },
  { id: '2048',         icon:'🔢', name:'2048',             desc:'Slide numbered tiles on a grid to combine them and reach 2048. Addictive classic.', category:'Games',           price:'Free', score:2,  trust:'green',  installs:'1.9M', rankingScore:90, safetyScore:99, averageRating:4.8, totalReviews:4800, publishedAt:'2024-03-05', developerTrust:95, installVelocity:78, badges:['verified','top_rated'] },

  // Security
  { id: 'bitwarden',    icon:'🔐', name:'Bitwarden',        desc:'Open source password manager. End-to-end encrypted, free for personal use.',        category:'Security',        price:'Free', score:3,  trust:'green',  installs:'1.5M', rankingScore:95, safetyScore:99, averageRating:4.8, totalReviews:4100, publishedAt:'2024-01-22', developerTrust:98, installVelocity:90, badges:['trending','verified','top_rated'] },
  { id: 'protonpass',   icon:'🛡️', name:'Proton Pass',      desc:'End-to-end encrypted password manager from the makers of ProtonMail.',              category:'Security',        price:'Free', score:4,  trust:'green',  installs:'620k', rankingScore:86, safetyScore:98, averageRating:4.7, totalReviews:1800, publishedAt:'2024-04-15', developerTrust:96, installVelocity:82, badges:['trending','verified'] },

  // Business
  { id: 'trello',       icon:'📋', name:'Trello',           desc:'Visual project management with boards, lists, and cards. Free for small teams.',    category:'Business',        price:'Free', score:4,  trust:'green',  installs:'2.8M', rankingScore:94, safetyScore:97, averageRating:4.7, totalReviews:5600, publishedAt:'2024-01-25', developerTrust:97, installVelocity:86, badges:['trending','verified','top_rated'] },
  { id: 'slack',        icon:'💬', name:'Slack',            desc:'Team messaging and collaboration hub. Channels, threads, and integrations.',        category:'Business',        price:'Free', score:5,  trust:'green',  installs:'3.2M', rankingScore:96, safetyScore:97, averageRating:4.6, totalReviews:6800, publishedAt:'2024-01-08', developerTrust:98, installVelocity:92, badges:['trending','verified','top_rated'] },

  // Food & Cooking
  { id: 'mealime',      icon:'🥗', name:'Mealime',          desc:'Meal planning made simple. Personalized recipes and auto grocery lists.',           category:'Food & Cooking',  price:'Free', score:5,  trust:'green',  installs:'380k', rankingScore:78, safetyScore:94, averageRating:4.6, totalReviews:1200, publishedAt:'2024-06-01', developerTrust:85, installVelocity:65, badges:['verified','top_rated'] },
  { id: 'cookpad',      icon:'👨‍🍳', name:'Cookpad',          desc:'Community-driven recipe sharing. Millions of home-cooked recipes from real cooks.', category:'Food & Cooking',  price:'Free', score:6,  trust:'green',  installs:'520k', rankingScore:80, safetyScore:93, averageRating:4.5, totalReviews:1500, publishedAt:'2024-05-18', developerTrust:86, installVelocity:68, badges:['verified'] },

  // Social
  { id: 'mastodon',     icon:'🐘', name:'Mastodon',         desc:'Decentralized social network. No ads, no algorithms, no corporate surveillance.',   category:'Social',          price:'Free', score:5,  trust:'green',  installs:'890k', rankingScore:84, safetyScore:96, averageRating:4.5, totalReviews:2400, publishedAt:'2024-03-12', developerTrust:92, installVelocity:74, badges:['verified','top_rated'] },

  // Shopping
  { id: 'honey',        icon:'🍯', name:'Honey by PayPal',  desc:'Automatically find and apply coupon codes at checkout. Save money effortlessly.',   category:'Shopping',        price:'Free', score:7,  trust:'green',  installs:'1.1M', rankingScore:86, safetyScore:92, averageRating:4.5, totalReviews:3200, publishedAt:'2024-04-20', developerTrust:93, installVelocity:78, badges:['trending','verified'] },

  // Travel
  { id: 'google-maps',  icon:'🗺️', name:'Google Maps',      desc:'Navigate the world with real-time traffic, transit, and offline maps.',              category:'Travel',          price:'Free', score:3,  trust:'green',  installs:'6.1M', rankingScore:99, safetyScore:98, averageRating:4.8, totalReviews:12000,publishedAt:'2024-01-01', developerTrust:99, installVelocity:98, badges:['trending','verified','top_rated'] },

  // Music
  { id: 'soundtrap',    icon:'🎹', name:'Soundtrap',        desc:'Online music studio by Spotify. Record, mix, and collaborate on music for free.',   category:'Music',           price:'Free', score:5,  trust:'green',  installs:'420k', rankingScore:79, safetyScore:95, averageRating:4.5, totalReviews:1100, publishedAt:'2024-05-25', developerTrust:94, installVelocity:62, badges:['verified'] },

  // Photography
  { id: 'photopea',     icon:'📸', name:'Photopea',         desc:'Free online photo editor. Supports PSD, XCF, Sketch, XD, and CDR formats.',        category:'Photography',     price:'Free', score:4,  trust:'green',  installs:'1.8M', rankingScore:92, safetyScore:96, averageRating:4.7, totalReviews:3900, publishedAt:'2024-02-10', developerTrust:93, installVelocity:86, badges:['trending','verified','top_rated'] },
  { id: 'squoosh',      icon:'🖼️', name:'Squoosh',          desc:'Image compression app by Google. Resize and optimize images right in the browser.', category:'Photography',     price:'Free', score:2,  trust:'green',  installs:'680k', rankingScore:85, safetyScore:99, averageRating:4.8, totalReviews:2100, publishedAt:'2024-03-20', developerTrust:99, installVelocity:72, badges:['verified','top_rated'] },

  // Weather
  { id: 'windy',        icon:'🌤️', name:'Windy',            desc:'Detailed weather forecasts with interactive radar maps. Used by pilots and sailors.',category:'Weather',         price:'Free', score:4,  trust:'green',  installs:'1.4M', rankingScore:91, safetyScore:96, averageRating:4.7, totalReviews:3600, publishedAt:'2024-02-28', developerTrust:94, installVelocity:80, badges:['trending','verified','top_rated'] },

  // News
  { id: 'hackernews',   icon:'📰', name:'Hacker News',      desc:'Tech news and discussion from Y Combinator. Top stories, comments, and jobs.',     category:'News',            price:'Free', score:3,  trust:'green',  installs:'720k', rankingScore:83, safetyScore:97, averageRating:4.6, totalReviews:1900, publishedAt:'2024-04-02', developerTrust:96, installVelocity:70, badges:['verified','top_rated'] },

  // Sports
  { id: 'strava',       icon:'🏋️', name:'Strava',           desc:'Track running, cycling, and workouts. Compete with friends and join challenges.',   category:'Sports',          price:'Free', score:5,  trust:'green',  installs:'2.4M', rankingScore:94, safetyScore:96, averageRating:4.7, totalReviews:5200, publishedAt:'2024-01-28', developerTrust:96, installVelocity:89, badges:['trending','verified','top_rated'] },

  // Utilities
  { id: 'speedtest',    icon:'🔧', name:'Speedtest by Ookla',desc:'Test your internet speed — download, upload, ping, and jitter.',                  category:'Utilities',       price:'Free', score:3,  trust:'green',  installs:'3.1M', rankingScore:95, safetyScore:97, averageRating:4.7, totalReviews:6400, publishedAt:'2024-01-12', developerTrust:97, installVelocity:90, badges:['trending','verified','top_rated'] },
  { id: 'clipdrop',     icon:'✂️', name:'Clipdrop',         desc:'AI-powered tool to remove backgrounds, upscale images, and clean up photos.',       category:'Utilities',       price:'Free', score:5,  trust:'green',  installs:'580k', rankingScore:82, safetyScore:94, averageRating:4.6, totalReviews:1600, publishedAt:'2024-05-05', developerTrust:90, installVelocity:75, badges:['verified','top_rated'] },

  // Communication
  { id: 'telegram',     icon:'📧', name:'Telegram',         desc:'Fast, secure messaging with cloud sync. Supports groups, channels, and bots.',      category:'Communication',   price:'Free', score:4,  trust:'green',  installs:'4.8M', rankingScore:98, safetyScore:96, averageRating:4.7, totalReviews:9800, publishedAt:'2024-01-03', developerTrust:97, installVelocity:96, badges:['trending','verified','top_rated'] },

  // Lifestyle
  { id: 'pinterest',    icon:'📌', name:'Pinterest',        desc:'Discover recipes, home ideas, style inspiration, and more. Save and organize pins.', category:'Lifestyle',       price:'Free', score:5,  trust:'green',  installs:'2.9M', rankingScore:95, safetyScore:96, averageRating:4.6, totalReviews:6100, publishedAt:'2024-01-15', developerTrust:97, installVelocity:91, badges:['trending','verified','top_rated'] },
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
