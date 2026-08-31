'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { useAuth } from '@/lib/firebase/auth-context'

interface BoardOpportunity {
  id: string
  title: string
  subtitle: string
  commitment: string
  compensation: string
  type: 'public' | 'internal'
  category: 'micro' | 'project' | 'ongoing_role' | 'grants_adjacent'
}

const allRows: BoardOpportunity[] = [
  {
    id: 'op_8fk2',
    title: 'Budget Lead / Grants Accountant — FY27 federal application cycle',
    subtitle: 'BEAM Division · business · linked role: GRANT_ROLES.budget_lead',
    commitment: 'Recurring part time',
    compensation: 'Contract 1099 · $45/hr',
    type: 'public',
    category: 'grants_adjacent',
  },
  {
    id: 'op_sam',
    title: 'SAM.gov Entity Administrator — renewal & annual representations',
    subtitle: 'BEAM Division · business · institutional seat · beam_internal',
    commitment: 'Ongoing role',
    compensation: 'Stipend · $500 flat / cycle',
    type: 'internal',
    category: 'ongoing_role',
  },
  {
    id: 'op_program',
    title: 'Season program one-pager — copy, layout, print handoff',
    subtitle: 'Institutional partner · Black Diaspora Orchestra · hosted under orchestra',
    commitment: 'Micro',
    compensation: 'Stipend · $250 flat',
    type: 'public',
    category: 'micro',
  },
  {
    id: 'op_ico',
    title: 'Internal Control Owner — segregation of duties documentation',
    subtitle: 'BEAM Division · business · institutional seat · beam_internal',
    commitment: 'Ongoing role',
    compensation: 'Staff track · TBD',
    type: 'internal',
    category: 'ongoing_role',
  },
  {
    id: 'op_subrecipient',
    title: 'Subrecipient monitoring assistant — 2 CFR 200.332 file build',
    subtitle: 'BEAM Division · business · pass-through engagement expected',
    commitment: 'Project',
    compensation: 'Contract 1099 · $1,800 flat',
    type: 'public',
    category: 'project',
  },
]

export default function Home() {
  const [filter, setFilter] = useState<string>('all')
  const { user, signInWithGoogle } = useAuth()

  const filteredRows = allRows.filter((r) => {
    if (filter === 'all') return true
    return r.category === filter
  })

  return (
    <main>
      <Header />
      <section className="mock-hero">
        <div>
          <span className="eyebrow">Division 04 · Business development &amp; institutional operations</span>
          <h1>BUSINESS</h1>
          <p>
            Real engagements inside one legal entity. Build a public profile, take work from one-off tasks up to the
            institutional seats that let BEAM receive and account for money — recorded as work history, not a
            simulation.
          </p>
        </div>
        <div className="mock-actions">
          <Link className="solid-button" href="/opportunities">
            Browse 24 open opportunities
          </Link>
          <Link href="/workspace">How engagements work ↗</Link>
        </div>
        <div className="seat-meter">
          <span>Seats open</span>
          <strong>06/11</strong>
          <i>
            <b />
          </i>
        </div>
      </section>

      <section className="board">
        <div className="board-head">
          <h2>Open opportunities</h2>
          <div className="pills">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
              All
            </button>
            <button className={filter === 'micro' ? 'active' : ''} onClick={() => setFilter('micro')}>
              Micro
            </button>
            <button className={filter === 'project' ? 'active' : ''} onClick={() => setFilter('project')}>
              Project
            </button>
            <button className={filter === 'ongoing_role' ? 'active' : ''} onClick={() => setFilter('ongoing_role')}>
              Ongoing role
            </button>
            <button
              className={filter === 'grants_adjacent' ? 'active' : ''}
              onClick={() => setFilter('grants_adjacent')}
            >
              Grants-adjacent
            </button>
          </div>
        </div>

        <div className="board-list">
          {filteredRows.map((row, i) => (
            <article className={`board-row ${row.type}`} key={row.id}>
              <span className="row-index">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{row.title}</h3>
                <p>{row.subtitle}</p>
              </div>
              <span className="capsule">{row.commitment}</span>
              <strong>{row.compensation}</strong>
              {row.type === 'internal' && !user ? (
                <button
                  onClick={() => signInWithGoogle('/workspace')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--copper)',
                    cursor: 'pointer',
                    font: 'inherit',
                    textTransform: 'uppercase',
                  }}
                >
                  Sign in to view →
                </button>
              ) : (
                <Link href={row.type === 'internal' ? '/workspace' : `/opportunities/${row.id}`}>
                  {row.type === 'internal' ? 'View Seat' : 'View'} →
                </Link>
              )}
            </article>
          ))}
        </div>

        <div className="board-note">
          Public list shows status <code>open</code> and visibility <code>public</code>. Internal seats appear greyed with a
          sign-in gate so the range of work is visible before signup.
          <button
            onClick={() => signInWithGoogle()}
            className="solid-button"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            Create a profile
          </button>
        </div>
      </section>
    </main>
  )
}
