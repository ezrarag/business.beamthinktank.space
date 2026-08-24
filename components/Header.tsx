import Link from 'next/link'

export function Header() {
  return <header className="site-header"><Link href="/" className="wordmark" aria-label="BEAM Business home">BEAM <span>BUSINESS</span></Link><nav aria-label="Main navigation"><Link href="/opportunities">Opportunities</Link><Link href="/#participants">Participants</Link><Link href="/#how">How it works</Link></nav><a className="outline-button" href={`${process.env.NEXT_PUBLIC_BEAM_HOME_URL || 'https://home.beamthinktank.space'}/login?returnTo=https://business.beamthinktank.space/portal`}>Sign in <span>↗</span></a></header>
}
