import type {ReactNode} from 'react'

import {
  createPageBuilderFromSections,
  createSectionFactory,
} from '@maciejtrzcinski/sanity-page-builder-core'

import {ColumnsFooter} from './ColumnsFooter'
import {SimpleFooter} from './SimpleFooter'
import type {ChromeContext, FooterBlock} from './types'

const defineFooter = createSectionFactory<FooterBlock, ChromeContext, ReactNode>()

const footers = [
  defineFooter({
    type: 'simpleFooter',
    query: `text, links[]{ _key, label, href }`,
    render: (block) => <SimpleFooter block={block} />,
  }),
  defineFooter({
    type: 'columnsFooter',
    query: `text, columns[]{ _key, title, links[]{ _key, label, href } }`,
    render: (block) => <ColumnsFooter block={block} />,
  }),
  // "None" marker — renders no footer.
  defineFooter({type: 'noFooter', query: ``, render: () => null}),
]

const footerBuilder = createPageBuilderFromSections<FooterBlock, ChromeContext, ReactNode>(footers)

/** Render one footer block to its component. */
export const renderFooter = footerBuilder.renderBlock

/** Combined GROQ projection for the footer variants. */
export const footerProjection = footerBuilder.query
