import {defineField, defineType} from 'sanity'

/** A line of text (e.g. copyright) + a row of links. */
export const simpleFooter = defineType({
  name: 'simpleFooter',
  title: 'Simple footer',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      description: 'Copyright or tagline. "{year}" is replaced with the current year.',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{type: 'navLink'}],
    }),
  ],
  preview: {
    select: {text: 'text', links: 'links'},
    prepare: ({text, links}) => ({
      title: 'Simple footer',
      subtitle: text || `${links?.length ?? 0} link(s)`,
    }),
  },
})
