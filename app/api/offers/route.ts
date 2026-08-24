import { NextResponse } from 'next/server'
import { requireAdminDb } from '@/lib/firebase/admin'
import { canActFor, requireActor } from '@/lib/firebase/auth'
import { directOfferInput } from '@/lib/business/schemas'
import { createDirectOffer } from '@/lib/business/service'

export async function POST(request: Request) {
  try { const actor = await requireActor(request); const input = directOfferInput.parse(await request.json()); if (!canActFor(actor, input.fromKind, input.fromId)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); if (input.fromKind === 'institutional_partner') { const partner = await requireAdminDb().collection('institutionalPartners').doc(input.fromId).get(); if (!partner.data()?.verified) return NextResponse.json({ error: 'Partner must be verified' }, { status: 403 }) } return NextResponse.json({ data: await createDirectOffer(input) }, { status: 201 }) } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 }) }
}
