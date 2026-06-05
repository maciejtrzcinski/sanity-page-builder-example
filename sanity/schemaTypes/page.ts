import {defineField, defineType} from 'sanity'
import {sectionField} from '@maciejtrzcinski/sanity-plugin-section-builder'

import {SECTIONS} from '../sectionBuilderConfig'
import {seoFields} from './shared/seoFields'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'appearance', title: 'Appearance'},
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
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description:
        'Full path from the site root. Use "/" for nested pages, e.g. docs/getting-started.',
      options: {
        source: 'title',
        maxLength: 96,
        // Keep "/" so editors can author nested paths; the catch-all route
        // splits the stored path back into segments.
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9/-]/g, '')
            .replace(/\/{2,}/g, '/')
            .replace(/^\/|\/$/g, '')
            .slice(0, 96),
      },
      validation: (rule) =>
        rule.required().custom((slug) => {
          const current = (slug as {current?: string} | undefined)?.current
          if (current === 'blog' || current?.startsWith('blog/')) {
            return 'Slugs under "blog" are reserved for the blog (/blog and /blog/<post>).'
          }
          return true
        }),
    }),
    // The page builder field comes from the plugin: it builds the array members
    // and wires the insert-menu grid (with preview thumbnails) from SECTIONS.
    {
      ...sectionField(SECTIONS, {title: 'Page builder'}),
      group: 'content',
    },
    // Optional per-page overrides of the global nav/footer (Site Settings).
    defineField({
      name: 'navigationOverride',
      title: 'Navigation',
      type: 'reference',
      to: [{type: 'navigation'}],
      group: 'appearance',
      description: 'Overrides the site-wide navigation for this page. Leave empty to inherit.',
    }),
    defineField({
      name: 'footerOverride',
      title: 'Footer',
      type: 'reference',
      to: [{type: 'footer'}],
      group: 'appearance',
      description: 'Overrides the site-wide footer for this page. Leave empty to inherit.',
    }),
    // Shared SEO/social fields, surfaced under their own Studio tab.
    ...seoFields.map((field) => ({...field, group: 'seo'})),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
    prepare: ({title, subtitle}) => ({title, subtitle: subtitle ? `/${subtitle}` : undefined}),
  },
})
