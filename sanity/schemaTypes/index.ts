import type {SchemaTypeDefinition} from 'sanity'

import {blogCategory} from './blog/blogCategory'
import {blogIndex} from './blog/blogIndex'
import {blogPost} from './blog/blogPost'
import {columnsFooter} from './chrome/columnsFooter'
import {ctaNav} from './chrome/ctaNav'
import {footer} from './chrome/footer'
import {minimalNav} from './chrome/minimalNav'
import {navigation} from './chrome/navigation'
import {navLink} from './chrome/navLink'
import {noFooter} from './chrome/noFooter'
import {noNav} from './chrome/noNav'
import {simpleFooter} from './chrome/simpleFooter'
import {page} from './page'
import {person} from './person'
import {blogPostsSection} from './sections/blogPostsSection'
import {ctaBannerSection} from './sections/ctaBannerSection'
import {faqSection} from './sections/faqSection'
import {featureCardsSection} from './sections/featureCardsSection'
import {heroSection} from './sections/heroSection'
import {quoteSection} from './sections/quoteSection'
import {settings} from './settings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  page,
  settings,
  // Blog
  blogIndex,
  blogPost,
  blogCategory,
  // People
  person,
  // Site chrome: reusable navigation + footer documents
  navigation,
  footer,
  // Page builder sections (object types)
  heroSection,
  featureCardsSection,
  quoteSection,
  faqSection,
  ctaBannerSection,
  blogPostsSection,
  // Site chrome: navigation + footer variants (object types)
  minimalNav,
  ctaNav,
  noNav,
  simpleFooter,
  columnsFooter,
  noFooter,
  navLink,
]
