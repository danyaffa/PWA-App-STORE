import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * Makes a fixed-position element draggable via mouse and touch.
 * Persists position to localStorage under the given storageKey.
 *
 * @param {string} storageKey - localStorage key for saving position
 * @param {{ bottom: number, right: number }} defaultPos - initial position
 * @returns {{ ref, style, onPointerDown }} - spread onto the draggable element
 */
export function useDraggable(storageKey, defaultPos = { bottom: 24, right: 24 }) {
  const ref = useRef(null)
  const dragging = useRef(false)
  const moved = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const [pos, setPos] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return defaultPos
  })

  // Save position on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(pos))
    } catch { /* ignore */ }
  }, [storageKey, pos])

  const onPointerDown = useCallback((e) => {
    // Only respond to primary button / single touch
    if (e.button && e.button !== 0) return

    const el = ref.current
    if (!el) return

    dragging.current = true
    moved.current = false

    const rect = el.getBoundingClientRect()
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    el.setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [])

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return

    moved.current = true

    const el = ref.current
    if (!el) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const rect = el.getBoundingClientRect()

    // Calculate new position (right/bottom from viewport edges)
    let newRight = vw - (e.clientX - offset.current.x + rect.width)
    let newBottom = vh - (e.clientY - offset.current.y + rect.height)

    // Clamp to viewport
    newRight = Math.max(8, Math.min(vw - rect.width - 8, newRight))
    newBottom = Math.max(8, Math.min(vh - rect.height - 8, newBottom))

    setPos({ bottom: Math.round(newBottom), right: Math.round(newRight) })
  }, [])

  const onPointerUp = useCallback((e) => {
    if (!dragging.current) return
    dragging.current = false

    // If we moved, prevent the click from firing
    if (moved.current) {
      const el = ref.current
      if (el) {
        const suppress = (evt) => {
          evt.stopPropagation()
          evt.preventDefault()
        }
        el.addEventListener('click', suppress, { capture: true, once: true })
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [onPointerMove, onPointerUp])

  const style = {
    position: 'fixed',
    bottom: pos.bottom,
    right: pos.right,
    touchAction: 'none',
    userSelect: 'none',
  }

  return { ref, style, onPointerDown }
}
