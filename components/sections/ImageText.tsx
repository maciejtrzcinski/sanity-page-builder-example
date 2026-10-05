import Image from 'next/image'

import {imageDimensions, sanityImageUrl} from '@/sanity/lib/utils'

import type {ImageTextBlock} from '../pageBuilder/types'

export function ImageText({block}: {block: ImageTextBlock}) {
  const ref = block.image?.asset?._ref
  const src = block.image ? sanityImageUrl(block.image) : null
  const dimensions = ref ? imageDimensions(ref) : null
  const imageRight = block.imagePosition === 'right'

  return (
    <div className="grid items-center gap-8 border-b border-gray-200 py-10 sm:grid-cols-2">
      {src && dimensions ? (
        <Image
          src={src}
          alt={block.image?.alt || ''}
          width={dimensions.width}
          height={dimensions.height}
          // Two columns inside the ~812px content column from sm up.
          sizes="(max-width: 640px) 100vw, 400px"
          className={`h-auto w-full rounded-2xl ${imageRight ? 'sm:order-last' : ''}`}
        />
      ) : null}
      <div>
        {block.heading ? <h2 className="mb-3 text-3xl font-bold">{block.heading}</h2> : null}
        {block.body ? (
          <p className="whitespace-pre-line text-lg text-gray-600">{block.body}</p>
        ) : null}
      </div>
    </div>
  )
}
