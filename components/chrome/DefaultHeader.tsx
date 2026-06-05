import Link from 'next/link'

/** Fallback header when no navigation is configured (global or per-page). */
export function DefaultHeader({siteName}: {siteName: string}) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <Link href="/" className="font-bold text-gray-900 no-underline">
        {siteName}
      </Link>
      <nav className="flex items-center gap-6">
        <Link href="/blog" className="text-gray-900 no-underline">
          Blog
        </Link>
        <Link href="/studio" className="text-accent">
          Open Studio →
        </Link>
      </nav>
    </header>
  )
}
