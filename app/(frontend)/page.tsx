import type {Metadata} from 'next'
import Link from 'next/link'

import {SiteShell} from '@/components/chrome/SiteShell'
import {PageBuilder} from '@/components/pageBuilder/PageBuilder'
import {fetchHomeSeoMetadata} from '@/sanity/lib/metadata'
import {getHomePage, getPages} from '@/sanity/lib/queries'

// ISR baseline: regenerate at most once an hour. Content edits revalidate
// sooner via <SanityLive /> (Live API cache tags).
export const revalidate = 3600

export function generateMetadata(): Promise<Metadata> {
  return fetchHomeSeoMetadata()
}

export default async function Home() {
  // Prefer the page chosen in Site Settings → Home Page; otherwise fall back to
  // an index list. Both tolerate an unreachable dataset (e.g. before creds are
  // set) so the page still renders instead of failing the build.
  const home = await getHomePage().catch(() => null)
  if (home) {
    return (
      <SiteShell navigation={home.navigationOverride} footer={home.footerOverride}>
        <article>
          <PageBuilder blocks={home.pageBuilder} />
        </article>
      </SiteShell>
    )
  }

  const pages = await getPages().catch(() => [])
  return (
    <SiteShell>
      <h1 className="mb-6 text-3xl font-bold">Pages</h1>
      {pages.length === 0 ? (
        <p>
          No pages yet. Create one in the <Link href="/studio">Studio</Link>, add some sections, and
          it will appear here. Set one as the home page in <strong>Site Settings</strong>.
        </p>
      ) : (
        <ul className="grid list-none gap-2 p-0">
          {pages.map((page) => (
            <li key={page._id}>
              <Link href={`/${page.slug}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </SiteShell>
  )
}
