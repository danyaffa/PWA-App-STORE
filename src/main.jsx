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

// Dismiss boot loader once React mounts
function dismissBootLoader() {
  clearTimeout(window.__bootTimer)
  const el = document.getElementById('boot-loader')
  if (el) {
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 350)
  }
}

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
  // Fallback: dismiss loader even if onMount callback isn't triggered
  setTimeout(dismissBootLoader, 500)
} catch (e) {
  console.error('Fatal render error:', e)
  // Clear stale SW and caches, then reload
  if ('caches' in window) {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)))
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(regs => regs.forEach(r => r.unregister()))
  }
  const loader = document.getElementById('boot-loader')
  if (loader) {
    loader.innerHTML =
      '<div style="text-align:center;padding:40px;max-width:480px">' +
      '<h1 style="font-size:1.3rem;margin-bottom:12px;color:#e8e8f0">Something went wrong</h1>' +
      '<p style="color:#7070a0;margin-bottom:20px">The app encountered an error: ' +
        (e.message || 'Unknown error') + '</p>' +
      '<button onclick="location.reload()" style="background:#00e5a0;color:#0a0a0f;border:none;' +
      'border-radius:8px;padding:12px 28px;font-weight:700;cursor:pointer">Reload</button></div>'
  }
}
