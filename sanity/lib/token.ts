// Viewer token for draft/preview reads (Presentation). Published content works
// without it; set SANITY_VIEWER_TOKEN (a read token) to enable live preview.
// Never NEXT_PUBLIC_-prefixed — next-sanity delivers it to the browser only in
// draft mode via the Live API's `browserToken` mechanism.
export const token = process.env.SANITY_VIEWER_TOKEN
