import Link from 'next/link'

import type {ColumnsFooterBlock} from './types'

function withYear(text: string): string {
  return text.replace('{year}', String(new Date().getFullYear()))
}

export function ColumnsFooter({block}: {block: ColumnsFooterBlock}) {
  return (
    <footer className="mt-auto border-t border-gray-200 px-6 py-12 text-sm">
      <div className="mx-auto max-w-[860px]">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {block.columns?.map((column) => (
            <div key={column._key}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-gray-900">
                {column.title}
              </h3>
              <ul className="grid list-none gap-2 p-0">
                {column.links?.map((link) => (
                  <li key={link._key}>
                    <Link href={link.href} className="text-gray-500 no-underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {block.text ? <p className="mt-8 text-gray-500">{withYear(block.text)}</p> : null}
      </div>
    </footer>
  )
}
