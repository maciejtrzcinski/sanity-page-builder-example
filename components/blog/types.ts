import type {BlogPostQueryResult, BlogPostsQueryResult} from '@/sanity/sanity.types'

// These shapes are generated from the GROQ projections by Sanity TypeGen
// (run `pnpm typegen`), so they can't drift from the queries. We alias the
// generated result types to the names the blog components already import.

/** A single blog post as returned by `blogPostQuery` (null when not found). */
export type BlogPost = BlogPostQueryResult

/** A post in the blog listing as returned by `blogPostsQuery`. */
export type BlogPostListItem = BlogPostsQueryResult[number]
