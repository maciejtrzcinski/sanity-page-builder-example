/**
 * Absolute site origin (no trailing slash) for canonical URLs, the sitemap,
 * robots, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
)

/** Site name used for the OG `siteName` and the default nav/footer logo text. */
export const siteName = 'Page Builder Example'
