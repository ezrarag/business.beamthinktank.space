'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase/client'
import type { BusinessParticipantProfile } from '@/lib/business/types'

interface AuthContextType {
  user: User | null
  profile: BusinessParticipantProfile | null
  loading: boolean
  signInWithGoogle: (redirectPath?: string) => Promise<void>
  signOutUser: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<BusinessParticipantProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchOrCreateProfile = async (firebaseUser: User): Promise<BusinessParticipantProfile> => {
    const db = getFirebaseDb()
    const docRef = doc(db, 'businessParticipants', firebaseUser.uid)
    const snap = await getDoc(docRef)

    if (snap.exists()) {
      return snap.data() as BusinessParticipantProfile
    }

    const timestamp = new Date().toISOString()
    const newProfile: BusinessParticipantProfile = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Participant',
      headline: 'Grants accounting · nonprofit finance',
      bio: 'Participant profile on BEAM Business division.',
      skills: ['Budget Lead / Grants Accountant', 'Cost allocation', 'Nonprofit finance'],
      portfolioItems: [],
      capacity: 'open',
      hoursPerWeekAvailable: 15,
      acceptedEngagementTypes: ['contract_1099', 'stipend'],
      institutionalAffiliations: [],
      endorsements: [],
      visibility: 'public',
      profileStatus: 'published',
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    try {
      await setDoc(docRef, newProfile)
    } catch (e) {
      console.warn('Could not persist profile to Firestore, using local state profile', e)
    }
    return newProfile
  }

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        try {
          const prof = await fetchOrCreateProfile(currentUser)
          setProfile(prof)
        } catch (e) {
          console.error('Error fetching profile:', e)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const refreshProfile = async () => {
    if (!user) return
    try {
      const prof = await fetchOrCreateProfile(user)
      setProfile(prof)
    } catch (e) {
      console.error('Error refreshing profile:', e)
    }
  }

  const signInWithGoogle = async (redirectPath?: string) => {
    try {
      const auth = getFirebaseAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user
      setUser(firebaseUser)
      const prof = await fetchOrCreateProfile(firebaseUser)
      setProfile(prof)
      
      const target = redirectPath || `/participants/${firebaseUser.uid}`
      router.push(target)
    } catch (error) {
      console.error('Google Sign-In Error:', error)
    }
  }

  const signOutUser = async () => {
    try {
      const auth = getFirebaseAuth()
      await signOut(auth)
      setUser(null)
      setProfile(null)
      router.push('/')
    } catch (error) {
      console.error('Sign-Out Error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOutUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
