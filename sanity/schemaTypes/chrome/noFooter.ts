import {defineField, defineType} from 'sanity'

/**
 * "None" footer marker: selecting it renders no footer. Distinct from leaving
 * the field empty (which inherits the global footer). Works site-wide
 * (Site Settings) or per page (override).
 */
export const noFooter = defineType({
  name: 'noFooter',
  title: 'No footer',
  type: 'object',
  // Object types need at least one field; this marker carries no data.
  fields: [defineField({name: 'disabled', type: 'boolean', hidden: true, initialValue: true})],
  preview: {
    prepare: () => ({title: 'No footer'}),
  },
})
