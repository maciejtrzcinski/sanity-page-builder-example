import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {client} from '@/sanity/lib/client'
import {token} from '@/sanity/lib/token'

// Entered from the Presentation tool / preview links. Validates the request
// against the viewer token, then turns on Next.js draft mode.
export const {GET} = defineEnableDraftMode({
  client: client.withConfig({token}),
})
