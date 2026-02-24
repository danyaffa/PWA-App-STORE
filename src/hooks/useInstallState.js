import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'installedApps'

function getInstalled() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

export function useInstallState(appId) {
  const [installed, setInstalled] = useState(() => getInstalled().includes(appId))

  useEffect(() => {
    // Listen for installs from other components on the same page
    function onInstallChange(e) {
      if (e.detail?.appId === appId) setInstalled(true)
    }
    // Listen for storage changes (cross-tab sync)
    function onStorage(e) {
      if (e.key === STORAGE_KEY) setInstalled(getInstalled().includes(appId))
    }
    window.addEventListener('app-installed', onInstallChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('app-installed', onInstallChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [appId])

  const install = useCallback(() => {
    const list = getInstalled()
    if (!list.includes(appId)) {
      list.push(appId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    }
    setInstalled(true)
    // Notify all other components on this page
    window.dispatchEvent(new CustomEvent('app-installed', { detail: { appId } }))
  }, [appId])

  return { installed, install }
}
