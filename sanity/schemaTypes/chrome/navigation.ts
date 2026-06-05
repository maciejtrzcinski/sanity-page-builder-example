import {defineField, defineType} from 'sanity'

import {NAV_TYPES} from './chromeTypes'

/**
 * A reusable navigation document. Author it once, then pick it by reference in
 * Site Settings (site-wide default) or on a page's Appearance tab (override).
 * Holds exactly one variant (minimal / with-CTA / none) so a single bar can be
 * shared across many pages.
 */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal name, shown when selecting this navigation.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'array',
      of: NAV_TYPES.map((type) => ({type})),
      description: 'Pick one navigation style.',
      validation: (rule) => rule.required().max(1),
    }),
  ],
  preview: {
    select: {title: 'title', variant: 'variant'},
    prepare: ({title, variant}) => ({
      title: title || 'Navigation',
      subtitle: variant?.[0]?._type,
    }),
  },
})
