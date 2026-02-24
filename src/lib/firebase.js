import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Only initialize Firebase when the API key is actually set.
// Without this guard the app crashes on a black screen when env vars are missing.
const isConfigured = Boolean(firebaseConfig.apiKey)

let app  = null
let auth = null
let db   = null

if (isConfigured) {
  app  = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db   = getFirestore(app)
}

const googleProvider = isConfigured ? new GoogleAuthProvider() : null
const githubProvider = isConfigured ? new GithubAuthProvider() : null

export { app, auth, db, googleProvider, githubProvider, isConfigured }
