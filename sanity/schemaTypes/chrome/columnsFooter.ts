import {defineArrayMember, defineField, defineType} from 'sanity'

/** Labeled columns of links, plus a line of text. */
export const columnsFooter = defineType({
  name: 'columnsFooter',
  title: 'Columns footer',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [{type: 'navLink'}],
            }),
          ],
          preview: {
            select: {title: 'title', links: 'links'},
            prepare: ({title, links}) => ({
              title: title || 'Column',
              subtitle: `${links?.length ?? 0} link(s)`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      description: 'Copyright or tagline. "{year}" is replaced with the current year.',
    }),
  ],
  preview: {
    select: {columns: 'columns'},
    prepare: ({columns}) => ({
      title: 'Columns footer',
      subtitle: `${columns?.length ?? 0} column(s)`,
    }),
  },
})
