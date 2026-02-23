export const APPS = [
  { id: 'focusflow',    icon:'✅', name:'FocusFlow',      desc:'Pomodoro-powered task manager. Offline-first, no account needed.',              category:'Productivity',    score:5,  trust:'green',  installs:'12k' },
  { id: 'splitwise',   icon:'💸', name:'SplitWise Lite',  desc:'Split bills with friends. No server, all local, completely private.',           category:'Finance',         score:15, trust:'green',  installs:'8.4k' },
  { id: 'mindtrack',   icon:'🧘', name:'MindTrack',       desc:'Daily mood journal with habit tracking and streak visualization.',               category:'Health',          score:11, trust:'green',  installs:'5.7k' },
  { id: 'datadash',    icon:'📊', name:'DataDash',        desc:'Real-time analytics dashboard. Connect any API, visualize anything.',           category:'Developer Tools', score:8,  trust:'green',  installs:'2.1k' },
  { id: 'vaultpass',   icon:'🔐', name:'VaultPass',       desc:'Zero-knowledge password manager. Your data never leaves your device.',          category:'Productivity',    score:22, trust:'green',  installs:'3.2k' },
  { id: 'stockpulse',  icon:'📈', name:'StockPulse',      desc:'Portfolio tracker with live prices, alerts, and portfolio analytics.',          category:'Finance',         score:31, trust:'yellow', installs:'1.8k' },
  { id: 'waveform',    icon:'🎵', name:'WaveForm',        desc:'Simple audio visualizer and recorder. Works fully offline.',                    category:'Entertainment',   score:4,  trust:'green',  installs:'920' },
  { id: 'langleap',    icon:'🌍', name:'LangLeap',        desc:'Flashcard-based language learning. Spaced repetition built-in.',                category:'Education',       score:9,  trust:'green',  installs:'6.1k' },
  { id: 'notevault',   icon:'🗂️', name:'NoteVault',       desc:'Markdown notes with offline sync. Clean, fast, private.',                      category:'Productivity',    score:7,  trust:'green',  installs:'4.3k' },
  { id: 'caltrack',    icon:'🍎', name:'CalTrack',        desc:'Simple calorie and macro tracker. No ads, no account.',                         category:'Health',          score:13, trust:'green',  installs:'9.1k' },
  { id: 'fincalc',     icon:'🧮', name:'FinCalc Pro',     desc:'Financial calculator suite — mortgage, tax, compound interest.',               category:'Finance',         score:6,  trust:'green',  installs:'7.8k' },
  { id: 'pixelrunner', icon:'🎮', name:'PixelRunner',     desc:'Endless runner game. PWA, installable, fully offline.',                        category:'Entertainment',   score:3,  trust:'green',  installs:'14k' },
]

export const CATEGORIES = ['All', 'Productivity', 'Finance', 'Health', 'Developer Tools', 'Entertainment', 'Education']

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
