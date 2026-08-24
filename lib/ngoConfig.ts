export type PathwayRole = 'learn' | 'earn' | 'teach' | 'partner' | 'own'

export interface NGOTrack { slug: string; name: string; summary: string; focus: string; outcomes: string[] }
export interface Pathway { role: PathwayRole; title: string; description: string; ctaLabel: string; ctaHref: string }
export interface NGOConfig {
  id: string; name: string; subdomain: string; siteUrl: string; tagline: string; description: string
  primaryColor: string; tracks: NGOTrack[]; cohortId: string; organizationId: string
  entryChannel: string; beamHomeUrl: string; handoffReturnPath: string; pathways: Pathway[]
}

export const businessConfig: NGOConfig = {
  id: 'beam-business',
  name: 'BEAM Business',
  subdomain: 'business',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://business.beamthinktank.space',
  tagline: 'Real work. Public proof. Institutional capacity.',
  description: 'The staffing layer where participants build a live CV through real engagements and BEAM fills the seats that keep the institution healthy.',
  primaryColor: '#c08a5a',
  cohortId: process.env.NEXT_PUBLIC_BUSINESS_COHORT_ID?.trim() || 'cohort_beam_business_launch',
  organizationId: process.env.NEXT_PUBLIC_BUSINESS_ORGANIZATION_ID?.trim() || 'org_beam_business',
  entryChannel: 'business.beamthinktank.space',
  beamHomeUrl: process.env.NEXT_PUBLIC_BEAM_HOME_URL?.trim() || 'https://home.beamthinktank.space',
  handoffReturnPath: '/portal',
  tracks: [
    { slug: 'operations', name: 'Institutional operations', summary: 'Fill the seats that keep BEAM eligible, accountable, and fundable.', focus: 'Entity registrations, finance, controls, and compliance.', outcomes: ['Filled institutional seats', 'Renewal coverage', 'Audit-ready ownership'] },
    { slug: 'engagements', name: 'Business engagements', summary: 'Turn participant skills into paid, attributable work.', focus: 'Micro-tasks, projects, contracts, and staff tracks.', outcomes: ['Verified work history', 'Portfolio artifacts', 'Endorsements tied to delivery'] },
  ],
  pathways: [
    { role: 'learn', title: 'Build my profile', description: 'Publish the skills, capacity, and work you can stand behind.', ctaLabel: 'Create a profile', ctaHref: '/login?intent=profile' },
    { role: 'earn', title: 'Find real work', description: 'Browse work before signup, then apply with one live CV.', ctaLabel: 'Browse opportunities', ctaHref: '/opportunities' },
    { role: 'teach', title: 'Endorse completed work', description: 'Turn delivered engagements into durable public credibility.', ctaLabel: 'View participants', ctaHref: '/participants' },
    { role: 'partner', title: 'Bring an engagement', description: 'Verified partners can post work or make a direct offer.', ctaLabel: 'Become a partner', ctaHref: '/partners' },
    { role: 'own', title: 'Steward the institution', description: 'BEAM staff fill and renew entity-level compliance seats.', ctaLabel: 'Institutional seats', ctaHref: '/admin/seats' },
  ],
}
