import {
  toKebabCase,
  type SectionBuilderConfig,
} from '@maciejtrzcinski/sanity-plugin-section-builder'

import {SECTION_TYPES} from './schemaTypes/sections/sectionTypes'

/**
 * Config shared by the `sectionBuilder` plugin (global preview thumbnails) and
 * the page builder field. Preview images resolve by filename convention:
 * `${kebab(type)}.svg` under /public/section-previews/ (see public/section-previews).
 *
 * This example lists sections explicitly (cycle-safe to import from a schema
 * module). For larger studios you can instead auto-detect them with
 * `detect: {types: schemaTypes}` — see the section-builder plugin's README.
 */
export const SECTIONS: SectionBuilderConfig = {
  previewBaseUrl: '/section-previews',
  sections: SECTION_TYPES.map((type) => ({
    type,
    previewImage: `${toKebabCase(type)}.svg`,
  })),
}
