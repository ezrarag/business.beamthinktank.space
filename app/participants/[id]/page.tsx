'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { useAuth } from '@/lib/firebase/auth-context'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase/client'
import type { BusinessParticipantProfile } from '@/lib/business/types'

const defaultAyoProfile: BusinessParticipantProfile = {
  uid: 'uid_2f9c',
  displayName: 'Ayo Mensah',
  headline: 'Grants accounting · nonprofit finance',
  bio: 'Nine years closing books for arts nonprofits, four of them on federally funded programs. I build budgets that hold up under audit and teach the people around me to read them.',
  skills: [
    'Budget Lead / Grants Accountant',
    'Internal Control Owner',
    'Cost allocation',
    'Single audit prep',
    'Board reporting',
  ],
  portfolioItems: [
    {
      id: 'p1',
      title: 'FY26 federal budget & cost allocation plan',
      description: 'Built the award-line mapping and indirect rate memo adopted by the finance committee.',
      engagementId: 'eng_4b71',
      addedAt: '2026-06-15',
    },
    {
      id: 'p2',
      title: 'Subrecipient monitoring file — orchestra pass-through',
      description: 'Risk assessment, monitoring schedule and closeout checklist under 2 CFR 200.332.',
      engagementId: 'eng_51a0',
      addedAt: '2026-07-20',
    },
  ],
  capacity: 'limited',
  hoursPerWeekAvailable: 12,
  acceptedEngagementTypes: ['stipend', 'contract_1099', 'staff_track'],
  institutionalAffiliations: [
    { divisionOrPartner: 'Black Diaspora Orchestra', role: 'Finance volunteer · hosted under orchestra', current: true },
    { divisionOrPartner: 'BEAM Institute Corporation', role: 'Internal Control Owner · institutional seat', current: true },
    { divisionOrPartner: 'Grounds Cooperative', role: 'Budget reviewer', current: false },
  ],
  endorsements: [
    {
      fromUid: 'uid_dana',
      fromName: 'Dana Whitfield',
      engagementId: 'eng_4b71',
      text: 'Ayo rebuilt our allocation plan in three weeks and the auditors had no findings on cost principles. Plain-language explanations for the board too.',
      createdAt: '2026-03-12',
    },
    {
      fromUid: 'uid_okonkwo',
      fromName: 'M. Okonkwo',
      engagementId: 'eng_51a0',
      text: 'Held the subrecipient file to a standard we could hand a federal monitor without edits.',
      createdAt: '2026-06-02',
    },
  ],
  visibility: 'public',
  profileStatus: 'published',
  createdAt: '2026-01-10',
  updatedAt: '2026-08-20',
}

export default function DynamicParticipantProfile() {
  const params = useParams()
  const id = (params?.id as string) || 'uid_2f9c'
  const { user, profile: myProfile, refreshProfile, signInWithGoogle } = useAuth()
  
  const [profileData, setProfileData] = useState<BusinessParticipantProfile | null>(
    id === 'uid_2f9c' ? defaultAyoProfile : null
  )
  const [isEditing, setIsEditing] = useState(false)
  const [editHeadline, setEditHeadline] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editSkills, setEditSkills] = useState('')
  const [saving, setSaving] = useState(false)

  const isOwner = user?.uid === id

  useEffect(() => {
    async function load() {
      if (id === 'uid_2f9c') {
        setProfileData(defaultAyoProfile)
        return
      }
      if (user?.uid === id && myProfile) {
        setProfileData(myProfile)
        return
      }
      try {
        const db = getFirebaseDb()
        const snap = await getDoc(doc(db, 'businessParticipants', id))
        if (snap.exists()) {
          setProfileData(snap.data() as BusinessParticipantProfile)
        } else if (user && user.uid === id) {
          setProfileData(myProfile)
        } else {
          // fallback to Ayo or default structure for display
          setProfileData({
            ...defaultAyoProfile,
            uid: id,
            displayName: 'BEAM Participant',
          })
        }
      } catch (e) {
        console.error('Error loading participant profile:', e)
        setProfileData(defaultAyoProfile)
      }
    }
    load()
  }, [id, user, myProfile])

  const handleOpenEdit = () => {
    if (!profileData) return
    setEditHeadline(profileData.headline)
    setEditBio(profileData.bio)
    setEditSkills(profileData.skills.join(', '))
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!user || !profileData) return
    setSaving(true)
    const skillsArray = editSkills.split(',').map((s) => s.trim()).filter(Boolean)
    const updated: Partial<BusinessParticipantProfile> = {
      headline: editHeadline,
      bio: editBio,
      skills: skillsArray,
      updatedAt: new Date().toISOString(),
    }
    try {
      const db = getFirebaseDb()
      await updateDoc(doc(db, 'businessParticipants', user.uid), updated)
      await refreshProfile()
      setProfileData({ ...profileData, ...updated } as BusinessParticipantProfile)
      setIsEditing(false)
    } catch (e) {
      console.error('Error saving profile:', e)
      setProfileData({ ...profileData, ...updated } as BusinessParticipantProfile)
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const p = profileData || defaultAyoProfile
  const initials = p.displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <main className="profile-page">
      <Header />
      <div className="profile-top">
        <span className="wordmark" style={{ fontSize: '18px' }}>
          {p.displayName}
        </span>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span>
            {p.profileStatus === 'published' ? 'Published' : 'Draft'} · Visibility: {p.visibility}
          </span>
          <code style={{ fontSize: '10px' }}>businessParticipants/{p.uid}</code>
        </div>
      </div>

      <div className="profile-layout">
        <aside>
          <div className="portrait">{initials}</div>
          <code>businessParticipants/{p.uid}</code>
          <h1>{p.displayName.split(' ')[0]}<br />{p.displayName.split(' ').slice(1).join(' ')}</h1>
          <h3>{p.headline}</h3>
          <p>{p.bio}</p>
          <dl>
            <div>
              <dt>Capacity</dt>
              <dd>
                {p.capacity === 'limited' ? `Limited · ${p.hoursPerWeekAvailable || 12} h/wk` : p.capacity}
              </dd>
            </div>
            <div>
              <dt>Accepts</dt>
              <dd>{p.acceptedEngagementTypes.join(' · ')}</dd>
            </div>
          </dl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            {!user ? (
              <button onClick={() => signInWithGoogle(`/participants/${p.uid}`)} className="solid-button">
                Sign in to send offer
              </button>
            ) : isOwner ? (
              <button onClick={handleOpenEdit} className="solid-button">
                Edit profile
              </button>
            ) : (
              <Link href="/workspace" className="solid-button">
                Send direct offer
              </Link>
            )}
          </div>
        </aside>

        <section>
          {isEditing && (
            <div
              style={{
                marginBottom: '30px',
                padding: '24px',
                border: '1px solid var(--copper)',
                borderRadius: '16px',
                background: 'rgba(192,138,90,0.08)',
              }}
            >
              <h3 style={{ margin: '0 0 16px', color: 'var(--copper)' }}>Edit Your Profile</h3>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '12px' }}>
                Headline:
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginTop: '4px',
                    background: '#0b0b0c',
                    color: '#e8e3da',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                  }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '12px' }}>
                Bio:
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginTop: '4px',
                    background: '#0b0b0c',
                    color: '#e8e3da',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                  }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '16px', fontSize: '12px' }}>
                Skills (comma separated):
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginTop: '4px',
                    background: '#0b0b0c',
                    color: '#e8e3da',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                  }}
                />
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="solid-button"
                  style={{ cursor: 'pointer' }}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="plain-button"
                  style={{ cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <ProfileSection title="Skills">
            <div className="tags large">
              {p.skills.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </ProfileSection>

          <ProfileSection
            title="Portfolio"
            meta={`${p.portfolioItems.length} items · ${p.portfolioItems.filter((i) => i.engagementId).length} tied to engagements`}
          >
            {p.portfolioItems.length > 0 ? (
              p.portfolioItems.map((item) => (
                <Record
                  key={item.id}
                  title={item.title}
                  text={item.description}
                  tag={item.engagementId ? `From engagement ${item.engagementId}` : 'Independent artifact'}
                />
              ))
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>No portfolio items added yet.</p>
            )}
          </ProfileSection>

          <ProfileSection title="Institutional affiliations">
            {p.institutionalAffiliations.length > 0 ? (
              p.institutionalAffiliations.map((aff) => (
                <Record
                  key={aff.divisionOrPartner}
                  title={aff.divisionOrPartner}
                  text={aff.role}
                  tag={aff.current ? 'Current' : 'Past'}
                />
              ))
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>No affiliations listed.</p>
            )}
          </ProfileSection>

          <ProfileSection title="Endorsements" meta="Server-written on completion">
            {p.endorsements.length > 0 ? (
              p.endorsements.map((end) => (
                <blockquote key={end.createdAt}>
                  "{end.text}"
                  <cite>
                    {end.fromName} · {end.engagementId} · completed {end.createdAt}
                  </cite>
                </blockquote>
              ))
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>No endorsements recorded yet.</p>
            )}
          </ProfileSection>
        </section>
      </div>
    </main>
  )
}

function ProfileSection({
  title,
  meta,
  children,
}: {
  title: string
  meta?: string
  children: React.ReactNode
}) {
  return (
    <div className="profile-section">
      <div className="section-title">
        <h2>{title}</h2>
        <span>{meta}</span>
      </div>
      {children}
    </div>
  )
}

function Record({ title, text, tag }: { title: string; text: string; tag: string }) {
  return (
    <div className="profile-record">
      <h3>{title}</h3>
      <p>{text}</p>
      <span>{tag}</span>
    </div>
  )
}
