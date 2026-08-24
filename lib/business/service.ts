import { FieldValue } from 'firebase-admin/firestore'
import { requireAdminDb } from '@/lib/firebase/admin'
import { evaluateEngagementGuardrails, GuardrailError } from '@/lib/business/guardrails'
import type { BusinessOpportunity, DirectOffer, Engagement, Endorsement } from '@/lib/business/types'

const now = () => new Date().toISOString()

export async function createOpportunity(input: Omit<BusinessOpportunity, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
  const db = requireAdminDb(); const ref = db.collection('businessOpportunities').doc(); const timestamp = now()
  const value: BusinessOpportunity = { ...input, id: ref.id, status: 'open', createdAt: timestamp, updatedAt: timestamp }
  await ref.set(value); return value
}

export async function createDirectOffer(input: Omit<DirectOffer, 'id' | 'status' | 'createdAt'>) {
  const db = requireAdminDb(); const ref = db.collection('businessDirectOffers').doc()
  const value: DirectOffer = { ...input, id: ref.id, status: 'pending', createdAt: now() }
  await ref.set(value); return value
}

export async function createEngagement(input: Omit<Engagement, 'id' | 'complianceFlags' | 'createdAt' | 'updatedAt'>) {
  const db = requireAdminDb(); const result = evaluateEngagementGuardrails(input)
  if (!result.allowed) throw new GuardrailError(result)
  const ref = db.collection('businessEngagements').doc(); const timestamp = now()
  const value: Engagement = { ...input, id: ref.id, complianceFlags: result.flags, createdAt: timestamp, updatedAt: timestamp }
  await db.runTransaction(async (tx) => {
    tx.set(ref, value)
    if (input.originOpportunityId) tx.update(db.collection('businessOpportunities').doc(input.originOpportunityId), { status: 'filled', updatedAt: timestamp })
    if (input.originOfferId) tx.update(db.collection('businessDirectOffers').doc(input.originOfferId), { status: 'accepted', respondedAt: timestamp })
    if (input.linkedInstitutionalRoleId) tx.set(db.collection('beamInstitutionalRoles').doc(input.linkedInstitutionalRoleId), { holderUid: input.participantUid, holderEngagementId: ref.id, holderSince: input.startDate, updatedAt: timestamp }, { merge: true })
  })
  return value
}

export async function completeEngagement(id: string, endorsement: Omit<Endorsement, 'engagementId' | 'createdAt'>) {
  const db = requireAdminDb(); const ref = db.collection('businessEngagements').doc(id); const timestamp = now()
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref); if (!snap.exists) throw new Error('Engagement not found')
    const engagement = snap.data() as Engagement
    tx.update(ref, { status: 'completed', updatedAt: timestamp })
    tx.update(db.collection('businessParticipants').doc(engagement.participantUid), {
      endorsements: FieldValue.arrayUnion({ ...endorsement, engagementId: id, createdAt: timestamp }), updatedAt: timestamp,
    })
  })
}

export async function syncInstitutionalSeatOpportunities() {
  const db = requireAdminDb(); const roles = await db.collection('beamInstitutionalRoles').get(); let synced = 0
  const batch = db.batch(); const timestamp = now()
  for (const doc of roles.docs) {
    const role = doc.data(); const expiring = role.expiresAt && new Date(role.expiresAt).getTime() < Date.now() + 90 * 86400000
    if (role.holderUid && !expiring) continue
    const ref = db.collection('businessOpportunities').doc(`institutional_${doc.id}`)
    batch.set(ref, { id: ref.id, title: role.label ?? role.title ?? doc.id, description: role.summary ?? 'BEAM institutional compliance seat.', postedBy: { kind: 'beam_division', id: 'business', name: 'BEAM Business' }, commitmentSize: 'ongoing_role', compensationType: role.compensationType ?? 'staff_track', skillsNeeded: role.skills ?? [], linkedRoleId: role.grantRoleId ?? undefined, linkedInstitutionalRoleId: doc.id, status: 'open', visibility: 'beam_internal', createdAt: role.createdAt ?? timestamp, updatedAt: timestamp }, { merge: true }); synced++
  }
  await batch.commit(); return synced
}
