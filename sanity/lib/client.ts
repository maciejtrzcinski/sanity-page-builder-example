import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  // Enables click-to-edit overlays in the embedded Studio's Presentation tool.
  stega: {studioUrl: '/studio'},
})
