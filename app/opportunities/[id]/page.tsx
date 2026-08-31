'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { useAuth } from '@/lib/firebase/auth-context'

interface OpDetailData {
  id: string
  title: string
  subtitle: string
  commitment: string
  compensation: string
  description: string
  skills: string[]
  partyModel: 'beam_is_party' | 'beam_is_platform_only' | 'beam_is_pass_through'
  visibility: string
  skillOverlap: string
  capacityReq: string
  accepts1099: string
}

const sampleDetails: Record<string, OpDetailData> = {
  op_8fk2: {
    id: 'op_8fk2',
    title: 'Budget Lead / Grants Accountant',
    subtitle: 'Posted by BEAM Division · business · linked to GRANT_ROLES.budget_lead',
    commitment: 'Recurring part time',
    compensation: 'Contract 1099 · $45/hr',
    description:
      'Own the budget narrative and cost allocation for the FY27 federal cycle: build the budget with the program leads, keep the general ledger mapped to award lines, and produce the drawdown documentation that survives an audit. You will work alongside the AOR and the Internal Control Owner, both seats held inside this division.',
    skills: ['Budget Lead / Grants Accountant', 'Cost allocation', 'Nonprofit finance', '2 CFR 200', 'QuickBooks NPO'],
    partyModel: 'beam_is_party',
    visibility: 'Open · visibility beam_internal',
    skillOverlap: '4 of 5',
    capacityReq: 'Limited · 12 h/wk',
    accepts1099: 'Yes',
  },
  op_budget: {
    id: 'op_budget',
    title: 'Budget Lead / Grants Accountant',
    subtitle: 'Posted by BEAM Division · business · linked to GRANT_ROLES.budget_cfo_signoff',
    commitment: 'Project',
    compensation: 'Contract 1099 · $45/hr · up to 240 hours',
    description:
      'Build the FY27 budget, cost allocation plan, and clean GL-to-award mapping for a growing BEAM program.',
    skills: ['Grant accounting', 'Budget / CFO Sign-off', '2 CFR 200'],
    partyModel: 'beam_is_party',
    visibility: 'Open · visibility public',
    skillOverlap: '3 of 3',
    capacityReq: 'Project · 15 h/wk',
    accepts1099: 'Yes',
  },
  op_program: {
    id: 'op_program',
    title: 'Season Program One-Pager',
    subtitle: 'Institutional partner · Black Diaspora Orchestra · hosted under orchestra',
    commitment: 'Micro',
    compensation: 'Stipend · $250 flat',
    description: 'Design and format the season program one-pager for print handoff and digital PDF distribution.',
    skills: ['Graphic design', 'Typography', 'Print handoff'],
    partyModel: 'beam_is_platform_only',
    visibility: 'Open · visibility public',
    skillOverlap: '2 of 3',
    capacityReq: 'Micro · 5 hrs',
    accepts1099: 'Yes',
  },
}

export default function OpportunityDetailPage() {
  const params = useParams()
  const id = (params?.id as string) || 'op_8fk2'
  const detail = sampleDetails[id] || sampleDetails['op_8fk2']

  const [selectedModel, setSelectedModel] = useState<'beam_is_party' | 'beam_is_platform_only' | 'beam_is_pass_through'>(
    detail.partyModel
  )
  const [applied, setApplied] = useState(false)
  const { user, signInWithGoogle } = useAuth()

  const handleApply = async () => {
    if (!user) {
      await signInWithGoogle(`/opportunities/${detail.id}`)
      return
    }
    setApplied(true)
  }

  return (
    <main>
      <Header />
      <div className="detail-shell">
        <div className="breadcrumb">Opportunities / businessOpportunities/{detail.id}</div>
        <div className="detail-grid">
          <section>
            <span className="eyebrow">
              {detail.commitment} · {detail.compensation}
            </span>
            <h1 style={{ fontSize: '56px', lineHeight: 1.05, margin: '20px 0' }}>{detail.title}</h1>
            <p className="byline">{detail.subtitle}</p>
            <p className="lede">{detail.description}</p>
            <h4>Skills needed — same tag space as profiles</h4>
            <div className="tags large">
              {detail.skills.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <div className="warning">
              <b>Compensation constraint enforced at engagement creation</b>
              <p>
                This role touches grants work, so contingent or percentage-of-award compensation is blocked (GPA Code of
                Ethics Standard 19). Flat-rate and hourly terms only. The rules engine rejects the create call rather than
                warning after the fact.
              </p>
            </div>
          </section>

          <aside className="apply-panel">
            <div className="status">
              <i /> {detail.visibility}
            </div>
            <h3>Party model for this engagement</h3>
            <div
              className={`model ${selectedModel === 'beam_is_party' ? 'active' : ''}`}
              onClick={() => setSelectedModel('beam_is_party')}
              style={{ cursor: 'pointer' }}
            >
              <b>beam_is_party</b>
              <span>BEAM contracts directly. BEAM carries liability and 1099 reporting.</span>
            </div>
            <div
              className={`model ${selectedModel === 'beam_is_platform_only' ? 'active' : ''}`}
              onClick={() => setSelectedModel('beam_is_platform_only')}
              style={{ cursor: 'pointer' }}
            >
              <b>beam_is_platform_only</b>
              <span>Counterparty contracts you directly. BEAM is platform only.</span>
            </div>
            <div
              className={`model ${selectedModel === 'beam_is_pass_through' ? 'active' : ''}`}
              onClick={() => setSelectedModel('beam_is_pass_through')}
              style={{ cursor: 'pointer' }}
            >
              <b>beam_is_pass_through</b>
              <span>Pass-through engagement. Requires subrecipient monitoring file.</span>
            </div>

            <h3>Your match</h3>
            <dl>
              <div>
                <dt>Skill overlap</dt>
                <dd>{detail.skillOverlap}</dd>
              </div>
              <div>
                <dt>Capacity</dt>
                <dd>{detail.capacityReq}</dd>
              </div>
              <div>
                <dt>Accepts contract_1099</dt>
                <dd>{detail.accepts1099}</dd>
              </div>
            </dl>

            {applied ? (
              <div
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(131,185,135,0.15)',
                  border: '1px solid #83b987',
                  color: '#83b987',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                Application submitted with your profile!
              </div>
            ) : (
              <button onClick={handleApply} className="solid-button" style={{ cursor: 'pointer' }}>
                {user ? 'Apply with my profile' : 'Sign in with Google to apply'}
              </button>
            )}
            <Link href="/workspace" className="plain-button" style={{ textAlign: 'center' }}>
              Ask a question first
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}
