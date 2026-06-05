import {defineField, defineType} from 'sanity'

/**
 * "None" navigation marker: selecting it renders no navigation. Distinct from
 * leaving the field empty (which inherits the global nav). Works site-wide
 * (Site Settings) or per page (override).
 */
export const noNav = defineType({
  name: 'noNav',
  title: 'No navigation',
  type: 'object',
  // Object types need at least one field; this marker carries no data.
  fields: [defineField({name: 'disabled', type: 'boolean', hidden: true, initialValue: true})],
  preview: {
    prepare: () => ({title: 'No navigation'}),
  },
})
