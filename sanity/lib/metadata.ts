import 'server-only'

import type {Metadata} from 'next'

import {siteName} from '@/lib/site'

import {getCachedLayoutSettings} from './cachedFetch'
import {sanityFetch} from './live'
import {blogIndexSeoQuery, blogPostSeoQuery, homePageSeoQuery, pageDocSeoQuery} from './queries'
import {resolveOpenGraphImage} from './utils'

type ResolvedOgImage = NonNullable<ReturnType<typeof resolveOpenGraphImage>>

/**
 * Robots policy for normally indexable pages.
 * Matches the policy emitted by buildSeoMetadata so hand-rolled
 * `export const metadata` blocks stay in sync with CMS-driven routes.
 */
export const INDEXABLE_ROBOTS: NonNullable<Metadata['robots']> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

type SeoMetadataSource = {
  title?: string | null
  description?: string | null
  image?: Parameters<typeof resolveOpenGraphImage>[0]
  /** Pre-resolved fallback OG image (typically site settings) used when `image` is empty. */
  fallbackImage?: ResolvedOgImage | null
  noIndex?: boolean | null
  /** Relative path (e.g. `/about`) — drives canonical URL and og:url. Resolved against root metadataBase. */
  path?: string | null
}

function normalizePath(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  return path.startsWith('/') ? path : `/${path}`
}

export function buildSeoMetadata({
  title,
  description,
  image,
  fallbackImage,
  noIndex,
  path,
}: SeoMetadataSource): Metadata {
  const ogImage = resolveOpenGraphImage(image) ?? fallbackImage ?? undefined
  const titleStr = title ?? undefined
  const descStr = description ?? undefined
  const canonical = normalizePath(path)

  return {
    title: titleStr,
    description: descStr,
    alternates: canonical ? {canonical} : undefined,
    openGraph: {
      type: 'website',
      // Next.js replaces (does not deep-merge) the parent layout's openGraph
      // when a child sets its own — keep siteName here so it's always emitted.
      siteName,
      ...(titleStr ? {title: titleStr} : {}),
      ...(descStr ? {description: descStr} : {}),
      ...(canonical ? {url: canonical} : {}),
      ...(ogImage ? {images: [ogImage]} : {}),
    },
    twitter: {
      card: 'summary_large_image',
      ...(titleStr ? {title: titleStr} : {}),
      ...(descStr ? {description: descStr} : {}),
      ...(ogImage?.url ? {images: [ogImage.url]} : {}),
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        }
      : INDEXABLE_ROBOTS,
  }
}

async function fetchFallbackOgImage(): Promise<ResolvedOgImage | undefined> {
  // Always read from the cached layer. Calling `draftMode()` here would opt
  // every page that builds SEO metadata into dynamic rendering. Editors lose
  // live preview of the global default OG image; per-doc `seoGraphImage`
  // overrides are unaffected.
  const data = await getCachedLayoutSettings()
  return resolveOpenGraphImage(data?.ogImage) ?? undefined
}

type PageSeoDoc = {
  title?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoGraphImage?: Parameters<typeof buildSeoMetadata>[0]['image']
  noIndex?: boolean | null
} | null

async function seoFromQuery(
  query: string,
  params: Record<string, unknown>,
  path: string,
): Promise<Metadata> {
  try {
    const [{data}, fallbackImage] = await Promise.all([
      sanityFetch({query, params, stega: false}),
      fetchFallbackOgImage(),
    ])
    const doc = data as PageSeoDoc
    if (!doc) return {}
    return buildSeoMetadata({
      title: doc.seoTitle ?? doc.title,
      description: doc.seoDescription,
      image: doc.seoGraphImage,
      fallbackImage,
      noIndex: doc.noIndex,
      path,
    })
  } catch {
    // Unreachable dataset (e.g. before Sanity creds are set): emit no metadata
    // rather than failing the render/build.
    return {}
  }
}

/**
 * Build full SEO metadata for a page route, falling back to the site-wide
 * default OG image from settings when the page has none of its own.
 */
export function fetchPageSeoMetadata(slug: string): Promise<Metadata> {
  return seoFromQuery(pageDocSeoQuery, {slug}, slug ? `/${slug}` : '/')
}

/**
 * SEO metadata for the home page (Settings → Home Page), with `/` as the
 * canonical path. Returns `{}` when no home page is configured.
 */
export function fetchHomeSeoMetadata(): Promise<Metadata> {
  return seoFromQuery(homePageSeoQuery, {}, '/')
}

/** SEO metadata for the blog index, with `/blog` as the canonical path. */
export function fetchBlogIndexSeoMetadata(): Promise<Metadata> {
  return seoFromQuery(blogIndexSeoQuery, {}, '/blog')
}

/** SEO metadata for a single blog post, canonical `/blog/<slug>`. */
export function fetchBlogPostSeoMetadata(slug: string): Promise<Metadata> {
  return seoFromQuery(blogPostSeoQuery, {slug}, `/blog/${slug}`)
}
