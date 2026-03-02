// Vercel Serverless Function — GET /api/diagnostics
// Self-contained HTML diagnostics page. No SPA, no service worker dependency.
// Works in incognito, any browser, any device.

import admin from 'firebase-admin'

function getServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (b64) {
    try {
      const json = Buffer.from(b64, 'base64').toString('utf8')
      return { sa: JSON.parse(json), method: 'base64' }
    } catch (e) {
      return { sa: null, method: 'base64', error: e.message }
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (raw) {
    try {
      return { sa: JSON.parse(raw), method: 'json' }
    } catch (e) {
      return { sa: null, method: 'json', error: e.message }
    }
  }
  return { sa: null, method: 'none', error: 'No service account env var found' }
}

function getDb() {
  if (admin.apps.length) return admin.firestore()
  const { sa } = getServiceAccount()
  if (!sa) return null
  try {
    admin.initializeApp({ credential: admin.credential.cert(sa) })
    return admin.firestore()
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  const checks = {
    timestamp: new Date().toISOString(),
    env: {
      FIREBASE_SERVICE_ACCOUNT_BASE64: process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ? 'SET' : 'NOT SET',
      FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? 'SET' : 'NOT SET',
      VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY ? 'SET' : 'NOT SET',
      VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'NOT SET',
      VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || 'NOT SET',
      VITE_PAYPAL_CLIENT_ID: process.env.VITE_PAYPAL_CLIENT_ID || 'NOT SET',
      VITE_PAYPAL_ENV: process.env.VITE_PAYPAL_ENV || 'NOT SET',
      MGMT_SECRET: process.env.MGMT_SECRET ? 'SET' : 'NOT SET',
      SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
    },
    serviceAccount: {},
    firestore: {},
    apps: {},
  }

  // Check service account
  const saResult = getServiceAccount()
  if (saResult.sa) {
    checks.serviceAccount = {
      status: 'OK',
      method: saResult.method,
      projectId: saResult.sa.project_id || 'missing',
      clientEmail: saResult.sa.client_email || 'missing',
    }
  } else {
    checks.serviceAccount = {
      status: 'FAIL',
      method: saResult.method,
      error: saResult.error,
    }
  }

  // Check Firestore + load apps
  const db = getDb()
  if (!db) {
    checks.firestore = { status: 'FAIL', error: 'Could not initialize Admin SDK' }
    checks.apps = { status: 'SKIP', reason: 'No Firestore connection' }
  } else {
    try {
      const snap = await db.collection('apps').get()
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      checks.firestore = { status: 'OK', docsInAppsCollection: apps.length }
      checks.apps = {
        status: 'OK',
        totalCount: apps.length,
        appList: apps.map(a => ({
          id: a.id,
          name: a.name || '(no name)',
          url: a.url || '(no url)',
          status: a.status || '(no status)',
          createdAt: a.createdAt || a.publishedAt || '(no date)',
        })),
        hasAgentsLock: apps.some(a =>
          (a.name || '').toLowerCase().includes('agentslock') ||
          (a.name || '').toLowerCase().includes('agents lock')
        ),
      }
    } catch (e) {
      checks.firestore = { status: 'FAIL', error: e.message }
      checks.apps = { status: 'SKIP', reason: 'Firestore query failed' }
    }
  }

  // Determine overall health
  const allOk = checks.serviceAccount.status === 'OK' &&
    checks.firestore.status === 'OK' &&
    checks.apps.status === 'OK'

  // Notes / diagnosis
  const notes = []
  if (checks.apps.totalCount === 0) {
    notes.push('Firestore "apps" collection is EMPTY. No apps will show in any browser (normal or incognito).')
  }
  if (checks.apps.totalCount > 0 && !checks.apps.hasAgentsLock) {
    notes.push('AgentsLock was NOT found in Firestore. It may be stored only in localStorage on your original browser.')
  }
  if (checks.apps.hasAgentsLock) {
    notes.push('AgentsLock IS in Firestore. It should display in incognito via /api/apps.')
  }
  if (checks.serviceAccount.status === 'FAIL') {
    notes.push('Service account is broken. /api/apps cannot read Firestore. Fix: set FIREBASE_SERVICE_ACCOUNT_BASE64 in Vercel env vars.')
  }
  if (checks.env.VITE_PAYPAL_ENV === 'live') {
    notes.push('VITE_PAYPAL_ENV is set to "live" — this is correct for production PayPal.')
  }

  checks.notes = notes
  checks.overall = allOk ? 'HEALTHY' : 'UNHEALTHY'

  // Return as JSON if requested
  if (req.headers.accept?.includes('application/json') || req.query.format === 'json') {
    return res.status(200).json(checks)
  }

  // Otherwise return a full HTML page
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SafeLaunch Diagnostics</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
         background: #0a0a0f; color: #e0e0e0; padding: 20px; line-height: 1.6; }
  h1 { color: #00e5a0; margin-bottom: 8px; }
  h2 { color: #ccc; margin: 24px 0 10px; font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 6px; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-weight: bold; font-size: 14px; }
  .ok { background: #00e5a0; color: #000; }
  .fail { background: #ff4444; color: #fff; }
  .warn { background: #ffaa00; color: #000; }
  .card { background: #15151f; border: 1px solid #2a2a3a; border-radius: 10px; padding: 16px; margin: 10px 0; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #1a1a2a; flex-wrap: wrap; }
  .row:last-child { border-bottom: none; }
  .label { color: #888; min-width: 200px; }
  .val { color: #e0e0e0; font-family: monospace; word-break: break-all; }
  .val.set { color: #00e5a0; }
  .val.notset { color: #ff4444; }
  .app-row { background: #1a1a2a; border-radius: 8px; padding: 10px 14px; margin: 6px 0; }
  .app-name { color: #00e5a0; font-weight: bold; }
  .note { background: #1a1a2a; border-left: 3px solid #00e5a0; padding: 10px 14px; margin: 6px 0; border-radius: 0 8px 8px 0; }
  .note.warning { border-left-color: #ffaa00; }
  .note.error { border-left-color: #ff4444; }
  pre { background: #111; border: 1px solid #333; border-radius: 8px; padding: 14px; overflow: auto;
        max-height: 400px; font-size: 12px; margin-top: 12px; }
  button { background: #00e5a0; color: #000; border: none; padding: 10px 24px; border-radius: 8px;
           font-weight: bold; cursor: pointer; font-size: 14px; margin: 8px 8px 8px 0; }
  button:hover { background: #00cc8e; }
  button.secondary { background: #2a2a3a; color: #e0e0e0; }
  a { color: #00e5a0; }
  .timestamp { color: #666; font-size: 13px; }
</style>
</head>
<body>

<h1>SafeLaunch Diagnostics</h1>
<p class="timestamp">Generated: ${checks.timestamp}</p>
<p style="margin:8px 0">
  Overall: <span class="badge ${allOk ? 'ok' : 'fail'}">${checks.overall}</span>
</p>

<h2>Environment Variables</h2>
<div class="card">
  ${Object.entries(checks.env).map(([k, v]) => `
  <div class="row">
    <span class="label">${k}</span>
    <span class="val ${v === 'NOT SET' ? 'notset' : 'set'}">${v === 'NOT SET' ? 'NOT SET' : (v.length > 40 ? v.slice(0, 40) + '...' : v)}</span>
  </div>`).join('')}
</div>

<h2>Service Account</h2>
<div class="card">
  <div class="row">
    <span class="label">Status</span>
    <span class="badge ${checks.serviceAccount.status === 'OK' ? 'ok' : 'fail'}">${checks.serviceAccount.status}</span>
  </div>
  ${checks.serviceAccount.projectId ? `<div class="row"><span class="label">Project ID</span><span class="val">${checks.serviceAccount.projectId}</span></div>` : ''}
  ${checks.serviceAccount.clientEmail ? `<div class="row"><span class="label">Client Email</span><span class="val">${checks.serviceAccount.clientEmail}</span></div>` : ''}
  ${checks.serviceAccount.error ? `<div class="row"><span class="label">Error</span><span class="val notset">${checks.serviceAccount.error}</span></div>` : ''}
</div>

<h2>Firestore Connection</h2>
<div class="card">
  <div class="row">
    <span class="label">Status</span>
    <span class="badge ${checks.firestore.status === 'OK' ? 'ok' : 'fail'}">${checks.firestore.status}</span>
  </div>
  ${checks.firestore.docsInAppsCollection != null ? `<div class="row"><span class="label">Docs in "apps" collection</span><span class="val">${checks.firestore.docsInAppsCollection}</span></div>` : ''}
  ${checks.firestore.error ? `<div class="row"><span class="label">Error</span><span class="val notset">${checks.firestore.error}</span></div>` : ''}
</div>

<h2>Apps in Firestore (${checks.apps.totalCount || 0})</h2>
<div class="card">
  ${checks.apps.status !== 'OK'
    ? `<p class="val notset">${checks.apps.reason || checks.apps.error || 'Could not load apps'}</p>`
    : checks.apps.totalCount === 0
      ? '<p class="val notset">No apps found in Firestore. Publish an app first.</p>'
      : checks.apps.appList.map(a => `
        <div class="app-row">
          <span class="app-name">${a.name}</span>
          <span style="color:#888;margin-left:12px">ID: ${a.id}</span>
          ${a.url ? `<br><span style="color:#666;font-size:13px">${a.url}</span>` : ''}
        </div>`).join('')
  }
  ${checks.apps.hasAgentsLock ? '<div style="margin-top:10px"><span class="badge ok">AgentsLock FOUND</span></div>' : checks.apps.totalCount > 0 ? '<div style="margin-top:10px"><span class="badge fail">AgentsLock NOT FOUND</span></div>' : ''}
</div>

<h2>Notes</h2>
${notes.length === 0 ? '<div class="card"><p style="color:#888">No issues detected.</p></div>' : notes.map(n => `
  <div class="note ${n.includes('NOT') || n.includes('EMPTY') || n.includes('broken') ? 'warning' : ''}">${n}</div>
`).join('')}

<h2>Raw JSON</h2>
<button onclick="copyJSON()">Copy Full Report</button>
<button class="secondary" onclick="window.location.href='/store'">Go to Store</button>
<button class="secondary" onclick="window.location.href='/api/health'">API Health</button>
<button class="secondary" onclick="window.location.href='/api/apps'">/api/apps Raw</button>
<pre id="json">${JSON.stringify(checks, null, 2)}</pre>

<h2>Client-Side Checks</h2>
<div class="card" id="clientChecks">Running client-side checks...</div>

<script>
(async function() {
  const el = document.getElementById('clientChecks');
  const results = [];

  // localStorage
  try {
    const raw = localStorage.getItem('sl_published_apps');
    const apps = raw ? JSON.parse(raw) : [];
    results.push('localStorage sl_published_apps: ' + (Array.isArray(apps) ? apps.length + ' apps' : 'invalid'));
    if (Array.isArray(apps) && apps.length > 0) {
      results.push('  IDs: ' + apps.map(a => a.id).join(', '));
    }
  } catch(e) {
    results.push('localStorage: ' + e.message);
  }

  // Service worker
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      results.push('Service workers: ' + regs.length + ' registration(s)');
      regs.forEach((r, i) => {
        results.push('  SW' + i + ' scope: ' + r.scope);
        results.push('  SW' + i + ' active: ' + (r.active ? r.active.scriptURL : 'none'));
      });
    } else {
      results.push('Service workers: not supported');
    }
  } catch(e) {
    results.push('Service workers: ' + e.message);
  }

  // Caches
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      results.push('Cache storage keys: ' + (keys.length ? keys.join(', ') : '(empty)'));
    } else {
      results.push('Cache storage: not available');
    }
  } catch(e) {
    results.push('Cache storage: ' + e.message);
  }

  // Fetch /api/apps from client
  try {
    const r = await fetch('/api/apps?t=' + Date.now(), { cache: 'no-store' });
    const body = await r.json().catch(() => null);
    if (Array.isArray(body)) {
      results.push('Client fetch /api/apps: ' + r.status + ' — ' + body.length + ' apps');
      if (body.length > 0) {
        results.push('  IDs: ' + body.map(a => a.id).join(', '));
      }
    } else {
      results.push('Client fetch /api/apps: ' + r.status + ' — ' + JSON.stringify(body));
    }
  } catch(e) {
    results.push('Client fetch /api/apps: FAILED — ' + e.message);
  }

  // Incognito heuristic
  const hasStorage = 'storage' in navigator;
  const hasIDB = !!window.indexedDB;
  results.push('navigator.storage: ' + (hasStorage ? 'yes' : 'no'));
  results.push('indexedDB: ' + (hasIDB ? 'yes' : 'no'));
  results.push('navigator.onLine: ' + navigator.onLine);
  results.push('User-Agent: ' + navigator.userAgent);

  el.innerHTML = '<pre style="margin:0;white-space:pre-wrap">' + results.join('\\n') + '</pre>';
})();

function copyJSON() {
  const txt = document.getElementById('json').textContent;
  navigator.clipboard.writeText(txt).then(() => alert('Copied!')).catch(() => {
    const el = document.getElementById('json');
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    alert('Select all text in the JSON box and copy manually.');
  });
}
</script>

</body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  return res.status(200).send(html)
}
