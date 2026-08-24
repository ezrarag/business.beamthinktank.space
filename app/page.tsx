import Link from 'next/link'
import { Header } from '@/components/Header'

const rows = [
  ['Budget Lead / Grants Accountant — FY27 federal application cycle','BEAM Division · business · linked role: GRANT_ROLES.budget_lead','Recurring part time','Contract 1099 · $45/hr','public'],
  ['SAM.gov Entity Administrator — renewal & annual representations','BEAM Division · business · institutional seat · beam_internal','Ongoing role','Stipend · $500 flat / cycle','internal'],
  ['Season program one-pager — copy, layout, print handoff','Institutional partner · Black Diaspora Orchestra · hosted under orchestra','Micro','Stipend · $250 flat','public'],
  ['Internal Control Owner — segregation of duties documentation','BEAM Division · business · institutional seat · beam_internal','Ongoing role','Staff track · TBD','internal'],
  ['Subrecipient monitoring assistant — 2 CFR 200.332 file build','BEAM Division · business · pass-through engagement expected','Project','Contract 1099 · $1,800 flat','public'],
]

export default function Home() {
  return <main><Header /><section className="mock-hero"><div><span className="eyebrow">Division 04 · Business development & institutional operations</span><h1>BUSINESS</h1></div><p>Real engagements inside one legal entity. Build a public profile, take work from one-off tasks up to the institutional seats that let BEAM receive and account for money — recorded as work history, not a simulation.</p><div className="mock-actions"><Link className="solid-button" href="/opportunities">Browse 24 open opportunities</Link><Link href="/workspace">How engagements work ↗</Link></div><div className="seat-meter"><span>Seats open</span><strong>06/11</strong><i><b /></i></div></section>
  <section className="board"><div className="board-head"><h2>Open opportunities</h2><div className="pills"><button className="active">All</button><button>Micro</button><button>Project</button><button>Ongoing role</button><button>Grants-adjacent</button></div></div><div className="board-list">{rows.map((row,i)=><article className={`board-row ${row[4]}`} key={row[0]}><span className="row-index">{String(i+1).padStart(2,'0')}</span><div><h3>{row[0]}</h3><p>{row[1]}</p></div><span className="capsule">{row[2]}</span><strong>{row[3]}</strong><Link href={row[4]==='internal'?'/workspace':'/opportunities/op_8fk2'}>{row[4]==='internal'?'Sign in to view':'View'} →</Link></article>)}</div><div className="board-note">Public list shows status <code>open</code> and visibility <code>public</code>. Internal seats appear greyed with a sign-in gate so the range of work is visible before signup.<Link className="solid-button" href="/participants/uid_2f9c">Create a profile</Link></div></section></main>
}
