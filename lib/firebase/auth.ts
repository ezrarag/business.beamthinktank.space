import type { DecodedIdToken } from 'firebase-admin/auth'
import { adminAuth } from '@/lib/firebase/admin'

export interface RequestActor { uid: string; email?: string; admin: boolean; divisions: string[]; partnerIds: string[]; token: DecodedIdToken }

export async function requireActor(request: Request): Promise<RequestActor> {
  const value = request.headers.get('authorization')
  if (!value?.startsWith('Bearer ') || !adminAuth) throw new Response('Unauthorized', { status: 401 })
  const token = await adminAuth.verifyIdToken(value.slice(7))
  return {
    uid: token.uid,
    email: token.email,
    admin: token.admin === true || token.role === 'admin',
    divisions: Array.isArray(token.divisions) ? token.divisions.filter((v): v is string => typeof v === 'string') : [],
    partnerIds: Array.isArray(token.partnerIds) ? token.partnerIds.filter((v): v is string => typeof v === 'string') : [],
    token,
  }
}

export function canActFor(actor: RequestActor, kind: string, id: string) {
  return actor.admin || (kind === 'beam_division' ? actor.divisions.includes(id) : actor.partnerIds.includes(id))
}
