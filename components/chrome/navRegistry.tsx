import type {ReactNode} from 'react'

import {
  createPageBuilderFromSections,
  createSectionFactory,
} from '@maciejtrzcinski/sanity-page-builder-core'

import {CtaNav} from './CtaNav'
import {MinimalNav} from './MinimalNav'
import type {ChromeContext, NavBlock} from './types'

// Same registry pattern as the page builder, but for navigation variants: each
// variant co-locates its `_type`, GROQ projection, and renderer.
const defineNav = createSectionFactory<NavBlock, ChromeContext, ReactNode>()

const navs = [
  defineNav({
    type: 'minimalNav',
    query: `logoText, links[]{ _key, label, href }`,
    render: (block, ctx) => <MinimalNav block={block} siteName={ctx.siteName} />,
  }),
  defineNav({
    type: 'ctaNav',
    query: `logoText, links[]{ _key, label, href }, ctaLabel, ctaHref`,
    render: (block, ctx) => <CtaNav block={block} siteName={ctx.siteName} />,
  }),
  // "None" marker — renders no navigation.
  defineNav({type: 'noNav', query: ``, render: () => null}),
]

const navBuilder = createPageBuilderFromSections<NavBlock, ChromeContext, ReactNode>(navs)

/** Render one navigation block to its component. */
export const renderNav = navBuilder.renderBlock

/** Combined GROQ projection for the navigation variants. */
export const navProjection = navBuilder.query
