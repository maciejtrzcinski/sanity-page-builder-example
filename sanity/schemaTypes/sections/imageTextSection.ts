import {defineField, defineType} from 'sanity'

import {getImageAssetRef} from '../shared/imageValidation'

export const imageTextSection = defineType({
  name: 'imageTextSection',
  title: 'Image + Text',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              if (getImageAssetRef(context.parent) && !alt) return 'Required'
              return true
            }),
        }),
      ],
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 4}),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {list: ['left', 'right'], layout: 'radio', direction: 'horizontal'},
      initialValue: 'left',
    }),
    defineField({name: 'sectionId', title: 'Section anchor id', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare: ({title, media}) => ({
      title: title || 'Image + Text',
      subtitle: 'Image + Text section',
      media,
    }),
  },
})
