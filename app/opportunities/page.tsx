import { Header } from '@/components/Header'
import { OpportunityCard } from '@/components/OpportunityCard'
import { sampleOpportunities } from '@/lib/business/sample-data'

export default function OpportunitiesPage() {
  return <main><Header /><section className="listing-hero"><span className="eyebrow">PUBLIC OPPORTUNITY BOARD</span><h1>Find work that<br /><em>builds your record.</em></h1><p>No account required to browse. Sign in only when you are ready to apply.</p></section><section className="listing"><div className="filter-row"><span>{sampleOpportunities.length} open roles</span><div><button className="active">All work</button><button>Micro</button><button>Projects</button><button>Staff track</button></div></div><div className="op-grid">{sampleOpportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</div></section></main>
}
