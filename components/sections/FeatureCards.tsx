import type {FeatureCardsBlock} from '../pageBuilder/types'

export function FeatureCards({block}: {block: FeatureCardsBlock}) {
  const features = block.features ?? []
  return (
    <div className="border-b border-gray-200 py-10">
      {block.heading ? <h2 className="mb-6 text-2xl font-semibold">{block.heading}</h2> : null}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {features.map((feature) => (
          <div key={feature._key} className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            {feature.body ? <p className="m-0 text-gray-500">{feature.body}</p> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
