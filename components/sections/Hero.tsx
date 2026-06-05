import type {HeroBlock} from '../pageBuilder/types'

export function Hero({block}: {block: HeroBlock}) {
  return (
    <div className="border-b border-gray-200 py-10">
      {block.eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-accent">
          {block.eyebrow}
        </p>
      ) : null}
      <h2 className="mb-3 text-4xl font-bold tracking-tight">{block.heading}</h2>
      {block.subheading ? <p className="mb-6 text-lg text-gray-500">{block.subheading}</p> : null}
      {block.ctaLabel && block.ctaHref ? (
        <a
          href={block.ctaHref}
          className="inline-block rounded-lg bg-accent px-4.5 py-2.5 font-semibold text-accent-fg no-underline"
        >
          {block.ctaLabel}
        </a>
      ) : null}
    </div>
  )
}
