import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

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

  // When Firebase is not configured, allow access so the demo works
  if (!isConfigured) return children

  if (!user) return <Navigate to="/signin" replace />

  return children
}
