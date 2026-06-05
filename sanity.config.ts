'use client'

import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {sectionBuilder} from '@maciejtrzcinski/sanity-plugin-section-builder'

import {dataset, projectId} from './sanity/env'
import {schemaTypes} from './sanity/schemaTypes'
import {SECTIONS} from './sanity/sectionBuilderConfig'

export default defineConfig({
  name: 'default',
  title: 'Page Builder Example',
  projectId,
  dataset,
  basePath: '/studio',
  schema: {types: schemaTypes},
  plugins: [
    structureTool({
      // Pages as a normal list; Settings as an editable singleton (one fixed doc).
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('page').title('Pages'),
            S.divider(),
            // Blog: an index singleton plus Posts and Categories lists.
            S.listItem()
              .title('Blog')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.listItem()
                      .title('Blog Index')
                      .id('blogIndex')
                      .child(S.document().schemaType('blogIndex').documentId('blogIndex')),
                    S.documentTypeListItem('blogPost').title('Posts'),
                    S.documentTypeListItem('blogCategory').title('Categories'),
                  ]),
              ),
            // Site chrome: reusable navigation + footer documents, authored
            // once and referenced from Settings/pages.
            S.listItem()
              .title('Site Chrome')
              .child(
                S.list()
                  .title('Site Chrome')
                  .items([
                    S.documentTypeListItem('navigation').title('Navigations'),
                    S.documentTypeListItem('footer').title('Footers'),
                  ]),
              ),
            S.documentTypeListItem('person').title('People'),
            S.divider(),
            S.listItem()
              .title('Site Settings')
              .id('settings')
              .child(S.document().schemaType('settings').documentId('settings')),
          ]),
    }),
    // Live preview / click-to-edit. Opens the frontend in an iframe and enables
    // draft mode via the /api/draft-mode/enable route.
    presentationTool({
      previewUrl: {
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    // Attaches the preview thumbnail to every registered section type (array
    // item + edit pane).
    sectionBuilder(SECTIONS),
  ],
})
