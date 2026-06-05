export type NavLink = {_key: string; label: string; href: string}

export type MinimalNavBlock = {
  _type: 'minimalNav'
  _key: string
  logoText?: string | null
  links?: NavLink[] | null
}

export type CtaNavBlock = {
  _type: 'ctaNav'
  _key: string
  logoText?: string | null
  links?: NavLink[] | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

/** "None" marker — renders no navigation. */
export type NoNavBlock = {_type: 'noNav'; _key: string}

export type NavBlock = MinimalNavBlock | CtaNavBlock | NoNavBlock

export type SimpleFooterBlock = {
  _type: 'simpleFooter'
  _key: string
  text?: string | null
  links?: NavLink[] | null
}

export type ColumnsFooterBlock = {
  _type: 'columnsFooter'
  _key: string
  text?: string | null
  columns?: {_key: string; title: string; links?: NavLink[] | null}[] | null
}

/** "None" marker — renders no footer. */
export type NoFooterBlock = {_type: 'noFooter'; _key: string}

export type FooterBlock = SimpleFooterBlock | ColumnsFooterBlock | NoFooterBlock

/** Context passed to nav/footer renderers. */
export type ChromeContext = {siteName: string}
