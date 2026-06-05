import type {
  PageBuilderBlockOf,
  PageBuilderBlocksOf,
} from '@maciejtrzcinski/sanity-page-builder-core'

export type HeroBlock = {
  _type: 'heroSection'
  _key: string
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  sectionId?: string | null
}

export type FeatureCardsBlock = {
  _type: 'featureCardsSection'
  _key: string
  heading?: string | null
  features: Array<{_key: string; title: string; body?: string | null}> | null
  sectionId?: string | null
}

export type QuoteBlock = {
  _type: 'quoteSection'
  _key: string
  quote: string
  author?: string | null
  role?: string | null
  sectionId?: string | null
}

export type FaqBlock = {
  _type: 'faqSection'
  _key: string
  heading?: string | null
  items: Array<{_key: string; question: string; answer: string}> | null
  sectionId?: string | null
}

export type CtaBannerBlock = {
  _type: 'ctaBannerSection'
  _key: string
  heading: string
  body?: string | null
  buttonLabel?: string | null
  buttonHref?: string | null
  sectionId?: string | null
}

export type BlogPostsBlock = {
  _type: 'blogPostsSection'
  _key: string
  heading?: string | null
  sectionId?: string | null
  max?: number | null
  posts?: Array<{
    _id: string
    title: string
    slug: string | null
    excerpt?: string | null
    publishedAt?: string | null
    categories?: Array<{title: string; slug: string | null}> | null
    authors?: string[] | null
  }> | null
}

/**
 * In a real project this is produced by `sanity typegen` (e.g. `PageDocQueryResult`).
 * Here we hand-write the query result shape, then let the package extract the
 * block union from it — exactly the call you'd make against the generated type:
 *
 *   export type PageBuilderBlock = PageBuilderBlockOf<PageDocQueryResult>
 */
export type PageQueryResult = {
  _id: string
  title: string
  slug: string | null
  navigationOverride?: import('../chrome/types').NavBlock | null
  footerOverride?: import('../chrome/types').FooterBlock | null
  pageBuilder: Array<
    HeroBlock | FeatureCardsBlock | QuoteBlock | FaqBlock | CtaBannerBlock | BlogPostsBlock
  > | null
} | null

export type PageBuilderBlocks = PageBuilderBlocksOf<PageQueryResult>
export type PageBuilderBlock = PageBuilderBlockOf<PageQueryResult>
