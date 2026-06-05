import 'server-only'

import {cache} from 'react'

import {client} from './client'
import {layoutSettingsQuery} from './queries'
import type {SanityImageWithAlt} from './utils'

export type LayoutSettings = {ogImage: SanityImageWithAlt} | null

/**
 * Reads global site settings through a cached, non-live layer.
 *
 * Deliberately uses the plain client (not the Live API): calling `draftMode()`
 * here would opt every page that builds SEO metadata into dynamic rendering.
 * `cache()` dedupes within a request; `next.tags` allows on-demand revalidation
 * via `revalidateTag('settings')`. Editors lose live preview of the global
 * default OG image only — per-doc `seoGraphImage` overrides are unaffected.
 */
export const getCachedLayoutSettings = cache(async (): Promise<LayoutSettings> => {
  return client.fetch<LayoutSettings>(
    layoutSettingsQuery,
    {},
    {stega: false, next: {revalidate: 3600, tags: ['settings']}},
  )
})
