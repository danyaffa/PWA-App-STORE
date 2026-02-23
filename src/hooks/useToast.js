import { useState, useCallback, createElement } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, duration = 3000) => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration)
  }, [])

  const ToastContainer = () => {
    return createElement(
      'div',
      { style: { position:'fixed', bottom:30, right:30, zIndex:999, display:'flex', flexDirection:'column', gap:10 } },
      toasts.map(t =>
        createElement('div', { key: t.id, className: 'toast' }, t.msg)
      )
    )
  }

  return { toast, ToastContainer }
}
