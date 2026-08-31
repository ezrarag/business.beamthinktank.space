import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  appId: string
  storageBucket: string
  messagingSenderId?: string
}

function getFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'beamthinktank.space',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'beam-think-tank',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'beam-think-tank.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  }
}

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApps()[0]!
  const config = getFirebaseConfig()
  return initializeApp(config)
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp())
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp())
}
