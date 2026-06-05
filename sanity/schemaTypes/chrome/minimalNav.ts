import {defineField, defineType} from 'sanity'

/** Logo text + a row of links. */
export const minimalNav = defineType({
  name: 'minimalNav',
  title: 'Minimal nav',
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
  ],
  preview: {
    select: {links: 'links'},
    prepare: ({links}) => ({
      title: 'Minimal nav',
      subtitle: `${links?.length ?? 0} link(s)`,
    }),
  },
})
