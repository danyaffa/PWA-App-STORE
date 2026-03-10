import { useEffect, useRef, useState } from 'react'

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID
const PAYPAL_ENV       = import.meta.env.VITE_PAYPAL_ENV || 'sandbox'

export default function PayPalButton({ amount, currency = 'USD', description, onSuccess, onError }) {
  const containerRef = useRef()
  const buttonsRef   = useRef(null)
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
    script.onerror = () => setError('Failed to load PayPal SDK. Please refresh the page.')
    document.body.appendChild(script)

    return () => { if (document.body.contains(script)) document.body.removeChild(script) }
  }, [currency])

  useEffect(() => {
    if (!sdkReady || !containerRef.current) return

    // Close previous button instance before rendering a new one
    if (buttonsRef.current && typeof buttonsRef.current.close === 'function') {
      buttonsRef.current.close()
    }
    containerRef.current.innerHTML = ''

    const buttons = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },

      createOrder: async () => {
        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, currency, description }),
        })
        const data = await res.json()
        if (!res.ok) {
          const msg = data.error || 'Order creation failed'
          setError(msg)
          throw new Error(msg)
        }
        return data.id
      },

      onApprove: async (data) => {
        const res = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderID }),
        })
        const capture = await res.json()
        if (!res.ok) {
          const msg = capture.error || 'Payment capture failed'
          setError(msg)
          throw new Error(msg)
        }
        setError(null)
        onSuccess?.(capture)
      },

      onError: (err) => {
        console.error('PayPal error:', err)
        const msg = err?.message || 'Payment failed. Please try again.'
        setError(msg)
        onError?.(err)
      },

      onCancel: () => {
        setError('Payment was cancelled. You can try again below.')
      },
    })

    buttons.render(containerRef.current)
    buttonsRef.current = buttons

    return () => {
      if (buttonsRef.current && typeof buttonsRef.current.close === 'function') {
        buttonsRef.current.close()
      }
    }
  }, [sdkReady, amount, currency, description])

  if (error) {
    return (
      <div>
        <div style={{ color: '#ef4444', fontSize: '0.85rem', padding: '12px 0', background: 'rgba(239,68,68,0.08)', borderRadius: 8, textAlign: 'center', marginBottom: 12 }}>
          {error}
        </div>
        <div ref={containerRef} />
      </div>
    )
  }

  if (!sdkReady) {
    return <div style={{ color: 'var(--muted)', fontSize: '0.85rem', padding: '12px 0' }}>Loading PayPal...</div>
  }

  return <div ref={containerRef} />
}
