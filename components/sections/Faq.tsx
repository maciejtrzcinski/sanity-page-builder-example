import type {FaqBlock} from '../pageBuilder/types'

export function Faq({block}: {block: FaqBlock}) {
  const items = block.items ?? []
  return (
    <div className="border-b border-gray-200 py-10">
      {block.heading ? <h2 className="mb-6 text-2xl font-semibold">{block.heading}</h2> : null}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <details key={item._key} className="rounded-[10px] border border-gray-200 px-4 py-3">
            <summary className="cursor-pointer font-semibold">{item.question}</summary>
            <p className="mt-3 mb-0 text-gray-500">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
