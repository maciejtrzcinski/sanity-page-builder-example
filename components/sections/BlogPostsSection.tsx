import Link from 'next/link'

import type {BlogPostsBlock} from '../pageBuilder/types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function BlogPostsSection({block}: {block: BlogPostsBlock}) {
  const posts = (block.posts ?? []).slice(0, block.max ?? 6)

  return (
    <section id={block.sectionId ?? undefined} className="py-10">
      {block.heading ? <h2 className="mb-6 text-3xl font-bold">{block.heading}</h2> : null}
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <ul className="grid list-none gap-6 p-0 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post._id} className="rounded-xl border border-gray-200 p-5">
              {post.categories?.length ? (
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                  {post.categories.map((category) => category.title).join(' · ')}
                </p>
              ) : null}
              <h3 className="mb-2 text-lg font-semibold">
                <Link href={`/blog/${post.slug}`} className="text-gray-900 no-underline">
                  {post.title}
                </Link>
              </h3>
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
    </section>
  )
}
