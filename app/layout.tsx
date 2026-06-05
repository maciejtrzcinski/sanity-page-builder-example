import type {Metadata} from 'next'
import type {ReactNode} from 'react'

import {siteUrl} from '@/lib/site'

import './globals.css'

export const metadata: Metadata = {
  // Canonical URLs and og:url are relative paths; Next resolves them against
  // this base. Set NEXT_PUBLIC_SITE_URL in production.
  metadataBase: new URL(siteUrl),
  title: 'Page Builder Example',
  description: 'sanity-plugin-section-builder + @maciejtrzcinski/sanity-page-builder-core demo',
}

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
