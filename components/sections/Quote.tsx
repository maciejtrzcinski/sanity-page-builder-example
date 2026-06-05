import type {QuoteBlock} from '../pageBuilder/types'

export function Quote({block}: {block: QuoteBlock}) {
  return (
    <figure className="m-0 border-b border-gray-200 py-10 text-center">
      <blockquote className="m-0 mb-3 text-2xl font-medium">“{block.quote}”</blockquote>
      {block.author ? (
        <figcaption className="text-base">
          {block.author}
          {block.role ? <span className="text-gray-500"> — {block.role}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
