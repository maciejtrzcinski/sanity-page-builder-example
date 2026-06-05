import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {SiteShell} from '@/components/chrome/SiteShell'
import {PageBuilder} from '@/components/pageBuilder/PageBuilder'
import {siteUrl} from '@/lib/site'
import {fetchPageSeoMetadata} from '@/sanity/lib/metadata'
import {getPage, getPageSlugs} from '@/sanity/lib/queries'

// ISR baseline: regenerate at most once an hour. Content edits revalidate
// sooner via <SanityLive /> (Live API cache tags).
export const revalidate = 3600

// Catch-all route: a nested path `/docs/getting-started` arrives as the segment
// array `['docs', 'getting-started']`. We join it back into the path string
// that Sanity stores in `slug.current`.
function toSlug(segments: string[]): string {
  return segments.join('/')
}

export async function generateStaticParams() {
  try {
    const slugs = await getPageSlugs()
    // Each path string splits back into the segment array the route expects.
    return slugs.map((slug) => ({slug: slug.split('/')}))
  } catch {
    // No reachable dataset at build time (e.g. before Sanity creds are set):
    // skip pre-rendering and let pages render on demand.
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string[]}>
}): Promise<Metadata> {
  const {slug} = await params
  return fetchPageSeoMetadata(toSlug(slug))
}

export default async function Page({params}: {params: Promise<{slug: string[]}>}) {
  const {slug} = await params
  const path = toSlug(slug)
  const page = await getPage(path)

  if (!page) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: `${siteUrl}/${path}`,
  }

  return (
    <SiteShell navigation={page.navigationOverride} footer={page.footerOverride}>
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
        <h1 className="mb-6 text-3xl font-bold">{page.title}</h1>
        <PageBuilder blocks={page.pageBuilder} />
      </article>
    </SiteShell>
  )
}
