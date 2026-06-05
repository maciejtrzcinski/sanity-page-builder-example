import {Fragment, type ReactNode} from 'react'

import {renderPageBuilderBlocks} from '@maciejtrzcinski/sanity-page-builder-core'

import type {RenderContext} from './context'
import {renderBlock} from './registry'
import type {PageBuilderBlock, PageBuilderBlocks} from './types'

/**
 * Renders a page's `pageBuilder` array. The loop + the section-anchor convention
 * live in the package; we pass the blocks, a render context, and a `wrap` that
 * creates the actual elements.
 *
 * (To enable Presentation click-to-edit overlays, pass `documentId` + `pathBase`
 * + `dataAttr` to `renderPageBuilderBlocks` — omitted here to keep the example
 * focused on the page builder.)
 */
export function PageBuilder({blocks}: {blocks: PageBuilderBlocks}) {
  if (!blocks || blocks.length === 0) return null

  const context: RenderContext = {}

  return (
    <>
      {renderPageBuilderBlocks<PageBuilderBlock, RenderContext, ReactNode>(blocks, context, {
        renderBlock,
        wrap: (content, {key, id}) =>
          id ? (
            <section key={key} id={id}>
              {content}
            </section>
          ) : (
            <Fragment key={key}>{content}</Fragment>
          ),
      })}
    </>
  )
}
