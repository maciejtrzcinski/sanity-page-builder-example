// Plain data (no schema imports) so it can be referenced from schema modules
// without an import cycle — mirrors sections/sectionTypes.ts. These drive both
// the Studio array `of:` lists and the frontend registries.
// `noNav` / `noFooter` are "None" markers: pick one to render no nav/footer
// (distinct from an empty field, which inherits the global chrome).
export const NAV_TYPES = ['minimalNav', 'ctaNav', 'noNav'] as const

export const FOOTER_TYPES = ['simpleFooter', 'columnsFooter', 'noFooter'] as const
