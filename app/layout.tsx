import type { Metadata } from 'next'
import { Archivo_Narrow, Bodoni_Moda, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const display = Bodoni_Moda({ subsets: ['latin'], variable: '--font-display' })
const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-sans' })
const mono = Archivo_Narrow({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-condensed' })

export const metadata: Metadata = { title: 'BEAM Business — Real work. Public proof.', description: 'Build a live CV through real engagements and help keep BEAM institutionally healthy.' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable} ${mono.variable}`}>{children}</body></html>
}
