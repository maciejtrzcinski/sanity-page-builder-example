import type {ImageLoaderProps} from 'next/image'

/**
 * Global `next/image` loader (wired up via `images.loaderFile` in
 * next.config.ts). It resizes through the Sanity image CDN rather than Next's
 * optimizer — Sanity already serves modern formats and on-the-fly resizing, so
 * we let its CDN do the work and skip the extra optimization hop (which also
 * means no `images.remotePatterns` entry is needed).
 *
 * A `loaderFile` must default-export the loader and applies to every
 * `<Image>` in the app, so non-Sanity sources (e.g. local `/public` assets)
 * are returned untouched for the browser to resolve.
 */
export default function sanityImageLoader({src, width, quality}: ImageLoaderProps): string {
  if (!/^https?:\/\//.test(src)) return src
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('fit', 'max')
  url.searchParams.set('auto', 'format')
  url.searchParams.set('q', String(quality ?? 75))
  return url.toString()
}
