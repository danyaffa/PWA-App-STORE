/**
 * Developer Trust System
 * Computes trust scores dynamically based on developer activity.
 *
 * Trust Score (0–100):
 *   email verified:      +20
 *   agreement signed:    +20
 *   per successful app:  +10 (max 30)
 *   per violation:       −30
 */

import { db, isConfigured } from './firebase.js'

const TRUST_WEIGHTS = {
  emailVerified:     20,
  agreementAccepted: 20,
  perApp:            10,
  maxAppBonus:       30,
  perViolation:     -30,
}

export function computeTrustScore({ emailVerified = false, agreementAccepted = false, appsPublished = 0, violationsCount = 0 }) {
  let score = 0
  if (emailVerified)     score += TRUST_WEIGHTS.emailVerified
  if (agreementAccepted) score += TRUST_WEIGHTS.agreementAccepted
  score += Math.min(appsPublished * TRUST_WEIGHTS.perApp, TRUST_WEIGHTS.maxAppBonus)
  score += violationsCount * TRUST_WEIGHTS.perViolation
  return Math.max(0, Math.min(100, score))
}

export function getTrustLevel(score) {
  if (score >= 70) return { level: 'trusted', label: 'Trusted', color: 'var(--accent)' }
  if (score >= 40) return { level: 'verified', label: 'Verified', color: 'var(--accent2)' }
  return { level: 'basic', label: 'Basic', color: 'var(--muted)' }
}

export async function getDeveloperProfile(uid) {
  if (!isConfigured || !db) {
    return getLocalDeveloperProfile(uid)
  }
  try {
    const { doc, getDoc } = await import('firebase/firestore')
    const snap = await getDoc(doc(db, 'developers', uid))
    if (snap.exists()) return snap.data()
    return getLocalDeveloperProfile(uid)
  } catch {
    return getLocalDeveloperProfile(uid)
  }
}

export async function updateDeveloperProfile(uid, data) {
  if (!isConfigured || !db) {
    localStorage.setItem(`sl_dev_${uid}`, JSON.stringify(data))
    return
  }
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
    await setDoc(doc(db, 'developers', uid), {
      ...data,
      trustScore: computeTrustScore(data),
      updatedAt: serverTimestamp(),
    }, { merge: true })
  } catch (err) {
    console.error('Failed to update developer profile:', err)
    localStorage.setItem(`sl_dev_${uid}`, JSON.stringify(data))
  }
}

function getLocalDeveloperProfile(uid) {
  try {
    const stored = localStorage.getItem(`sl_dev_${uid}`)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore corrupted localStorage */ }
  return {
    emailVerified: false,
    agreementAccepted: false,
    appsPublished: 0,
    violationsCount: 0,
    trustScore: 0,
    verificationLevel: 'basic',
  }
}
