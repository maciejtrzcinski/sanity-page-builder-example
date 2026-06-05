import type {ReactNode} from 'react'

import {siteName} from '@/lib/site'
import {getGlobalChrome} from '@/sanity/lib/queries'

import {DefaultHeader} from './DefaultHeader'
import {renderFooter} from './footerRegistry'
import {renderNav} from './navRegistry'
import type {FooterBlock, NavBlock} from './types'

/**
 * Renders the page chrome: navigation (top) + footer (bottom), with the page
 * content as `<main>`. Per-page overrides win; otherwise the global nav/footer
 * from Site Settings is used. Falls back to a default header when none is set.
 */
export async function SiteShell({
  navigation,
  footer,
  children,
}: {
  navigation?: NavBlock | null
  footer?: FooterBlock | null
  children: ReactNode
}) {
  const global = await getGlobalChrome().catch(() => ({navigation: null, footer: null}))
  const nav = navigation ?? global.navigation
  const foot = footer ?? global.footer
  const ctx = {siteName}

  return (
    <div className="flex min-h-screen flex-col">
      {nav ? renderNav(nav, ctx) : <DefaultHeader siteName={siteName} />}
      <main className="mx-auto w-full max-w-215 flex-1 px-6 pb-20 pt-10">{children}</main>
      {foot ? renderFooter(foot, ctx) : null}
    </div>
  )
}
