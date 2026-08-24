import type { BusinessOpportunity, DirectOffer, Engagement } from '@/lib/business/types'

type OpportunityInput = Omit<BusinessOpportunity, 'id' | 'status' | 'createdAt' | 'updatedAt'>
type DirectOfferInput = Omit<DirectOffer, 'id' | 'status' | 'createdAt'>
type EngagementInput = Omit<Engagement, 'id' | 'complianceFlags' | 'createdAt' | 'updatedAt'>

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a JSON object')
  return value as Record<string, unknown>
}
function text(value: unknown, field: string, minimum = 1): string {
  if (typeof value !== 'string' || value.trim().length < minimum) throw new Error(`${field} is required`)
  return value.trim()
}
function oneOf<T extends string>(value: unknown, field: string, values: readonly T[]): T {
  if (typeof value !== 'string' || !values.includes(value as T)) throw new Error(`${field} is invalid`)
  return value as T
}
const TYPES = ['volunteer', 'stipend', 'contract_1099', 'staff_track', 'subaward_to_partner_org'] as const
const SIZES = ['micro', 'recurring_part_time', 'project', 'ongoing_role'] as const
const KINDS = ['beam_division', 'institutional_partner'] as const

export const opportunityInput = { parse(value: unknown): OpportunityInput {
  const v = object(value); const posted = object(v.postedBy)
  return { title: text(v.title, 'title', 4), description: text(v.description, 'description', 20), postedBy: { kind: oneOf(posted.kind, 'postedBy.kind', KINDS), id: text(posted.id, 'postedBy.id'), name: text(posted.name, 'postedBy.name') }, commitmentSize: oneOf(v.commitmentSize, 'commitmentSize', SIZES), compensationType: oneOf(v.compensationType, 'compensationType', TYPES), compensationAmount: typeof v.compensationAmount === 'string' ? v.compensationAmount : undefined, skillsNeeded: Array.isArray(v.skillsNeeded) ? v.skillsNeeded.map((x) => text(x, 'skill')) : [], linkedRoleId: typeof v.linkedRoleId === 'string' ? v.linkedRoleId : undefined, linkedInstitutionalRoleId: typeof v.linkedInstitutionalRoleId === 'string' ? v.linkedInstitutionalRoleId : undefined, visibility: oneOf(v.visibility, 'visibility', ['public', 'beam_internal'] as const) }
} }
export const directOfferInput = { parse(value: unknown): DirectOfferInput {
  const v = object(value); const terms = object(v.proposedTerms)
  return { toUid: text(v.toUid, 'toUid'), fromKind: oneOf(v.fromKind, 'fromKind', KINDS), fromId: text(v.fromId, 'fromId'), fromName: text(v.fromName, 'fromName'), proposedTerms: { title: text(terms.title, 'title', 4), description: text(terms.description, 'description', 10), compensationType: oneOf(terms.compensationType, 'compensationType', TYPES), compensationAmount: typeof terms.compensationAmount === 'string' ? terms.compensationAmount : undefined, commitmentSize: oneOf(terms.commitmentSize, 'commitmentSize', SIZES) } }
} }
export const engagementInput = { parse(value: unknown): EngagementInput {
  const v = object(value); const counterparty = object(v.counterparty)
  return { participantUid: text(v.participantUid, 'participantUid'), originOpportunityId: typeof v.originOpportunityId === 'string' ? v.originOpportunityId : undefined, originOfferId: typeof v.originOfferId === 'string' ? v.originOfferId : undefined, linkedRoleId: typeof v.linkedRoleId === 'string' ? v.linkedRoleId : undefined, linkedInstitutionalRoleId: typeof v.linkedInstitutionalRoleId === 'string' ? v.linkedInstitutionalRoleId : undefined, linkedSubrecipientMonitoringId: typeof v.linkedSubrecipientMonitoringId === 'string' ? v.linkedSubrecipientMonitoringId : undefined, counterparty: { kind: oneOf(counterparty.kind, 'counterparty.kind', KINDS), id: text(counterparty.id, 'counterparty.id'), name: text(counterparty.name, 'counterparty.name') }, engagementType: oneOf(v.engagementType, 'engagementType', TYPES), partyModel: oneOf(v.partyModel, 'partyModel', ['beam_is_party', 'beam_is_platform_only', 'beam_is_pass_through'] as const), scope: text(v.scope, 'scope', 10), deliverables: Array.isArray(v.deliverables) ? v.deliverables.map((x) => text(x, 'deliverable')) : [], compensationAmount: typeof v.compensationAmount === 'string' ? v.compensationAmount : undefined, compensationStructure: v.compensationStructure ? oneOf(v.compensationStructure, 'compensationStructure', ['flat', 'hourly', 'salary', 'percentage_of_award', 'contingent'] as const) : undefined, startDate: text(v.startDate, 'startDate', 10), endDate: typeof v.endDate === 'string' ? v.endDate : undefined, status: oneOf(v.status ?? 'draft', 'status', ['draft', 'active'] as const) }
} }
