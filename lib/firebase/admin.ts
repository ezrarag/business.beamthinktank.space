import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function initialize() {
  if (getApps().length) return getApps()[0]
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (projectId && clientEmail && privateKey) return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId })
  if (process.env.NODE_ENV !== 'production') return initializeApp({ credential: applicationDefault(), projectId })
  return null
}

const app = initialize()
export const adminDb = app ? getFirestore(app) : null
export const adminAuth = app ? getAuth(app) : null

export function requireAdminDb() {
  if (!adminDb) throw new Error('Firebase Admin is not configured. Add the FIREBASE_ADMIN_* environment variables.')
  return adminDb
}
