import {defineLive} from 'next-sanity/live'

import {client} from './client'
import {token} from './token'

// Live content API: published content works without a token. The viewer token
// enables draft reads for the Presentation tool — `serverToken` for server
// renders, `browserToken` for the browser's live updates (draft mode only).
export const {sanityFetch, SanityLive} = defineLive({
  client: client.withConfig({apiVersion: 'vX'}),
  serverToken: token,
  browserToken: token,
})
