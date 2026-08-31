'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { useAuth } from '@/lib/firebase/auth-context'

export default function Workspace() {
  const { user, profile, signInWithGoogle } = useAuth()
  const [offerStatus, setOfferStatus] = useState<'pending' | 'accepted' | 'declined' | 'countered'>('pending')
  const [counterInput, setCounterInput] = useState(false)
  const [counterAmount, setCounterAmount] = useState('$5,000 / quarter')

  const userName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Ayo Mensah'
  const userUid = user?.uid || 'uid_2f9c'

  return (
    <main className="workspace">
      <aside className="side-nav">
        <Link href="/" className="wordmark">
          BEAM <span>· BUSINESS</span>
        </Link>
        <nav>
          <b style={{ color: 'var(--copper)' }}>Workspace</b>
          <Link href={`/participants/${userUid}`}>My profile</Link>
          <Link href="/opportunities">Opportunities</Link>
          <Link href="/admin/seats">Institutional seats</Link>
          <span style={{ color: 'var(--muted)', cursor: 'not-allowed' }}>Documents</span>
        </nav>
        <div>
          <small>IDENTITY</small>
          <strong>{userName}</strong>
          <span>
            home-beam {userUid}
            <br />
            shared across divisions
          </span>
        </div>
      </aside>

      <section className="work-main">
        <span className="eyebrow">Workspace</span>
        <h1>Two paths, one record</h1>

        <div className="stats">
          <div>
            <strong>3</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>{offerStatus === 'pending' ? '2' : '1'}</strong>
            <span>Pending offers</span>
          </div>
          <div>
            <strong>7</strong>
            <span>Completed</span>
          </div>
        </div>

        <article className="offer">
          <span className="eyebrow">Direct offer · unsolicited · no public posting</span>
          <code>directOffers/off_19bd · {offerStatus}</code>
          <h2>Fractional CFO support — quarterly close and board pack</h2>
          <p>From institutional partner · Black Diaspora Orchestra · verified</p>

          <div className="offer-facts">
            <div>
              <small>COMPENSATION</small>
              <b>{offerStatus === 'countered' ? `Proposed Counter: ${counterAmount}` : 'Contract 1099 · $4,200 / quarter'}</b>
            </div>
            <div>
              <small>COMMITMENT</small>
              <b>Recurring part time</b>
            </div>
            <div>
              <small>PARTY MODEL PROPOSED</small>
              <b style={{ color: 'var(--copper)' }}>beam_is_platform_only</b>
            </div>
          </div>

          {offerStatus === 'pending' && (
            <div className="offer-actions">
              <button onClick={() => setOfferStatus('accepted')} className="solid-button" style={{ cursor: 'pointer' }}>
                Accept — creates engagement
              </button>
              <button onClick={() => setCounterInput(!counterInput)} style={{ cursor: 'pointer' }}>
                Counter terms
              </button>
              <button onClick={() => setOfferStatus('declined')} style={{ cursor: 'pointer' }}>
                Decline
              </button>
            </div>
          )}

          {counterInput && offerStatus === 'pending' && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                style={{
                  background: '#0b0b0c',
                  border: '1px solid var(--line)',
                  color: '#e8e3da',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  font: 'inherit',
                  fontSize: '12px',
                }}
              />
              <button
                onClick={() => {
                  setOfferStatus('countered')
                  setCounterInput(false)
                }}
                className="solid-button"
                style={{ padding: '8px 16px', fontSize: '10px', cursor: 'pointer' }}
              >
                Submit Counter
              </button>
            </div>
          )}

          {offerStatus === 'accepted' && (
            <div style={{ color: '#83b987', fontSize: '12px', marginTop: '14px', fontWeight: 600 }}>
              ✓ Offer accepted! Engagement created with party model <code>beam_is_platform_only</code>.
            </div>
          )}

          {offerStatus === 'declined' && (
            <div style={{ color: '#d66e5a', fontSize: '12px', marginTop: '14px' }}>
              Offer declined. The offering partner has been notified.
            </div>
          )}

          {offerStatus === 'countered' && (
            <div style={{ color: 'var(--copper)', fontSize: '12px', marginTop: '14px' }}>
              Counter-offer ({counterAmount}) sent to Black Diaspora Orchestra for review.
            </div>
          )}
        </article>

        <div className="eng-head">
          <h2>Engagements</h2>
          <span>Origin: opportunity, direct offer or institutional seat — one object shape</span>
        </div>

        {[
          [
            'Internal Control Owner — BEAM Institute Corporation',
            'eng_77c2 · origin: institutional seat · linkedInstitutionalRoleId ir_ico',
            'beam_is_party',
            'Staff track · classification review',
          ],
          [
            'FY27 budget build — federal application cycle',
            'eng_4b71 · origin: opportunity op_8fk2 · applied 04 Aug',
            'beam_is_party',
            'Contract 1099 · $45/hr',
          ],
          [
            'Subrecipient monitoring file — orchestra pass-through',
            'eng_51a0 · origin: direct offer off_0c44 · monitoring record linked',
            'beam_is_pass_through',
            'Contract 1099 · $1,800',
          ],
        ].map((x) => (
          <div className="eng-row" key={x[0]}>
            <div>
              <h3>{x[0]}</h3>
              <span>{x[1]}</span>
            </div>
            <code>{x[2]}</code>
            <b>{x[3]}</b>
            <span className="status">
              <i /> Open
            </span>
          </div>
        ))}
      </section>
    </main>
  )
}
