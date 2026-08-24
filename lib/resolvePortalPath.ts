import type { PathwayRole } from '@/lib/ngoConfig'

export interface MembershipRouting { pathwayRole?: string | null; role?: string | null }
const ADMIN = new Set(['admin', 'director', 'manager', 'operator', 'staff', 'lead'])
const PATHS: Record<PathwayRole, string> = { learn: '/portal/profile', earn: '/portal/opportunities', teach: '/portal/endorsements', partner: '/portal/partner', own: '/admin/seats' }
const ROLES = Object.keys(PATHS) as PathwayRole[]

export function resolvePortalPath(input: MembershipRouting | string | null | undefined): string {
  const membership = typeof input === 'string' ? { role: input } : input ?? {}
  const pathway = membership.pathwayRole?.trim().toLowerCase() as PathwayRole | undefined
  if (pathway && ROLES.includes(pathway)) return PATHS[pathway]
  const tokens = (membership.role ?? '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  if (tokens.some((token) => ADMIN.has(token))) return '/admin/seats'
  if (tokens.includes('partner')) return PATHS.partner
  if (tokens.some((token) => ['participant', 'member', 'cohort'].includes(token))) return PATHS.earn
  return '/portal'
}
