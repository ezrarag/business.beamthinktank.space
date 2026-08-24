import { evaluateEngagementGuardrails } from '../lib/business/guardrails'
import type { Engagement } from '../lib/business/types'

const createdAt = '2026-08-24T12:00:00.000Z'
const shared: Engagement = { id: 'base', participantUid: 'participant_ayo', counterparty: { kind: 'beam_division', id: 'business', name: 'BEAM Business' }, partyModel: 'beam_is_party', engagementType: 'contract_1099', scope: 'Deliver the agreed scope and documented artifacts.', deliverables: ['Final deliverable'], startDate: '2026-09-01', status: 'draft', compensationStructure: 'hourly', complianceFlags: [], createdAt, updatedAt: createdAt }
const paths: Engagement[] = [
  { ...shared, id: 'eng_apply', originOpportunityId: 'op_budget', linkedRoleId: 'budget_cfo_signoff' },
  { ...shared, id: 'eng_offer', originOfferId: 'offer_partner', counterparty: { kind: 'institutional_partner', id: 'bdso', name: 'Black Diaspora Orchestra' } },
  { ...shared, id: 'eng_seat', originOpportunityId: 'institutional_ebiz', linkedRoleId: 'ebiz_poc', linkedInstitutionalRoleId: 'ir_ebiz_poc', engagementType: 'staff_track', classificationReview: { status: 'required' } }
]
for (const engagement of paths) console.log(JSON.stringify({ engagement, guardrails: evaluateEngagementGuardrails(engagement) }, null, 2))
console.log('\nDry-run complete: application, direct-offer, and institutional-seat paths converge on Engagement.')
