import { useState, useCallback, useEffect } from 'react'

let toastFn = null

export function useToast() {
  return useCallback((msg, duration = 3000) => {
    if (toastFn) toastFn(msg, duration)
  }, [])
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastFn = (msg, duration) => {
      const id = Date.now()
      setToasts(t => [...t, { id, msg }])
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration)
    }
    return () => { toastFn = null }
  }, [])

  return (
    <div style={{ position:'fixed', bottom:30, right:30, zIndex:999, display:'flex', flexDirection:'column', gap:10 }}>
      {toasts.map(t => (
        <div key={t.id} className="toast">{t.msg}</div>
      ))}
    </div>
  )
}
