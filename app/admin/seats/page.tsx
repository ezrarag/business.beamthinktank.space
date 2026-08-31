'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'

interface PartnerItem {
  id: string
  name: string
  details: string
  status: 'verified' | 'unverified' | 'exempt'
}

export default function SeatsPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([
    {
      id: 'bdo',
      name: 'Black Diaspora Orchestra',
      details: 'hostedUnderDivision: orchestra · contact uid_9a11',
      status: 'verified',
    },
    {
      id: 'wht',
      name: 'Westside Housing Trust',
      details: 'No hosting division · contact uid_44f0',
      status: 'unverified',
    },
    {
      id: 'grounds',
      name: 'Grounds Cooperative',
      details: 'BEAM division · internal, no verification needed',
      status: 'exempt',
    },
  ])

  const [publishedSeat, setPublishedSeat] = useState<string | null>(null)

  const handleVerify = (id: string) => {
    setPartners(
      partners.map((p) => (p.id === id ? { ...p, status: 'verified', details: `${p.details} · Verified just now` } : p))
    )
  }

  return (
    <main className="seats">
      <div className="admin-back">
        <Link href="/">BEAM · BUSINESS</Link>
        <span className="eyebrow">Admin · entity-level compliance</span>
      </div>

      <header>
        <div>
          <span className="eyebrow">Admin · entity-level compliance</span>
          <h1>Institutional seats</h1>
          <p>
            Read from beamInstitutionalRoles. Unfilled or expiring seats publish here as beam_internal opportunities;
            engaging someone writes the holder back to that collection.
          </p>
        </div>
        <div className="seat-stats">
          <div>
            <span>Seats</span>
            <b>11</b>
          </div>
          <div>
            <span>Unfilled</span>
            <b style={{ color: '#d66e5a' }}>4</b>
          </div>
          <div>
            <span>Expiring 90d</span>
            <b style={{ color: '#c08a5a' }}>2</b>
          </div>
        </div>
      </header>

      <div className="seat-alerts">
        <article>
          <span>Unfilled · hard gate</span>
          <code>ir_ebiz_poc</code>
          <h2>EBiz Point of Contact</h2>
          <p>Grants.gov authority to designate AORs. No submissions possible while vacant.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {publishedSeat === 'ir_ebiz_poc' ? (
              <span className="mi" style={{ fontSize: '9.5px', color: '#83b987' }}>
                ✓ Published as opportunity
              </span>
            ) : (
              <button onClick={() => setPublishedSeat('ir_ebiz_poc')} style={{ cursor: 'pointer' }}>
                Publish as opportunity
              </button>
            )}
            <Link href="/participants" className="plain-button" style={{ font: '500 9px var(--font-condensed)' }}>
              Match a participant
            </Link>
          </div>
        </article>

        <article>
          <span>Expires in 41 days</span>
          <code>ir_sam_entity_admin</code>
          <h2>SAM Entity Administrator</h2>
          <p>Held by D. Whitfield. Registration renewal and annual representations due 04 Oct 2026.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <Link href="/admin/engagements/new" className="solid-button" style={{ font: '500 9px var(--font-condensed)' }}>
              Post renewal engagement
            </Link>
            <Link href="/workspace" className="plain-button" style={{ font: '500 9px var(--font-condensed)' }}>
              View holder history
            </Link>
          </div>
        </article>
      </div>

      <div className="seat-table">
        <div>
          <b>Seat</b>
          <b>Tier</b>
          <b>Holder</b>
          <b>Status</b>
        </div>
        {[
          ['Authorized Organization Representative (AOR)', 'hard_gate', 'Ayo Mensah', 'Filled'],
          ['Chief Financial Officer', 'regulatory', '—', 'Unfilled'],
          ['Internal Control Owner', 'regulatory', 'Ayo Mensah · staff track review', 'In review'],
          ['Records Retention Owner', 'operational', '—', 'Unfilled'],
        ].map((r) => (
          <div key={r[0]}>
            {r.map((c, i) => (
              <span key={c} className={i === 3 ? c.toLowerCase().replace(' ', '-') : ''}>
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="partner-head">
        <h2>Partner verification queue</h2>
        <span>Unverified partners cannot post or send direct offers</span>
      </div>

      <div className="partner-grid">
        {partners.map((p) => (
          <article key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.details}</p>
            <div style={{ marginTop: '16px' }}>
              {p.status === 'verified' && (
                <span className="mi" style={{ fontSize: '10px', color: '#7fbf7f' }}>
                  ✓ Verified
                </span>
              )}
              {p.status === 'exempt' && (
                <span className="mi" style={{ fontSize: '10px', color: 'var(--muted)' }}>
                  Division · exempt
                </span>
              )}
              {p.status === 'unverified' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleVerify(p.id)} className="solid-button" style={{ cursor: 'pointer', fontSize: '9px', padding: '6px 12px' }}>
                    Verify
                  </button>
                  <button className="plain-button" style={{ cursor: 'pointer', fontSize: '9px', padding: '6px 12px' }}>
                    Request docs
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
