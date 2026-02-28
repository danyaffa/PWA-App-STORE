import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function hasLocalSession() {
  try {
    const raw = localStorage.getItem('sl_auth')
    if (!raw) return false
    const data = JSON.parse(raw)
    return Boolean(data?.email)
  } catch {
    return false
  }
}

export default function ProtectedRoute({ children }) {
  const { user, loading, isConfigured } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', color: 'var(--muted)', fontSize: '0.9rem',
      }}>
        Loading...
      </div>
    )
  }

  // When Firebase is not configured, fall back to localStorage session
  if (!isConfigured) {
    return hasLocalSession() ? children : <Navigate to="/signin" replace />
  }

  if (!user) return <Navigate to="/signin" replace />

  return children
}
