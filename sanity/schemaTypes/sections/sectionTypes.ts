// Plain data (no schema imports) so it can be referenced from a schema module
// without an import cycle. Order here is the order sections appear in the
// page builder's insert menu and array.
export const SECTION_TYPES = [
  'heroSection',
  'featureCardsSection',
  'quoteSection',
  'imageTextSection',
  'faqSection',
  'ctaBannerSection',
  'blogPostsSection',
] as const
