import {defineField, defineType} from 'sanity'
import {sectionField} from '@maciejtrzcinski/sanity-plugin-section-builder'

import {SECTIONS} from '../../sectionBuilderConfig'
import {seoFields} from '../shared/seoFields'

/**
 * Blog index singleton, rendered at /blog. Composed with the page builder —
 * add a "Blog Posts" section to list posts, plus any other sections.
 */
export const blogIndex = defineType({
  name: 'blogIndex',
  title: 'Blog Index',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    // Same page-builder field as `page`.
    {
      ...sectionField(SECTIONS, {title: 'Page builder'}),
      group: 'content',
    },
    ...seoFields.map((field) => ({...field, group: 'seo'})),
  ],
  preview: {
    prepare: () => ({title: 'Blog Index', subtitle: '/blog'}),
  },
})
