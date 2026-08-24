export type EngagementType = 'volunteer' | 'stipend' | 'contract_1099' | 'staff_track' | 'subaward_to_partner_org'
export type CommitmentSize = 'micro' | 'recurring_part_time' | 'project' | 'ongoing_role'
export type CounterpartyKind = 'beam_division' | 'institutional_partner'
export type PartyModel = 'beam_is_party' | 'beam_is_platform_only' | 'beam_is_pass_through'

export interface PortfolioItem { id: string; title: string; description: string; links?: string[]; engagementId?: string; addedAt: string }
export interface Endorsement { fromUid: string; fromName: string; engagementId: string; text: string; createdAt: string }
export interface BusinessParticipantProfile {
  uid: string; displayName: string; headline: string; bio: string; skills: string[]; portfolioItems: PortfolioItem[]
  capacity: 'open' | 'limited' | 'closed'; hoursPerWeekAvailable?: number; acceptedEngagementTypes: EngagementType[]
  institutionalAffiliations: { divisionOrPartner: string; role: string; current: boolean }[]
  endorsements: Endorsement[]; visibility: 'public' | 'beam_internal' | 'hidden'
  profileStatus: 'draft' | 'published'; createdAt: string; updatedAt: string
}
export interface BusinessOpportunity {
  id: string; title: string; description: string; postedBy: { kind: CounterpartyKind; id: string; name: string }
  commitmentSize: CommitmentSize; compensationType: EngagementType; compensationAmount?: string; skillsNeeded: string[]
  linkedRoleId?: string; linkedInstitutionalRoleId?: string; status: 'open' | 'filled' | 'closed'
  visibility: 'public' | 'beam_internal'; createdAt: string; updatedAt: string
}
export interface DirectOffer {
  id: string; toUid: string; fromKind: CounterpartyKind; fromId: string; fromName: string
  proposedTerms: { title: string; description: string; compensationType: EngagementType; compensationAmount?: string; commitmentSize: CommitmentSize }
  status: 'pending' | 'accepted' | 'declined' | 'countered'; createdAt: string; respondedAt?: string
}
export interface Engagement {
  id: string; participantUid: string; originOpportunityId?: string; originOfferId?: string
  linkedRoleId?: string; linkedInstitutionalRoleId?: string; linkedSubrecipientMonitoringId?: string
  counterparty: { kind: CounterpartyKind; id: string; name: string }; engagementType: EngagementType; partyModel: PartyModel
  scope: string; deliverables: string[]; compensationAmount?: string; compensationStructure?: 'flat' | 'hourly' | 'salary' | 'percentage_of_award' | 'contingent'
  startDate: string; endDate?: string; status: 'draft' | 'active' | 'completed' | 'terminated'
  complianceFlags: string[]; classificationReview?: { status: 'required' | 'approved_employee' | 'approved_contractor'; reviewedBy?: string; reviewedAt?: string }
  createdAt: string; updatedAt: string
}
export interface InstitutionalPartner { id: string; name: string; hostedUnderDivision?: string; contactUid?: string; verified: boolean; createdAt: string }
