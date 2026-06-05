import {createImageUrlBuilder} from '@sanity/image-url'

import {client} from './client'

const builder = createImageUrlBuilder(client)

/** A Sanity image field with an optional `alt`, as projected by our SEO queries. */
export type SanityImageWithAlt = {
  asset?: {_ref?: string | null} | null
  alt?: string | null
} | null

/**
 * Base (un-resized) CDN URL for a Sanity image, for use with `next/image` plus
 * {@link sanityImageLoader}. Returns `null` when no asset is set.
 */
export function sanityImageUrl(source: NonNullable<SanityImageWithAlt>): string | null {
  if (!source.asset?._ref) return null
  return builder.image(source).auto('format').url()
}

/**
 * Intrinsic pixel dimensions encoded in a Sanity asset `_ref`
 * (e.g. `image-abc123-1600x900-jpg`), or `null` if the ref isn't recognizable.
 * Lets us hand `next/image` real dimensions without a metadata round-trip.
 */
export function imageDimensions(ref: string): {width: number; height: number} | null {
  const match = /-(\d+)x(\d+)-[a-z0-9]+$/i.exec(ref)
  return match ? {width: Number(match[1]), height: Number(match[2])} : null
}

export type OpenGraphImage = {url: string; width: number; height: number; alt?: string}

const OG_WIDTH = 1200
const OG_HEIGHT = 630

/**
 * Resolves a Sanity image field into an Open Graph image (cropped to the
 * 1200×630 social-card size via the image CDN). Returns `undefined` when no
 * asset is set, so callers can fall back to a site-wide default.
 */
export function resolveOpenGraphImage(
  image: SanityImageWithAlt | undefined,
  width = OG_WIDTH,
  height = OG_HEIGHT,
): OpenGraphImage | undefined {
  if (!image?.asset?._ref) return undefined

  const url = builder.image(image).width(width).height(height).fit('crop').auto('format').url()
  const alt = typeof image.alt === 'string' && image.alt ? image.alt : undefined

  return {url, width, height, ...(alt ? {alt} : {})}
}
