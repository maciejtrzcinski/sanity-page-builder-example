import {defineField, defineType} from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'subheading', title: 'Subheading', type: 'text', rows: 2}),
    defineField({name: 'ctaLabel', title: 'CTA label', type: 'string'}),
    defineField({
      name: 'ctaHref',
      title: 'CTA link',
      type: 'url',
      description: 'Internal path (e.g. /studio) or absolute URL.',
      validation: (rule) =>
        rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
    defineField({
      name: 'sectionId',
      title: 'Section anchor id',
      type: 'string',
      description: 'Optional #anchor for in-page links.',
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'eyebrow'},
    prepare: ({title, subtitle}) => ({
      title: title || 'Hero',
      subtitle: subtitle || 'Hero section',
    }),
  },
})
