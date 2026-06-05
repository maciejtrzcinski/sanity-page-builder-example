import {defineField, defineType} from 'sanity'

/** Logo text + links + a call-to-action button. */
export const ctaNav = defineType({
  name: 'ctaNav',
  title: 'Nav with CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'logoText',
      title: 'Logo text',
      type: 'string',
      description: 'Falls back to the site name when empty.',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{type: 'navLink'}],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA URL',
      type: 'string',
    }),
  ],
  preview: {
    select: {links: 'links', ctaLabel: 'ctaLabel'},
    prepare: ({links, ctaLabel}) => ({
      title: 'Nav with CTA',
      subtitle: [ctaLabel, `${links?.length ?? 0} link(s)`].filter(Boolean).join(' · '),
    }),
  },
})
