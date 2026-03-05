// FILE: src/pages/Diagnostics.jsx
import { useEffect, useMemo, useState } from "react"
import Nav from "../components/Nav.jsx"
import Footer from "../components/Footer.jsx"
import SEO from "../components/SEO.jsx"
import { loadPublishedApps, getAppsStoreStatus } from "../lib/appsStore.js"
import { isConfigured, firebaseReady, auth, db } from "../lib/firebase.js"

function nowISO() {
  try { return new Date().toISOString() } catch { return "" }
}

async function safeJson(res) {
  try { return await res.json() } catch { return null }
}

function detectIncognitoHeuristic() {
  const hasIDB = !!window.indexedDB
  const hasSW = "serviceWorker" in navigator
  const hasStorage = "storage" in navigator
  return {
    guess: (!hasStorage && hasIDB) ? "maybe" : "unknown",
    hasIndexedDB: hasIDB,
    hasServiceWorker: hasSW,
    hasStorageAPI: hasStorage,
  }
}

export default function Diagnostics() {
  const [running, setRunning] = useState(false)
  const [report, setReport] = useState(null)
  const [copyMsg, setCopyMsg] = useState("")

  const baseInfo = useMemo(() => {
    return {
      timeISO: nowISO(),
      locationHint: "Your current browser session",
      url: window.location.href,
      origin: window.location.origin,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      online: navigator.onLine,
      incognitoHeuristic: detectIncognitoHeuristic(),
    }
  }, [])

  async function runDiagnostics() {
    setRunning(true)
    setCopyMsg("")
    const startedAt = nowISO()

    const out = {
      startedAt,
      ...baseInfo,
      firebase: {
        firebaseReady,
        isConfigured,
        authPresent: !!auth,
        dbPresent: !!db,
      },
      appsStoreStatus: getAppsStoreStatus(),
      localStorage: {},
      serviceWorker: {},
      caches: {},
      api: {},
      apiHealth: {},
      firebaseClientRead: {},
      mergedApps: {},
      notes: [],
    }

    // 1) localStorage apps
    try {
      const raw = localStorage.getItem("sl_published_apps")
      const parsed = raw ? JSON.parse(raw) : []
      out.localStorage = {
        sl_published_apps_rawLength: raw ? raw.length : 0,
        sl_published_apps_count: Array.isArray(parsed) ? parsed.length : 0,
        sl_published_apps_ids: Array.isArray(parsed) ? parsed.map(a => a?.id).filter(Boolean).slice(0, 50) : [],
      }
    } catch (e) {
      out.localStorage = { error: e?.message || String(e) }
    }

    // 2) service worker registrations
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        out.serviceWorker = {
          registrations: regs.map(r => ({
            scope: r.scope,
            activeScriptURL: r.active?.scriptURL || null,
            installingScriptURL: r.installing?.scriptURL || null,
            waitingScriptURL: r.waiting?.scriptURL || null,
          })),
        }
      } else {
        out.serviceWorker = { supported: false }
      }
    } catch (e) {
      out.serviceWorker = { error: e?.message || String(e) }
    }

    // 3) caches keys
    try {
      if ("caches" in window) {
        const keys = await caches.keys()
        out.caches = { keys }
      } else {
        out.caches = { supported: false }
      }
    } catch (e) {
      out.caches = { error: e?.message || String(e) }
    }

    // 4) API /api/apps check (cache-buster + no-store)
    try {
      const url = `/api/apps?t=${Date.now()}`
      const res = await fetch(url, { cache: "no-store" })
      const body = await safeJson(res)

      out.api = {
        url,
        ok: res.ok,
        status: res.status,
        returnedType: Array.isArray(body) ? "array" : typeof body,
        returnedCount: Array.isArray(body) ? body.length : null,
        returnedIds: Array.isArray(body) ? body.map(a => a?.id).filter(Boolean).slice(0, 50) : null,
        bodyPreview: Array.isArray(body) ? null : body,
      }
    } catch (e) {
      out.api = { error: e?.message || String(e) }
    }

    // 5) API /api/health check (server-side diagnostics)
    try {
      const url = `/api/health?t=${Date.now()}`
      const res = await fetch(url, { cache: "no-store" })
      const body = await safeJson(res)
      out.apiHealth = {
        ok: res.ok,
        status: res.status,
        body,
      }
    } catch (e) {
      out.apiHealth = { error: e?.message || String(e) }
    }

    // 6) loadPublishedApps() (what the Store page actually uses)
    try {
      const merged = await loadPublishedApps()
      out.mergedApps = {
        ok: true,
        count: Array.isArray(merged) ? merged.length : 0,
        ids: Array.isArray(merged) ? merged.map(a => a?.id).filter(Boolean).slice(0, 80) : [],
        hasAgentsLock: Array.isArray(merged) ? merged.some(a => (a?.name || "").toLowerCase().includes("agentslock")) : false,
      }
    } catch (e) {
      out.mergedApps = { ok: false, error: e?.message || String(e) }
    }

    // 7) Interpret results
    if (out.api?.ok && out.api?.returnedCount === 0) {
      out.notes.push("API /api/apps returned 0 apps in this session. If normal browser returns >0, this points to caching/service-worker or different deployment/environment variables.")
    }
    if (!out.api?.ok) {
      out.notes.push("API /api/apps is failing in this session. Store will fall back to localStorage, which is empty in incognito.")
    }
    if (out.localStorage?.sl_published_apps_count > 0 && out.api?.returnedCount === 0) {
      out.notes.push("You have apps locally in this browser, but API returned none — that explains why incognito (empty localStorage) shows nothing.")
    }
    if (out.mergedApps?.ok && !out.mergedApps?.hasAgentsLock) {
      out.notes.push("loadPublishedApps() did not contain AgentsLock. Either it isn't in API response or it isn't saved under the expected collection/format.")
    }
    if (!firebaseReady) {
      out.notes.push("Firebase env vars look missing in this build (firebaseReady=false). That can break cloud sync in some sessions.")
    }
    if (out.apiHealth?.body?.status === "unhealthy") {
      out.notes.push("Server-side /api/health reports UNHEALTHY. Check the apiHealth section for details on what's misconfigured.")
    }

    out.finishedAt = nowISO()
    setReport(out)
    setRunning(false)
  }

  async function copyReport() {
    try {
      const txt = JSON.stringify(report, null, 2)
      await navigator.clipboard.writeText(txt)
      setCopyMsg("Report copied. Paste it to share.")
      setTimeout(() => setCopyMsg(""), 2500)
    } catch {
      setCopyMsg("Could not copy automatically. Select the report text and copy manually.")
      setTimeout(() => setCopyMsg(""), 3500)
    }
  }

  return (
    <>
      <SEO
        title="Diagnostics — SafeLaunch"
        description="Run diagnostics to verify Store publishing and cloud sync across browsers."
        canonical="https://agentslock.com/diagnostics"
      />
      <Nav />
      <div className="page-wrap">
        <div className="section-label">Tools</div>
        <h1 className="page-title">Diagnostics</h1>
        <p style={{ opacity: 0.8, maxWidth: 880 }}>
          This page checks: localStorage, service worker caches, <code>/api/apps</code> response,
          server health (<code>/api/health</code>), and the exact merged app list used by the Store.
          <br />
          Run this in <b>normal browser</b> and then in <b>incognito</b>, and compare.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <button
            className="btn-primary"
            onClick={runDiagnostics}
            disabled={running}
            style={{ minWidth: 200 }}
          >
            {running ? "Running..." : "Run Diagnostics"}
          </button>

          <button
            className="btn-secondary"
            onClick={copyReport}
            disabled={!report}
            style={{ minWidth: 200 }}
          >
            Copy Report JSON
          </button>

          <a className="btn-secondary" href="/store" style={{ minWidth: 200, textAlign: "center" }}>
            Go to Store
          </a>
        </div>

        {copyMsg ? (
          <div style={{ marginTop: 10, opacity: 0.9 }}>{copyMsg}</div>
        ) : null}

        <div style={{ marginTop: 22 }}>
          <h3 style={{ marginBottom: 10 }}>Result</h3>

          {!report ? (
            <div style={{ opacity: 0.7 }}>
              No report yet. Click <b>Run Diagnostics</b>.
            </div>
          ) : (
            <>
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: 14,
                  background: "rgba(0,0,0,0.35)",
                  overflow: "auto",
                  maxHeight: 520,
                }}
              >
                <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.4 }}>
{JSON.stringify(report, null, 2)}
                </pre>
              </div>

              {Array.isArray(report.notes) && report.notes.length ? (
                <div style={{ marginTop: 14 }}>
                  <h4 style={{ marginBottom: 8 }}>Quick Notes</h4>
                  <ul style={{ opacity: 0.9 }}>
                    {report.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
