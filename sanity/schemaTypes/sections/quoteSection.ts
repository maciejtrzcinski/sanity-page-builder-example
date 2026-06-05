import {defineField, defineType} from 'sanity'

export const quoteSection = defineType({
  name: 'quoteSection',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({name: 'role', title: 'Role / company', type: 'string'}),
    defineField({name: 'sectionId', title: 'Section anchor id', type: 'string'}),
  ],
  preview: {
    select: {title: 'quote', subtitle: 'author'},
    prepare: ({title, subtitle}) => ({
      title: title ? `“${title}”` : 'Quote',
      subtitle: subtitle || 'Quote section',
    }),
  },
})
