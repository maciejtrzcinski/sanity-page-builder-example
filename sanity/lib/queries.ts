import {defineQuery} from 'next-sanity'

import type {BlogPost, BlogPostListItem} from '@/components/blog/types'
import {footerProjection} from '@/components/chrome/footerRegistry'
import {navProjection} from '@/components/chrome/navRegistry'
import type {FooterBlock, NavBlock} from '@/components/chrome/types'
import {pageBuilderProjection} from '@/components/pageBuilder/registry'
import type {PageQueryResult} from '@/components/pageBuilder/types'
import type {PagesQueryResult, SitemapQueryResult} from '@/sanity/sanity.types'

import {client} from './client'
import {sanityFetch} from './live'

/** A page in the index list — derived from the generated `pagesQuery` result. */
export type PageListItem = PagesQueryResult[number]

// Per-page nav/footer overrides: references to reusable navigation/footer
// documents, dereferenced to their single variant and projected from the chrome
// registries. Reused by the page and home-page queries.
const chromeOverrideProjection = `
  "navigationOverride": navigationOverride->variant[0]{ _type, ${navProjection} },
  "footerOverride": footerOverride->variant[0]{ _type, ${footerProjection} }
`

const pagesQuery = defineQuery(`*[_type == "page" && defined(slug.current)]|order(title asc){
  _id, title, "slug": slug.current
}`)

// The `pageBuilder[]` projection is assembled from the section modules (registry)
// — every section fetches exactly the fields it renders.
const pageQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  ${chromeOverrideProjection},
  pageBuilder[]{
    _key,
    _type,
    ${pageBuilderProjection}
  }
}`

const slugsQuery = defineQuery(`*[_type == "page" && defined(slug.current)].slug.current`)

const sitemapQuery = defineQuery(`*[_type == "page" && defined(slug.current) && noIndex != true]{
  "slug": slug.current,
  "updatedAt": _updatedAt
}`)

/**
 * SEO fields for a single page, fetched separately from the render query so the
 * page body stays lean. `seoGraphImage` is projected raw (with its asset ref)
 * so `resolveOpenGraphImage` can build the social-card URL.
 */
export const pageDocSeoQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _type,
  "slug": slug.current,
  title,
  seoTitle,
  seoDescription,
  noIndex,
  seoGraphImage
}`)

/** Global site settings — currently just the default/fallback OG image. */
export const layoutSettingsQuery = defineQuery(`*[_type == "settings"][0]{
  "ogImage": ogImage
}`)

// Site-wide navigation + footer from Site Settings: references to reusable
// navigation/footer documents, dereferenced to their single variant.
const siteChromeQuery = `*[_type == "settings"][0]{
  "navigation": navigation->variant[0]{ _type, ${navProjection} },
  "footer": footer->variant[0]{ _type, ${footerProjection} }
}`

export type SiteChrome = {navigation: NavBlock | null; footer: FooterBlock | null}

/** The global navigation + footer, used as the default chrome for every page. */
export async function getGlobalChrome(): Promise<SiteChrome> {
  const {data} = await sanityFetch({query: siteChromeQuery, tags: ['settings']})
  return (data ?? {navigation: null, footer: null}) as SiteChrome
}

// The page referenced by Site Settings as the home page, dereferenced and
// projected like a normal page so it can render at `/`.
const homePageQuery = `*[_type == "settings"][0].homePage->{
  _id,
  title,
  "slug": slug.current,
  ${chromeOverrideProjection},
  pageBuilder[]{
    _key,
    _type,
    ${pageBuilderProjection}
  }
}`

/** SEO fields for the home page (Settings → Home Page). */
export const homePageSeoQuery = defineQuery(`*[_type == "settings"][0].homePage->{
  title,
  seoTitle,
  seoDescription,
  noIndex,
  seoGraphImage
}`)

/**
 * All pages, for the index list. The Live API attaches Content Lake `syncTags`
 * automatically; the explicit `page` tag lets a webhook revalidate the list
 * on-demand via `revalidateTag('page')`.
 */
export async function getPages(): Promise<PageListItem[]> {
  const {data} = await sanityFetch({query: pagesQuery, tags: ['page']})
  return data ?? []
}

/**
 * A single page by slug. Tagged with both the shared `page` tag and a
 * per-slug tag so it can be revalidated individually or as part of the set.
 */
export async function getPage(slug: string): Promise<PageQueryResult> {
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug},
    tags: ['page', `page:${slug}`],
  })
  return data as PageQueryResult
}

/**
 * The home page (Settings → Home Page), dereferenced and rendered at `/`.
 * Returns null when no home page is configured, so `/` can fall back to a list.
 */
export async function getHomePage(): Promise<PageQueryResult> {
  const {data} = await sanityFetch({query: homePageQuery, tags: ['page', 'settings']})
  return (data ?? null) as PageQueryResult
}

/**
 * Slugs for `generateStaticParams`. This runs at build time with no request
 * context, so it uses the plain client rather than the Live API.
 */
export async function getPageSlugs(): Promise<string[]> {
  const slugs = await client.fetch(slugsQuery)
  // The query already filters `defined(slug.current)`, but typegen can't infer
  // that, so narrow out the nullable values it reports.
  return slugs.filter((slug): slug is string => slug !== null)
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

// Blog index singleton (rendered at /blog), composed with the page builder.
const blogIndexQuery = `*[_type == "blogIndex"][0]{
  _id,
  title,
  "slug": null,
  pageBuilder[]{
    _key,
    _type,
    ${pageBuilderProjection}
  }
}`

const blogPostQuery = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage,
  "categories": categories[]->{title, "slug": slug.current},
  "authors": authors[]->{name, role, bio, photo},
  body
}`)

const blogPostsQuery =
  defineQuery(`*[_type == "blogPost" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) [0...50]{
  _id, title, "slug": slug.current, excerpt, publishedAt,
  "categories": categories[]->{title, "slug": slug.current},
  "authors": authors[]->name
}`)

const blogPostSlugsQuery = defineQuery(
  `*[_type == "blogPost" && defined(slug.current)].slug.current`,
)

/** SEO fields for a blog post (excerpt is the meta-description fallback). */
export const blogPostSeoQuery = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  title,
  seoTitle,
  "seoDescription": coalesce(seoDescription, excerpt),
  noIndex,
  seoGraphImage
}`)

/** SEO fields for the blog index. */
export const blogIndexSeoQuery = defineQuery(`*[_type == "blogIndex"][0]{
  title,
  seoTitle,
  seoDescription,
  noIndex,
  seoGraphImage
}`)

/** Blog index (Settings-free singleton). Tagged `blog` for revalidation. */
export async function getBlogIndex(): Promise<PageQueryResult> {
  const {data} = await sanityFetch({query: blogIndexQuery, tags: ['blog']})
  return (data ?? null) as PageQueryResult
}

/** A single blog post by slug. */
export async function getBlogPost(slug: string): Promise<BlogPost> {
  const {data} = await sanityFetch({
    query: blogPostQuery,
    params: {slug},
    tags: ['blog', `blogPost:${slug}`],
  })
  return data
}

/** Recent posts, used by the blog-index fallback when no index doc exists. */
export async function getBlogPosts(): Promise<BlogPostListItem[]> {
  const {data} = await sanityFetch({query: blogPostsQuery, tags: ['blog']})
  return data ?? []
}

/** Slugs for the blog post `generateStaticParams` (build-time, plain client). */
export async function getBlogPostSlugs(): Promise<string[]> {
  const slugs = await client.fetch(blogPostSlugsQuery)
  return slugs.filter((slug): slug is string => slug !== null)
}

export type SitemapEntry = SitemapQueryResult[number]

/**
 * Indexable pages for `sitemap.ts` — excludes `noIndex` pages. Uses the plain
 * client (the sitemap is regenerated on the `page` tag / ISR interval, not live).
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    return await client.fetch(sitemapQuery, {}, {next: {revalidate: 3600, tags: ['page']}})
  } catch {
    return []
  }
}
