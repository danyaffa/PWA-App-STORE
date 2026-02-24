import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, setDoc,
  query, where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'

// ── Apps ────────────────────────────────────────────────────────────────────

export async function getPublishedApps() {
  const q = query(
    collection(db, 'apps'),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(100),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getAppBySlug(slug) {
  const q = query(collection(db, 'apps'), where('slug', '==', slug), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function getAppById(id) {
  const ref = doc(db, 'apps', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function getUserApps(uid) {
  const q = query(
    collection(db, 'apps'),
    where('developerUid', '==', uid),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createApp(data) {
  const ref = await addDoc(collection(db, 'apps'), {
    ...data,
    status: 'draft',
    safetyScore: null,
    downloads: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateApp(id, data) {
  const ref = doc(db, 'apps', id)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

// ── Users ───────────────────────────────────────────────────────────────────

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    role: 'user',
    createdAt: serverTimestamp(),
  })
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

// ── Reviews ─────────────────────────────────────────────────────────────────

export async function getReviewsForApp(appId) {
  const q = query(
    collection(db, 'reviews'),
    where('appId', '==', appId),
    orderBy('createdAt', 'desc'),
    limit(50),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createReview(data) {
  return addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

// ── Scans ───────────────────────────────────────────────────────────────────

export async function getScansForApp(appId) {
  const q = query(
    collection(db, 'scans'),
    where('appId', '==', appId),
    orderBy('createdAt', 'desc'),
    limit(20),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createScan(data) {
  return addDoc(collection(db, 'scans'), {
    ...data,
    result: 'pending',
    report: null,
    createdAt: serverTimestamp(),
  })
}
