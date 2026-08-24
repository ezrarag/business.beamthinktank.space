// Canonical adapter for home.beamthinktank.space/src/lib/grants/grantRoles.ts.
// Keep IDs/tier semantics aligned; application code imports this module instead of inventing role labels.
export type RoleTier = 'hard_gate' | 'signoff_gate' | 'development' | 'stewardship' | 'funder_side'
export interface GrantRole { id: string; label: string; tier: RoleTier; stage: 'institutional' | 'pursuit'; summary: string }
export const GRANT_ROLES: GrantRole[] = [
  { id: 'sam_entity_admin', label: 'SAM.gov Entity Administrator', tier: 'hard_gate', stage: 'institutional', summary: 'Manages entity registration and annual SAM renewal.' },
  { id: 'ebiz_poc', label: 'E-Business Point of Contact (EBiz POC)', tier: 'hard_gate', stage: 'institutional', summary: 'Authorizes AORs and manages Grants.gov roles.' },
  { id: 'aor', label: 'Authorized Organization Representative (AOR)', tier: 'hard_gate', stage: 'pursuit', summary: 'Submits binding proposals on Grants.gov.' },
  { id: 'budget_cfo_signoff', label: 'Budget / CFO Sign-off', tier: 'signoff_gate', stage: 'pursuit', summary: 'Approves budget compliance and indirect costs.' },
  { id: 'subrecipient_compliance_monitor', label: 'Subrecipient Compliance Monitor', tier: 'signoff_gate', stage: 'pursuit', summary: 'Performs subaward risk and audit checks.' },
  { id: 'grants_lead_manager', label: 'Grants Lead / Proposal Manager', tier: 'development', stage: 'pursuit', summary: 'Coordinates proposal development and submission.' },
  { id: 'lead_writer_grant_writer', label: 'Lead Writer / Grant Writer', tier: 'development', stage: 'pursuit', summary: 'Develops proposal narratives and supporting material.' },
  { id: 'grants_accountant', label: 'Budget Lead / Grants Accountant', tier: 'stewardship', stage: 'pursuit', summary: 'Maintains award budgets and financial reporting.' }
]
export const GRANT_ROLE_BY_ID = new Map(GRANT_ROLES.map((role) => [role.id, role]))
