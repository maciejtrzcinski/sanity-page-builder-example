import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'

import type {BlogPost} from '@/components/blog/types'
import {imageDimensions, sanityImageUrl} from '@/sanity/lib/utils'

/** The Portable Text body as projected by `blogPostQuery` (generated type). */
type PostBodyValue = NonNullable<NonNullable<BlogPost>['body']>

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
    h2: ({children}) => <h2 className="mb-3 mt-8 text-2xl font-bold tracking-tight">{children}</h2>,
    h3: ({children}) => <h3 className="mb-2 mt-6 text-xl font-semibold">{children}</h3>,
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-4 border-gray-200 pl-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}) => <ul className="mb-4 list-disc pl-6">{children}</ul>,
    number: ({children}) => <ol className="mb-4 list-decimal pl-6">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    link: ({children, value}) => (
      <a href={value?.href} className="text-accent underline">
        {children}
      </a>
    ),
  },
  types: {
    image: ({value}) => {
      // An image block with no uploaded asset (e.g. a placeholder added in the
      // Studio) can't resolve a URL — skip it rather than throwing.
      const ref = value?.asset?._ref
      if (!ref) return null
      const src = sanityImageUrl(value as Parameters<typeof sanityImageUrl>[0])
      // Intrinsic dimensions come from the asset ref, so next/image can reserve
      // space and avoid layout shift; bail out if either can't be resolved.
      const dimensions = imageDimensions(ref)
      if (!src || !dimensions) return null
      return (
        <Image
          src={src}
          alt={value?.alt || ''}
          width={dimensions.width}
          height={dimensions.height}
          // Content column is max-w-[860px] minus px-6 padding (~812px).
          sizes="(max-width: 860px) 100vw, 812px"
          className="my-6 h-auto w-full rounded-lg"
        />
      )
    },
  },
}

export function PostBody({value}: {value: PostBodyValue}) {
  // TypeGen types body blocks with optional `children`, whereas @portabletext/react's
  // PortableTextBlock requires it — structurally compatible at runtime, so cast here.
  return <PortableText value={value as PortableTextBlock[]} components={components} />
}
