import {defineField, defineType} from 'sanity'

import {FOOTER_TYPES} from './chromeTypes'

/**
 * A reusable footer document. Author it once, then pick it by reference in Site
 * Settings (site-wide default) or on a page's Appearance tab (override). Holds
 * exactly one variant (simple / columns / none).
 */
export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal name, shown when selecting this footer.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'array',
      of: FOOTER_TYPES.map((type) => ({type})),
      description: 'Pick one footer style.',
      validation: (rule) => rule.required().max(1),
    }),
  ],
  preview: {
    select: {title: 'title', variant: 'variant'},
    prepare: ({title, variant}) => ({
      title: title || 'Footer',
      subtitle: variant?.[0]?._type,
    }),
  },
})
