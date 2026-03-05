import { Navigate } from 'react-router-dom'

function isMgmtAuthed() {
  try {
    const raw = localStorage.getItem('sl_mgmt_session')
    if (!raw) return false
    const s = JSON.parse(raw)
    if (!s || !s.ts) return false
    // session valid for 8 hours
    const age = Date.now() - Number(s.ts || 0)
    return age >= 0 && age < 8 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export default function ManagementRoute({ children }) {
  if (!isMgmtAuthed()) return <Navigate to="/management-login" replace />
  return children
}
