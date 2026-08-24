import { NextResponse } from 'next/server'
import { requireAdminDb } from '@/lib/firebase/admin'
import { canActFor, requireActor } from '@/lib/firebase/auth'
import { opportunityInput } from '@/lib/business/schemas'
import { createOpportunity } from '@/lib/business/service'

export async function GET() {
  const snap = await requireAdminDb().collection('businessOpportunities').where('visibility', '==', 'public').where('status', '==', 'open').orderBy('createdAt', 'desc').limit(50).get()
  return NextResponse.json({ data: snap.docs.map((doc) => doc.data()) })
}
export async function POST(request: Request) {
  try { const actor = await requireActor(request); const input = opportunityInput.parse(await request.json()); if (!canActFor(actor, input.postedBy.kind, input.postedBy.id)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); if (input.postedBy.kind === 'institutional_partner') { const partner = await requireAdminDb().collection('institutionalPartners').doc(input.postedBy.id).get(); if (!partner.data()?.verified) return NextResponse.json({ error: 'Partner must be verified' }, { status: 403 }) } return NextResponse.json({ data: await createOpportunity(input) }, { status: 201 }) } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 }) }
}
