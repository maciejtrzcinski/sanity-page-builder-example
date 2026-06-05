import {defineField, defineType} from 'sanity'

/**
 * Site-wide settings singleton: the page rendered at the site root, and the
 * default social/OG image used as a fallback when a page has none of its own.
 */
export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'homePage',
      title: 'Home Page',
      type: 'reference',
      to: [{type: 'page'}],
      description: 'The page rendered at the site root (/). Falls back to a list of all pages.',
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'reference',
      to: [{type: 'navigation'}],
      description: 'Site-wide navigation. A page can override it.',
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'reference',
      to: [{type: 'footer'}],
      description: 'Site-wide footer. A page can override it.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default social image',
      type: 'image',
      description:
        'Fallback Open Graph / social card image, used when a page has no social image of its own. Recommended size: 1200 × 627 px.',
      options: {hotspot: true},
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
