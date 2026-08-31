'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { useAuth } from '@/lib/firebase/auth-context'

interface ParticipantItem {
  uid: string
  displayName: string
  headline: string
  skills: string[]
  capacity: string
  accepted: string
}

const sampleParticipants: ParticipantItem[] = [
  {
    uid: 'uid_2f9c',
    displayName: 'Ayo Mensah',
    headline: 'Grants accounting · nonprofit finance',
    skills: ['Budget Lead / Grants Accountant', 'Internal Control Owner', 'Cost allocation'],
    capacity: 'Limited · 12 h/wk',
    accepted: 'Stipend · Contract 1099 · Staff track',
  },
  {
    uid: 'uid_dana',
    displayName: 'Dana Whitfield',
    headline: 'Nonprofit CFO · SAM.gov Entity Administrator',
    skills: ['SAM.gov Entity Administrator', 'Single audit prep', 'Board reporting'],
    capacity: 'Open · 20 h/wk',
    accepted: 'Contract 1099 · Staff track',
  },
  {
    uid: 'uid_okonkwo',
    displayName: 'M. Okonkwo',
    headline: 'Subrecipient monitoring assistant & compliance analyst',
    skills: ['Subrecipient monitoring', '2 CFR 200', 'Grant compliance'],
    capacity: 'Open · 15 h/wk',
    accepted: 'Stipend · Contract 1099',
  },
]

export default function ParticipantsDirectoryPage() {
  const [query, setQuery] = useState('')
  const { user, signInWithGoogle } = useAuth()

  const filtered = sampleParticipants.filter(
    (p) =>
      p.displayName.toLowerCase().includes(query.toLowerCase()) ||
      p.headline.toLowerCase().includes(query.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <main>
      <Header />
      <section className="listing-hero">
        <span className="eyebrow">PARTICIPANT DIRECTORY</span>
        <h1>
          Verified talent &amp;<br />
          <em>institutional seat holders.</em>
        </h1>
        <p>Browse live CVs built from real engagements and verified institutional work history.</p>
      </section>

      <section className="listing">
        <div className="filter-row">
          <span>{filtered.length} Participants</span>
          <div>
            <input
              type="text"
              placeholder="Search by name, skill, or role..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                background: '#0b0b0c',
                border: '1px solid var(--line)',
                color: '#e8e3da',
                padding: '8px 16px',
                borderRadius: '100px',
                font: 'inherit',
                width: '280px',
              }}
            />
          </div>
        </div>

        <div className="op-grid">
          {filtered.map((p) => (
            <article className="op-card" key={p.uid}>
              <div className="op-top">
                <span className="status">
                  <i /> Published
                </span>
                <code>{p.uid}</code>
              </div>
              <h3>{p.displayName}</h3>
              <p>{p.headline}</p>
              <div className="tags">
                {p.skills.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <footer>
                <div>
                  <small>CAPACITY</small>
                  <strong>{p.capacity}</strong>
                </div>
                <div>
                  <small>ACCEPTS</small>
                  <strong>{p.accepted}</strong>
                </div>
                <Link href={`/participants/${p.uid}`}>View Live CV →</Link>
              </footer>
            </article>
          ))}
        </div>

        <div className="board-note" style={{ marginTop: '40px' }}>
          Want to offer your skills for BEAM Business engagements or institutional seats?
          {!user ? (
            <button
              onClick={() => signInWithGoogle()}
              className="solid-button"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              Create a profile
            </button>
          ) : (
            <Link href={`/participants/${user.uid}`} className="solid-button">
              View your profile
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}
