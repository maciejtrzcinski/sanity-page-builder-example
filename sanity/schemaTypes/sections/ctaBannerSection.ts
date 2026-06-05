import {defineField, defineType} from 'sanity'

export const ctaBannerSection = defineType({
  name: 'ctaBannerSection',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 2}),
    defineField({name: 'buttonLabel', title: 'Button label', type: 'string'}),
    defineField({
      name: 'buttonHref',
      title: 'Button link',
      type: 'url',
      description: 'Internal path (e.g. /studio) or absolute URL.',
      validation: (rule) =>
        rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
    defineField({name: 'sectionId', title: 'Section anchor id', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'body'},
    prepare: ({title, subtitle}) => ({
      title: title || 'CTA Banner',
      subtitle: subtitle || 'CTA banner',
    }),
  },
})
