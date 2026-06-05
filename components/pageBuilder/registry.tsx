import type {ReactNode} from 'react'

import {
  createPageBuilderFromSections,
  createSectionFactory,
} from '@maciejtrzcinski/sanity-page-builder-core'

import {BlogPostsSection} from '../sections/BlogPostsSection'
import {CtaBanner} from '../sections/CtaBanner'
import {Faq} from '../sections/Faq'
import {FeatureCards} from '../sections/FeatureCards'
import {Hero} from '../sections/Hero'
import {Quote} from '../sections/Quote'
import type {RenderContext} from './context'
import type {PageBuilderBlock} from './types'

// One `defineSection` bound to our block union, context, and node type. Each
// section co-locates its `_type`, its GROQ projection, and its renderer — so they
// can't drift apart.
const defineSection = createSectionFactory<PageBuilderBlock, RenderContext, ReactNode>()

const sections = [
  defineSection({
    type: 'heroSection',
    query: `eyebrow, heading, subheading, ctaLabel, ctaHref, sectionId`,
    render: (block) => <Hero block={block} />,
  }),
  defineSection({
    type: 'featureCardsSection',
    query: `heading, features[]{ _key, title, body }, sectionId`,
    render: (block) => <FeatureCards block={block} />,
  }),
  defineSection({
    type: 'quoteSection',
    query: `quote, author, role, sectionId`,
    render: (block) => <Quote block={block} />,
  }),
  defineSection({
    type: 'faqSection',
    query: `heading, items[]{ _key, question, answer }, sectionId`,
    render: (block) => <Faq block={block} />,
  }),
  defineSection({
    type: 'ctaBannerSection',
    query: `heading, body, buttonLabel, buttonHref, sectionId`,
    render: (block) => <CtaBanner block={block} />,
  }),
  defineSection({
    type: 'blogPostsSection',
    // `^` refers to this section item: filter posts by its optional category
    // (empty = all; matches if the post is in that category), newest first.
    // The component slices to `max`.
    query: `heading, sectionId, max, "posts": *[
      _type == "blogPost" && (^.category._ref == null || ^.category._ref in categories[]._ref)
    ] | order(coalesce(publishedAt, _createdAt) desc) [0...50] {
      _id, title, "slug": slug.current, excerpt, publishedAt,
      "categories": categories[]->{title, "slug": slug.current},
      "authors": authors[]->name
    }`,
    render: (block) => <BlogPostsSection block={block} />,
  }),
]

const pageBuilder = createPageBuilderFromSections<PageBuilderBlock, RenderContext, ReactNode>(
  sections,
)

/** Dispatches a block to its renderer. */
export const renderBlock = pageBuilder.renderBlock

/**
 * Combined GROQ projection assembled from each section's `query` — drop it into
 * the `pageBuilder[]` projection so every section fetches exactly what it renders.
 */
export const pageBuilderProjection = pageBuilder.query
