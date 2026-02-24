import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider, githubProvider, isConfigured } from '../lib/firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Firebase is not configured, skip auth listener and just finish loading
    if (!isConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  async function login(email, password) {
    if (!isConfigured) throw new Error('Firebase is not configured')
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email, password, displayName) {
    if (!isConfigured) throw new Error('Firebase is not configured')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    return cred
  }

  async function loginWithGoogle() {
    if (!isConfigured) throw new Error('Firebase is not configured')
    return signInWithPopup(auth, googleProvider)
  }

  async function loginWithGithub() {
    if (!isConfigured) throw new Error('Firebase is not configured')
    return signInWithPopup(auth, githubProvider)
  }

  async function logout() {
    if (!isConfigured) throw new Error('Firebase is not configured')
    return signOut(auth)
  }

  async function resetPassword(email) {
    if (!isConfigured) throw new Error('Firebase is not configured')
    return sendPasswordResetEmail(auth, email)
  }

  const value = {
    user,
    loading,
    isConfigured,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
