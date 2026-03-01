import { useState, useEffect, useCallback } from 'react'

/**
 * PWA Install Manager
 * Captures the browser's beforeinstallprompt event and provides
 * a one-click install experience on every platform.
 *
 * Returns:
 *   canInstall   — true when the browser's native install prompt is available
 *   install()    — triggers native install OR shows iOS instructions
 *   installed    — true after user accepts the install
 *   isStandalone — true if already running as installed PWA
 *   platform     — 'ios' | 'android' | 'desktop'
 *   isIOS        — true on iPhone/iPad
 *   showIOSGuide — true when iOS share-sheet instructions should be visible
 *   dismissIOSGuide() — hides the iOS instructions overlay
 */

let deferredPrompt = null

function detectPlatform() {
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'ios'
  }
  if (/Android/i.test(ua)) {
    return 'android'
  }
  return 'desktop'
}

export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false)
  const [installed, setInstalled]   = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const platform = detectPlatform()
  const isIOS = platform === 'ios'

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true
    setIsStandalone(standalone)
    if (standalone) {
      setInstalled(true)
      return
    }

    function onBeforeInstall(e) {
      e.preventDefault()
      deferredPrompt = e
      setCanInstall(true)
    }

    function onAppInstalled() {
      deferredPrompt = null
      setCanInstall(false)
      setInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onAppInstalled)

    // If prompt was already captured before this hook mounted
    if (window.__pwaInstallPrompt) {
      deferredPrompt = window.__pwaInstallPrompt
      setCanInstall(true)
    }

    // On iOS, the native prompt never fires but we can still "install"
    if (isIOS && !standalone) {
      setCanInstall(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [isIOS])

  const install = useCallback(async () => {
    // Already installed
    if (installed || isStandalone) return true

    // Native prompt available (Chrome, Edge, Samsung Internet, etc.)
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        // Clear consumed prompt regardless of outcome
        deferredPrompt = null
        window.__pwaInstallPrompt = null
        if (outcome === 'accepted') {
          setInstalled(true)
          setCanInstall(false)
          return true
        }
      } catch {
        // Prompt was already used / consumed — clear it
        deferredPrompt = null
        window.__pwaInstallPrompt = null
      }
      return false
    }

    // iOS — show the simple share-sheet guide
    if (isIOS) {
      setShowIOSGuide(true)
      return false
    }

    return false
  }, [installed, isStandalone, isIOS])

  const dismissIOSGuide = useCallback(() => {
    setShowIOSGuide(false)
  }, [])

  return {
    canInstall,
    install,
    installed,
    isStandalone,
    platform,
    isIOS,
    showIOSGuide,
    dismissIOSGuide,
  }
}
