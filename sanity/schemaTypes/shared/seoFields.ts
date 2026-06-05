import {defineField} from 'sanity'

/**
 * Shared SEO fields that can be reused across document types
 */
export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'Meta/SEO Title',
    type: 'string',
    description: 'Title used for SEO and social sharing',
  }),
  defineField({
    name: 'seoDescription',
    title: 'Meta/SEO Description',
    type: 'text',
    description: 'Description used for SEO and social sharing',
    rows: 3,
  }),
  defineField({
    name: 'seoGraphImage',
    title: 'Meta/SEO/Social Image',
    type: 'image',
    description:
      'Image displayed on social cards and search engine results. Recommended size: 1200 × 627 px (1.91:1 ratio, matches LinkedIn / Open Graph). Larger uploads are auto-cropped to fit.',
    options: {
      hotspot: true,
    },
  }),
  defineField({
    name: 'noIndex',
    title: 'No Index (Private)',
    type: 'boolean',
    description: 'Prevent search engines from indexing this page',
    initialValue: false,
  }),
]
