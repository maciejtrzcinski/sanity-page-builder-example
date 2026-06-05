import type {MetadataRoute} from 'next'

import {siteUrl} from '@/lib/site'
import {getSitemapEntries} from '@/sanity/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getSitemapEntries()

  return [
    {url: siteUrl, changeFrequency: 'daily', priority: 1},
    ...pages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
