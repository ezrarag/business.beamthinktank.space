import Link from 'next/link'

export function Header() {
  return <header className="site-header"><Link href="/" className="wordmark" aria-label="BEAM Business home">BEAM <span>· BUSINESS</span></Link><nav aria-label="Main navigation"><Link href="/opportunities">Opportunities</Link><Link href="/admin/seats">Institutional Seats</Link><Link href="/participants/uid_2f9c">Participants</Link><Link href="/#about">About the Division</Link></nav><a className="signin" href={`${process.env.NEXT_PUBLIC_BEAM_HOME_URL || 'https://home.beamthinktank.space'}/login?returnTo=https://business.beamthinktank.space/workspace`}>Sign in</a><a className="outline-button" href="/participants/uid_2f9c">Create a profile</a></header>
}
