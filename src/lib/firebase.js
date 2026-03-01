import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "",
}

// IMPORTANT: do not crash app if env is missing
export const firebaseReady =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId

const isConfigured = firebaseReady

let app  = null
let auth = null
let db   = null

try {
  app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db   = getFirestore(app)
} catch (e) {
  console.error("Firebase initialization failed:", e)
}

const googleProvider = isConfigured ? new GoogleAuthProvider() : null
const githubProvider = isConfigured ? new GithubAuthProvider() : null

if (!firebaseReady) {
  console.warn("Firebase not configured. Running in limited mode.")
}

export { app, auth, db, googleProvider, githubProvider, isConfigured }
