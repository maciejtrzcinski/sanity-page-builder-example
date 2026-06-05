import Link from 'next/link'

import type {SimpleFooterBlock} from './types'

function withYear(text: string): string {
  return text.replace('{year}', String(new Date().getFullYear()))
}

export function SimpleFooter({block}: {block: SimpleFooterBlock}) {
  return (
    <footer className="mt-auto border-t border-gray-200 px-6 py-8 text-sm text-gray-500">
      <div className="mx-auto flex max-w-215 flex-wrap items-center justify-between gap-4">
        {block.text ? <p className="m-0">{withYear(block.text)}</p> : <span />}
        <nav className="flex gap-4">
          {block.links?.map((link) => (
            <Link key={link._key} href={link.href} className="text-gray-500 no-underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
