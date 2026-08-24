# BEAM Business

Vercel-ready Next.js application and Firestore backend for `business.beamthinktank.space`.

## What is included

- Public, unauthenticated opportunity board and mockup-aligned landing page.
- Shared Home-BEAM Firebase Auth; no separate account system.
- Typed contracts for participant live CVs, opportunities, direct offers, engagements, and partners.
- Central engagement guardrail engine for contingent compensation, subrecipient monitoring, and worker-classification review.
- Transactional convergence of application, direct-offer, and institutional-seat paths.
- Institutional seat synchronization that reads and writes the canonical `beamInstitutionalRoles` collection.
- Server-only endorsement writes tied to completed engagements.
- Firestore rules and indexes for all five business collections.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Use the same Firebase web config and service account as `home.beamthinktank.space`. Deploy `firestore.rules` to that shared project separately; Vercel deploys the Next.js app, not Firebase rules.

## Verification

```bash
npm run typecheck
npm test
npm run build
npm run seed:dry
```

Profile owners may publish their own profile directly. This is deliberate: publication only exposes owner-authored profile fields, while endorsements and engagement history remain server-authored and auditable. Add an admin approval state later only if BEAM adopts editorial review capacity.
