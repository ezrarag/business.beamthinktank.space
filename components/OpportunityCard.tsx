import type { BusinessOpportunity } from '@/lib/business/types'

const commitment = { micro: 'Micro engagement', recurring_part_time: 'Recurring part-time', project: 'Project', ongoing_role: 'Ongoing role' }
export function OpportunityCard({ opportunity }: { opportunity: BusinessOpportunity }) {
  return <article className="op-card"><div className="op-top"><span className="eyebrow">{commitment[opportunity.commitmentSize]}</span><span className="status"><i /> Open</span></div><h3>{opportunity.title}</h3><p>{opportunity.description}</p><div className="tags">{opportunity.skillsNeeded.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div><footer><div><small>POSTED BY</small><strong>{opportunity.postedBy.name}</strong></div><div><small>COMPENSATION</small><strong>{opportunity.compensationAmount ?? opportunity.compensationType.replaceAll('_', ' ')}</strong></div><a href={`${process.env.NEXT_PUBLIC_BEAM_HOME_URL || 'https://home.beamthinktank.space'}/login?intent=apply&opportunity=${opportunity.id}`}>View role →</a></footer></article>
}
