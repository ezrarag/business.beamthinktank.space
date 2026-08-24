import { GRANT_ROLE_BY_ID, type GrantRole } from '../grants/grantRoles'
import type { Engagement } from './types'

export type GuardrailInput = Pick<Engagement, 'engagementType' | 'partyModel' | 'status' | 'compensationStructure' | 'linkedRoleId' | 'linkedSubrecipientMonitoringId' | 'classificationReview'>
export interface GuardrailResult { allowed: boolean; blocks: string[]; flags: string[]; reviews: string[] }

export function evaluateEngagementGuardrails(input: GuardrailInput, roleOverride?: GrantRole): GuardrailResult {
  const role = roleOverride ?? (input.linkedRoleId ? GRANT_ROLE_BY_ID.get(input.linkedRoleId) : undefined)
  const blocks: string[] = []
  const flags: string[] = []
  const reviews: string[] = []
  const regulatedRole = role && ['hard_gate', 'signoff_gate'].includes(role.tier)

  if (regulatedRole) flags.push('grants_role_regulatory')
  if (regulatedRole && input.engagementType === 'contract_1099' && ['percentage_of_award', 'contingent'].includes(input.compensationStructure ?? '')) {
    blocks.push('GPA_STD_19_CONTINGENT_COMP')
    flags.push('contingent_comp_prohibited')
  }
  if (input.partyModel === 'beam_is_pass_through') {
    flags.push('subrecipient_monitoring_required')
    if (input.status === 'active' && !input.linkedSubrecipientMonitoringId) blocks.push('SUBRECIPIENT_MONITORING_REQUIRED')
  }
  if (input.engagementType === 'staff_track') {
    flags.push('worker_classification_review')
    if (!input.classificationReview || input.classificationReview.status === 'required') {
      reviews.push('WORKER_CLASSIFICATION_REVIEW')
      if (input.status === 'active') blocks.push('WORKER_CLASSIFICATION_REVIEW')
    }
  }
  return { allowed: blocks.length === 0, blocks, flags: [...new Set(flags)], reviews }
}

export class GuardrailError extends Error {
  constructor(public readonly result: GuardrailResult) { super(`Engagement blocked: ${result.blocks.join(', ')}`) }
}
