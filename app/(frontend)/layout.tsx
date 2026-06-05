import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import type {ReactNode} from 'react'

import {SanityLive} from '@/sanity/lib/live'

// The visible chrome (header/footer) is rendered per-page via <SiteShell> so
// pages can override the global nav/footer. This layout only carries the
// shared live-content + preview plumbing.
export default async function FrontendLayout({children}: {children: ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <>
      {children}

      {/* Live content updates (next-sanity defineLive); drafts included in preview. */}
      <SanityLive includeDrafts={isDraftMode} />

      {isDraftMode && (
        <>
          <VisualEditing />
          {/* Real navigation to an API route (clears the cookie + redirects), so a
              plain <a> is correct here — a client-side <Link> does an RSC fetch
              that doesn't reliably apply the Set-Cookie or follow the redirect. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/draft-mode/disable"
            className="fixed bottom-4 left-4 z-50 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg no-underline shadow-lg"
          >
            Exit preview
          </a>
        </>
      )}
    </>
  )
}
