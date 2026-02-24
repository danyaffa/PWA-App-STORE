import { useEffect, useRef, useState } from 'react'

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID
const PAYPAL_ENV       = import.meta.env.VITE_PAYPAL_ENV || 'sandbox'

export default function PayPalButton({ amount, currency = 'USD', description, onSuccess, onError }) {
  const containerRef = useRef()
  const [sdkReady, setSdkReady] = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID) {
      setError('PayPal is not configured yet.')
      return
    }
    if (window.paypal) { setSdkReady(true); return }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}`
    script.async = true
    script.onload  = () => setSdkReady(true)
    script.onerror = () => setError('Failed to load PayPal SDK.')
    document.body.appendChild(script)

    return () => { if (document.body.contains(script)) document.body.removeChild(script) }
  }, [currency])

  useEffect(() => {
    if (!sdkReady || !containerRef.current) return
    containerRef.current.innerHTML = ''

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },

      createOrder: async () => {
        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, currency, description }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Order creation failed')
        return data.id
      },

      onApprove: async (data) => {
        const res = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderID }),
        })
        const capture = await res.json()
        if (!res.ok) throw new Error(capture.error || 'Capture failed')
        onSuccess?.(capture)
      },

      onError: (err) => {
        console.error('PayPal error:', err)
        onError?.(err)
      },
    }).render(containerRef.current)
  }, [sdkReady, amount, currency, description])

  if (error) {
    return <div style={{ color: 'var(--muted)', fontSize: '0.85rem', padding: '12px 0' }}>{error}</div>
  }

  if (!sdkReady) {
    return <div style={{ color: 'var(--muted)', fontSize: '0.85rem', padding: '12px 0' }}>Loading PayPal...</div>
  }

  return <div ref={containerRef} />
}
