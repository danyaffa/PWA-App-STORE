import { useState, useEffect, useCallback } from 'react'

/**
 * PWA Install Manager
 * Captures the browser's beforeinstallprompt event and provides
 * a one-click install experience — the killer feature.
 *
 * Returns:
 *   canInstall  — true when the browser's native install prompt is available
 *   install()   — triggers the native PWA install prompt
 *   installed   — true after user accepts the install
 *   isStandalone — true if already running as installed PWA
 */

let deferredPrompt = null

export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false)
  const [installed, setInstalled]   = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true
    setIsStandalone(standalone)

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
    if (deferredPrompt) setCanInstall(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return false
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setCanInstall(false)
      deferredPrompt = null
      return true
    }
    return false
  }, [])

  return { canInstall, install, installed, isStandalone }
}
