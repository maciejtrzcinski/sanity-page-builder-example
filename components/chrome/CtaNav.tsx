import Link from 'next/link'

import type {CtaNavBlock} from './types'

export function CtaNav({block, siteName}: {block: CtaNavBlock; siteName: string}) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <Link href="/" className="font-bold text-gray-900 no-underline">
        {block.logoText || siteName}
      </Link>
      <div className="flex items-center gap-4">
        <nav className="flex gap-4">
          {block.links?.map((link) => (
            <Link key={link._key} href={link.href} className="text-gray-900 no-underline">
              {link.label}
            </Link>
          ))}
        </nav>
        {block.ctaLabel && block.ctaHref ? (
          <Link
            href={block.ctaHref}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg no-underline"
          >
            {block.ctaLabel}
          </Link>
        ) : null}
      </div>
    </header>
  )
}
