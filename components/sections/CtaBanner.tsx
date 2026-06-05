import type {CtaBannerBlock} from '../pageBuilder/types'

export function CtaBanner({block}: {block: CtaBannerBlock}) {
  return (
    <div className="my-10 rounded-2xl bg-accent px-6 py-12 text-center text-accent-fg">
      <h2 className="mb-2 text-3xl font-bold">{block.heading}</h2>
      {block.body ? <p className="mb-6 opacity-90">{block.body}</p> : null}
      {block.buttonLabel && block.buttonHref ? (
        <a
          href={block.buttonHref}
          className="inline-block rounded-lg bg-white px-4.5 py-2.5 font-semibold text-accent no-underline"
        >
          {block.buttonLabel}
        </a>
      ) : null}
    </div>
  )
}
