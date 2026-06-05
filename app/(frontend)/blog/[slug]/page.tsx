import type {Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'

import {PostBody} from '@/components/blog/PostBody'
import {SiteShell} from '@/components/chrome/SiteShell'
import {siteUrl} from '@/lib/site'
import {fetchBlogPostSeoMetadata} from '@/sanity/lib/metadata'
import {getBlogPost, getBlogPostSlugs} from '@/sanity/lib/queries'
import {sanityImageUrl} from '@/sanity/lib/utils'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const slugs = await getBlogPostSlugs()
    return slugs.map((slug) => ({slug}))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  return fetchBlogPostSeoMetadata(slug)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})
}

export default async function BlogPostPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  const coverSrc = post.coverImage?.asset?._ref ? sanityImageUrl(post.coverImage) : null

  const authors = post.authors ?? []
  const authorAvatars = authors
    .map((author) => ({
      name: author.name,
      src: author.photo?.asset?._ref ? sanityImageUrl(author.photo) : null,
      alt: author.photo?.alt || author.name || '',
    }))
    .filter((author) => author.src)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `${siteUrl}/blog/${slug}`,
    ...(post.publishedAt ? {datePublished: post.publishedAt} : {}),
    ...(post.excerpt ? {description: post.excerpt} : {}),
    ...(authors.length
      ? {author: authors.map((author) => ({'@type': 'Person', name: author.name}))}
      : {}),
  }

  return (
    <SiteShell>
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
        {post.categories?.length ? (
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-accent">
            {post.categories.map((category) => category.title).join(' · ')}
          </p>
        ) : null}
        <h1 className="mb-3 text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="mb-6 flex items-center gap-3">
          {authorAvatars.length ? (
            <div className="flex -space-x-2">
              {authorAvatars.map((author) => (
                <div
                  key={author.name}
                  className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white"
                >
                  <Image
                    src={author.src!}
                    alt={author.alt}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className="text-sm">
            {authors.length ? (
              <p className="m-0 font-medium text-gray-900">
                {authors.map((author) => author.name).join(', ')}
              </p>
            ) : null}
            <p className="m-0 text-gray-400">
              {[
                // Show the role only when there's a single author, to stay legible.
                authors.length === 1 ? authors[0].role : null,
                post.publishedAt && formatDate(post.publishedAt),
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
        </div>
        {coverSrc ? (
          // Crop to the cover's 1600×840 (40:21) ratio via the container; the
          // image fills it and next/image requests an appropriately sized source.
          <div className="relative mb-8 aspect-40/21 w-full overflow-hidden rounded-xl">
            <Image
              src={coverSrc}
              alt={post.coverImage?.alt || post.title || ''}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 812px"
              className="object-cover"
            />
          </div>
        ) : null}
        {post.body ? <PostBody value={post.body} /> : null}
      </article>
    </SiteShell>
  )
}
