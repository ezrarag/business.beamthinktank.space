import { NextResponse } from 'next/server'
import { canActFor, requireActor } from '@/lib/firebase/auth'
import { engagementInput } from '@/lib/business/schemas'
import { createEngagement } from '@/lib/business/service'
import { GuardrailError } from '@/lib/business/guardrails'

export async function POST(request: Request) {
  try { const actor = await requireActor(request); const input = engagementInput.parse(await request.json()); if (actor.uid !== input.participantUid && !canActFor(actor, input.counterparty.kind, input.counterparty.id)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); return NextResponse.json({ data: await createEngagement(input) }, { status: 201 }) } catch (error) { if (error instanceof GuardrailError) return NextResponse.json({ error: error.message, guardrails: error.result }, { status: 422 }); return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 }) }
}
