import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import App from './App.jsx'
import './styles/global.css'

// Capture PWA install prompt for later use
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__pwaInstallPrompt = e
})

// Track whether React has rendered successfully
let reactMounted = false

// Dismiss boot loader once React mounts
function dismissBootLoader() {
  reactMounted = true
  clearTimeout(window.__bootTimer)
  const el = document.getElementById('boot-loader')
  if (el) {
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 350)
  }
}

// Show crash UI in the boot-loader (for errors that happen before/outside React)
function showCrashScreen(message) {
  const loader = document.getElementById('boot-loader')
  const root = document.getElementById('root')

  // If React already rendered, the ErrorBoundary handles it
  if (reactMounted && root && root.children.length > 0) return

  if (loader) {
    loader.style.opacity = '1'
    loader.innerHTML =
      '<div style="text-align:center;padding:40px;max-width:480px">' +
      '<h1 style="font-size:1.3rem;margin-bottom:12px;color:#e8e8f0">Something went wrong</h1>' +
      '<p style="color:#7070a0;margin-bottom:20px;word-break:break-word">' +
        (message || 'The app failed to load.') + '</p>' +
      '<button onclick="' +
        "caches.keys().then(function(k){k.forEach(function(n){caches.delete(n)})}).then(function(){" +
        "navigator.serviceWorker&&navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(sw){sw.unregister()})})" +
        "}).then(function(){location.reload()})" +
      '" style="background:#00e5a0;color:#0a0a0f;border:none;border-radius:8px;' +
      'padding:12px 28px;font-weight:700;cursor:pointer;font-size:.9rem;margin-bottom:12px">' +
      'Clear Cache &amp; Reload</button>' +
      '<p style="color:#7070a0;font-size:.8rem">Or try: Ctrl+Shift+R (hard refresh) or incognito mode.</p>' +
      '</div>'
  } else if (root) {
    // boot-loader was already removed — inject error UI into #root
    root.innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;' +
      'background:#0a0a0f;color:#e8e8f0;font-family:system-ui,sans-serif;padding:40px">' +
      '<div style="text-align:center;max-width:480px">' +
      '<h1 style="font-size:1.3rem;margin-bottom:12px">Something went wrong</h1>' +
      '<p style="color:#7070a0;margin-bottom:20px;word-break:break-word">' +
        (message || 'The app failed to load.') + '</p>' +
      '<button onclick="location.reload()" style="background:#00e5a0;color:#0a0a0f;border:none;' +
      'border-radius:8px;padding:12px 28px;font-weight:700;cursor:pointer">Reload</button>' +
      '</div></div>'
  }
}

// Global error handler — catches unhandled errors that bypass ErrorBoundary
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error || e.message)
  if (!reactMounted) {
    showCrashScreen(e.message || 'A JavaScript error occurred during startup.')
  }
})

// Global unhandled rejection handler — catches failed async operations
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled rejection:', e.reason)
  // Only show crash screen for startup failures; runtime rejections are non-fatal
  if (!reactMounted) {
    showCrashScreen(
      (e.reason?.message || String(e.reason) || 'An async error occurred during startup.')
    )
  }
})

// Service-worker health check: if a stale SW is serving broken assets, unregister it
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => {
      // If there's a waiting worker, activate it immediately
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
      // Listen for new SW that finishes installing
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing
        if (newSW) {
          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'activated') {
              window.location.reload()
            }
          })
        }
      })
    })
  }).catch(() => {})
}

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary onMount={dismissBootLoader}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  )
  // Fallback: dismiss loader after 3s if onMount hasn't fired
  // (gives React enough time to mount — old 500ms was too aggressive)
  setTimeout(() => {
    if (!reactMounted) dismissBootLoader()
  }, 3000)
} catch (e) {
  console.error('Fatal render error:', e)
  // Clear stale SW and caches
  if ('caches' in window) {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)))
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(regs => regs.forEach(r => r.unregister()))
  }
  showCrashScreen(e.message || 'Unknown error')
}
