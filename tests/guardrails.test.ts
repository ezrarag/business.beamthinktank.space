import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { evaluateEngagementGuardrails } from '../lib/business/guardrails'

const base = { engagementType: 'contract_1099' as const, partyModel: 'beam_is_party' as const, status: 'draft' as const }
describe('engagement guardrails', () => {
  it('blocks contingent compensation for hard-gate grant roles', () => { const result = evaluateEngagementGuardrails({ ...base, linkedRoleId: 'aor', compensationStructure: 'percentage_of_award' }); assert.equal(result.allowed, false); assert.ok(result.blocks.includes('GPA_STD_19_CONTINGENT_COMP')) })
  it('requires monitoring before a pass-through becomes active', () => { const result = evaluateEngagementGuardrails({ ...base, partyModel: 'beam_is_pass_through', status: 'active' }); assert.ok(result.blocks.includes('SUBRECIPIENT_MONITORING_REQUIRED')) })
  it('allows active pass-through after monitoring is linked', () => { const result = evaluateEngagementGuardrails({ ...base, partyModel: 'beam_is_pass_through', status: 'active', linkedSubrecipientMonitoringId: 'monitor_1' }); assert.equal(result.allowed, true) })
  it('queues staff-track classification review', () => { const result = evaluateEngagementGuardrails({ ...base, engagementType: 'staff_track' }); assert.ok(result.reviews.includes('WORKER_CLASSIFICATION_REVIEW')) })
})
