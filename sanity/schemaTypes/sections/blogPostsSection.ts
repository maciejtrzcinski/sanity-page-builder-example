import {defineField, defineType} from 'sanity'

/**
 * Page-builder section that lists blog posts. Add it to any page builder (e.g.
 * the Blog Index) to render a grid of recent posts, optionally filtered by
 * category.
 */
export const blogPostsSection = defineType({
  name: 'blogPostsSection',
  title: 'Blog Posts',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'category',
      title: 'Filter by category',
      type: 'reference',
      to: [{type: 'blogCategory'}],
      description: 'Leave empty to show posts from all categories.',
    }),
    defineField({
      name: 'max',
      title: 'Maximum posts',
      type: 'number',
      initialValue: 6,
      validation: (rule) => rule.min(1).max(24).integer(),
    }),
    defineField({name: 'sectionId', title: 'Section anchor id', type: 'string'}),
  ],
  preview: {
    select: {heading: 'heading', category: 'category.title'},
    prepare: ({heading, category}) => ({
      title: heading || 'Blog Posts',
      subtitle: category ? `Category: ${category}` : 'All categories',
    }),
  },
})
