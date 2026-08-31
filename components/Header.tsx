'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth-context'

export function Header() {
  const { user, profile, signInWithGoogle, signOutUser } = useAuth()

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'My Profile'
  const userProfilePath = user ? `/participants/${user.uid}` : '/participants/uid_2f9c'

  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="BEAM Business home">
        BEAM <span>· BUSINESS</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/opportunities">Opportunities</Link>
        <Link href="/admin/seats">Institutional Seats</Link>
        <Link href="/participants">Participants</Link>
        <Link href="/#about">About the Division</Link>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {user ? (
          <>
            <Link href="/workspace" className="signin" style={{ color: 'var(--copper)', fontWeight: 600 }}>
              Workspace
            </Link>
            <Link href={userProfilePath} className="signin">
              {displayName}
            </Link>
            <button
              onClick={() => signOutUser()}
              className="outline-button"
              style={{ background: 'transparent', cursor: 'pointer' }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => signInWithGoogle('/workspace')}
              className="signin"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              Sign in
            </button>
            <button
              onClick={() => signInWithGoogle()}
              className="outline-button"
              style={{ cursor: 'pointer' }}
            >
              Create a profile
            </button>
          </>
        )}
      </div>
    </header>
  )
}
