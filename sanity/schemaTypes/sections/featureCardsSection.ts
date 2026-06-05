import {defineArrayMember, defineField, defineType} from 'sanity'

export const featureCardsSection = defineType({
  name: 'featureCardsSection',
  title: 'Feature Cards',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({name: 'sectionId', title: 'Section anchor id', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', features: 'features'},
    prepare: ({title, features}) => ({
      title: title || 'Feature Cards',
      subtitle: `${features?.length ?? 0} feature(s)`,
    }),
  },
})
