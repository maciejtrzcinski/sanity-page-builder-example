import Link from 'next/link'

import {SiteShell} from '@/components/chrome/SiteShell'

export default function NotFound() {
  return (
    <SiteShell>
      <div className="py-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-accent">404</p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="mb-6 text-lg text-gray-500">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <Link href="/" className="text-accent">
          ← Back to all pages
        </Link>
      </div>
    </SiteShell>
  )
}
