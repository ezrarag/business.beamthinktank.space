'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { evaluateEngagementGuardrails } from '@/lib/business/guardrails'
import type { EngagementType, PartyModel } from '@/lib/business/types'

export default function NewEngagement() {
  const [engagementType, setEngagementType] = useState<EngagementType>('contract_1099')
  const [partyModel, setPartyModel] = useState<PartyModel>('beam_is_party')
  const [compensationStructure, setCompensationStructure] = useState<'hourly' | 'flat' | 'percentage_of_award' | 'contingent'>('hourly')
  const [status, setStatus] = useState<'draft' | 'active'>('active')
  const [linkedRoleId, setLinkedRoleId] = useState<string>('budget_cfo_signoff')
  const [linkedSubrecipientId, setLinkedSubrecipientId] = useState<string>('')
  const [created, setCreated] = useState(false)

  const evaluation = evaluateEngagementGuardrails({
    engagementType,
    partyModel,
    status,
    compensationStructure,
    linkedRoleId,
    linkedSubrecipientMonitoringId: linkedSubrecipientId || undefined,
  })

  return (
    <main className="admin-form">
      <section>
        <div style={{ marginBottom: '20px' }}>
          <Link href="/admin/seats" style={{ font: '500 10px var(--font-condensed)', color: 'var(--copper)' }}>
            ← Back to Admin
          </Link>
        </div>
        <span className="eyebrow">Admin / engagements / new</span>
        <h1>Create engagement</h1>
        <p>Converging path: opportunity application, direct offer, or institutional seat. Same object either way.</p>

        <Field label="Participant" value="Ayo Mensah · uid_2f9c" />
        <Field label="Origin" value="Opportunity op_8fk2 — Budget Lead / Grants Accountant" />

        <div className="field-grid">
          <label className="field">
            <span>Engagement type</span>
            <select
              value={engagementType}
              onChange={(e) => setEngagementType(e.target.value as EngagementType)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0b0b0c',
                color: '#e8e3da',
                border: '1px solid var(--line)',
                borderRadius: '8px',
              }}
            >
              <option value="contract_1099">contract_1099</option>
              <option value="stipend">stipend</option>
              <option value="staff_track">staff_track</option>
              <option value="volunteer">volunteer</option>
            </select>
          </label>

          <label className="field">
            <span>Party model — required</span>
            <select
              value={partyModel}
              onChange={(e) => setPartyModel(e.target.value as PartyModel)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0b0b0c',
                color: '#e8e3da',
                border: '1px solid var(--line)',
                borderRadius: '8px',
              }}
            >
              <option value="beam_is_party">beam_is_party</option>
              <option value="beam_is_platform_only">beam_is_platform_only</option>
              <option value="beam_is_pass_through">beam_is_pass_through</option>
            </select>
          </label>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>Compensation structure</span>
            <select
              value={compensationStructure}
              onChange={(e) => setCompensationStructure(e.target.value as any)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0b0b0c',
                color: '#e8e3da',
                border: '1px solid var(--line)',
                borderRadius: '8px',
              }}
            >
              <option value="hourly">Hourly ($45/hr)</option>
              <option value="flat">Flat stipend</option>
              <option value="percentage_of_award">percentage_of_award (prohibited on grants)</option>
              <option value="contingent">contingent (prohibited on grants)</option>
            </select>
          </label>

          <label className="field">
            <span>Linked Role</span>
            <select
              value={linkedRoleId}
              onChange={(e) => setLinkedRoleId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0b0b0c',
                color: '#e8e3da',
                border: '1px solid var(--line)',
                borderRadius: '8px',
              }}
            >
              <option value="budget_cfo_signoff">GRANT_ROLES.budget_cfo_signoff (Regulatory)</option>
              <option value="none">None (General)</option>
            </select>
          </label>
        </div>

        {!evaluation.allowed && (
          <div className="blocked">
            Blocked · {evaluation.blocks.join(', ')} — Contingent or percentage-of-award compensation is prohibited on
            grant roles (GPA Standard 19).
          </div>
        )}

        <Field
          label="Scope"
          value="Build FY27 budget and cost allocation plan; maintain GL-to-award mapping; prepare drawdown documentation with the AOR."
        />
        <Field label="Deliverables" value="FY27 budget workbook  ·  Indirect cost rate memo  ·  Add deliverable" />
      </section>

      <aside>
        <span className="eyebrow">Rules engine · evaluateEngagementGuardrails()</span>
        <p>One function, one input object. New guardrails register here as roles grow.</p>

        <Rule
          status={evaluation.blocks.includes('GPA_STD_19_CONTINGENT_COMP') ? 'Hard block' : 'Passed'}
          code="GPA_STD_19_CONTINGENT_COMP"
          text="Role tier is regulatory and type is contract_1099 — contingent or percentage-of-award compensation rejected at create."
        />
        <Rule
          status={evaluation.blocks.includes('SUBRECIPIENT_MONITORING_REQUIRED') ? 'Hard block' : 'Passed'}
          code="SUBRECIPIENT_MONITORING_REQUIRED"
          text="Fires only when partyModel is beam_is_pass_through. Blocks status → active until a monitoring record is linked."
        />
        <Rule
          status={evaluation.reviews.includes('WORKER_CLASSIFICATION_REVIEW') ? 'Review required' : 'Passed'}
          code="WORKER_CLASSIFICATION_REVIEW"
          text="staff_track engagements queue for a human employee-vs-contractor decision instead of auto-approving."
        />

        <div className="flags">
          <small>complianceFlags to be written</small>
          {evaluation.flags.length > 0 ? (
            evaluation.flags.map((f) => <span key={f}>{f}</span>)
          ) : (
            <span style={{ color: 'var(--muted)' }}>none</span>
          )}
        </div>

        {created ? (
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(131,185,135,0.15)',
              border: '1px solid #83b987',
              color: '#83b987',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            Engagement created successfully!
          </div>
        ) : (
          <>
            <button
              onClick={() => evaluation.allowed && setCreated(true)}
              disabled={!evaluation.allowed}
              className="solid-button"
              style={{
                cursor: evaluation.allowed ? 'pointer' : 'not-allowed',
                opacity: evaluation.allowed ? 1 : 0.5,
              }}
            >
              Create engagement · status {status}
            </button>
            <button onClick={() => setStatus('draft')} className="plain-button" style={{ cursor: 'pointer' }}>
              Save as draft
            </button>
          </>
        )}
      </aside>
    </main>
  )
}

function Field({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className={active ? 'active' : ''}>{value}</div>
    </label>
  )
}

function Rule({ status, code, text }: { status: string; code: string; text: string }) {
  const isDanger = status === 'Hard block' || status === 'Review required'
  return (
    <div className={`rule ${isDanger ? 'danger' : ''}`}>
      <div>
        <b style={{ color: isDanger ? '#d66e5a' : '#83b987' }}>{status}</b>
        <code>{code}</code>
      </div>
      <p>{text}</p>
    </div>
  )
}
