import type {Metadata} from 'next'
import Link from 'next/link'

import {SiteShell} from '@/components/chrome/SiteShell'
import {PageBuilder} from '@/components/pageBuilder/PageBuilder'
import {fetchBlogIndexSeoMetadata} from '@/sanity/lib/metadata'
import {getBlogIndex, getBlogPosts} from '@/sanity/lib/queries'

export const revalidate = 3600

export function generateMetadata(): Promise<Metadata> {
  return fetchBlogIndexSeoMetadata()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function BlogIndexPage() {
  // Prefer the page-builder-composed Blog Index; otherwise fall back to a list.
  const index = await getBlogIndex().catch(() => null)
  if (index) {
    return (
      <SiteShell>
        <article>
          <PageBuilder blocks={index.pageBuilder} />
        </article>
      </SiteShell>
    )
  }

  const posts = await getBlogPosts().catch(() => [])
  return (
    <SiteShell>
      <h1 className="mb-6 text-3xl font-bold">Blog</h1>
      {posts.length === 0 ? (
        <p>
          No posts yet. Create one under <strong>Blog → Posts</strong> in the{' '}
          <Link href="/studio">Studio</Link>.
        </p>
      ) : (
        <ul className="grid list-none gap-6 p-0 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post._id} className="rounded-xl border border-gray-200 p-5">
              <h2 className="mb-2 text-lg font-semibold">
                <Link href={`/blog/${post.slug}`} className="text-gray-900 no-underline">
                  {post.title}
                </Link>
              </h2>
              {post.excerpt ? <p className="mb-2 text-gray-500">{post.excerpt}</p> : null}
              <p className="m-0 text-xs text-gray-400">
                {[
                  post.authors?.length && `By ${post.authors.join(', ')}`,
                  post.publishedAt && formatDate(post.publishedAt),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SiteShell>
  )
}
