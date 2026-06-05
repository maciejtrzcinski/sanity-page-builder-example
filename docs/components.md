# Components

The building blocks editors compose into pages, and how each one is wired to the
CMS. This is the component-level companion to the architecture diagrams in
[`docs/architecture.md`](architecture.md); for the narrative tour see
[`README.md`](../README.md), and for change-oriented guidance
[`CLAUDE.md`](../CLAUDE.md).

> Everything here renders from CMS data. A document holds an array of typed
> blocks; the registry maps each `_type` to a React component **and** the GROQ
> projection that feeds it, so a section's data and its markup can't drift apart.

## Layout

```
components/
  pageBuilder/        the page-builder engine (registry + render loop + types)
    registry.tsx        defineSection ×6  → renderBlock + pageBuilderProjection
    PageBuilder.tsx     the render loop; wraps anchored sections in <section id>
    types.ts            the block union (PageBuilderBlock) + PageQueryResult
    context.ts          RenderContext passed to every section renderer
  sections/           one component per page-builder section (the 6 below)
    Hero.tsx  FeatureCards.tsx  Quote.tsx  Faq.tsx  CtaBanner.tsx
    BlogPostsSection.tsx
  chrome/             site chrome — same pattern, for nav + footer
    navRegistry.tsx  footerRegistry.tsx   variant → component + projection
    MinimalNav.tsx  CtaNav.tsx  SimpleFooter.tsx  ColumnsFooter.tsx
    DefaultHeader.tsx   fallback header when no nav is set
    SiteShell.tsx       resolves override ?? global, renders nav + <main> + footer
    types.ts            NavBlock / FooterBlock unions + ChromeContext
  blog/               blog rendering helpers (not page-builder blocks)
    PostBody.tsx        Portable Text → React (headings, lists, marks, images)
    types.ts            BlogPost / BlogPostListItem (aliases of TypeGen results)
```

## The pattern

Three primitives from `@maciejtrzcinski/sanity-page-builder-core` do all the
wiring. The page builder and the chrome registries use the **same** three:

- **`createSectionFactory<Block, Context, Node>()`** returns a typed
  `defineSection({type, query, render})`. Each section co-locates its `_type`,
  its GROQ projection, and its renderer in one entry — bound to the block union,
  the render context, and the node type (`ReactNode`).
- **`createPageBuilderFromSections(sections)`** combines those entries into a
  single `renderBlock` (dispatch a block to its component) and a single `query`
  (every section's projection, concatenated) — see
  `components/pageBuilder/registry.tsx:64`.
- **`renderPageBuilderBlocks(blocks, ctx, {renderBlock, wrap})`** is the render
  loop; `wrap` turns each rendered block into an element (and applies the
  section-anchor convention) — see `components/pageBuilder/PageBuilder.tsx:25`.

```
registry.tsx ──┬─ renderBlock          ─→ PageBuilder.tsx (render loop)
               └─ pageBuilderProjection ─→ sanity/lib/queries.ts (GROQ)
```

The combined projection is interpolated into the page query so each section
fetches **exactly** what it renders — nothing more.

## Section components

The six page-builder sections. Each is a plain server component taking a single
typed `block` prop (its block type from `components/pageBuilder/types.ts`); the
fields it reads come from that section's `query` in `registry.tsx`.

| Component          | `_type`               | Renders                                         |
| ------------------ | --------------------- | ----------------------------------------------- |
| `Hero`             | `heroSection`         | Eyebrow, heading, subheading, optional CTA link |
| `FeatureCards`     | `featureCardsSection` | Heading + a grid of `{title, body}` cards       |
| `Quote`            | `quoteSection`        | Pull-quote with author + role                   |
| `Faq`              | `faqSection`          | Heading + a list of `{question, answer}` items  |
| `CtaBanner`        | `ctaBannerSection`    | Heading, body, and a call-to-action button      |
| `BlogPostsSection` | `blogPostsSection`    | Latest posts (optional category filter, `max`)  |

`BlogPostsSection` is the one section that fetches **related** documents: its
projection runs a GROQ sub-query (`^.category` filter, newest first) so the
section pulls in posts, and the component slices to `block.max ?? 6` — see
`components/pageBuilder/registry.tsx:48`.

### Anatomy of one section

`Hero` is representative — props in, markup out, no data fetching of its own:

```tsx
// components/sections/Hero.tsx
export function Hero({block}: {block: HeroBlock}) {
  return (
    <div className="border-b border-gray-200 py-10">
      {block.eyebrow ? <p className="… text-accent">{block.eyebrow}</p> : null}
      <h2 className="…">{block.heading}</h2>
      {block.subheading ? <p className="…">{block.subheading}</p> : null}
      {block.ctaLabel && block.ctaHref ? (
        <a href={block.ctaHref} className="… bg-accent text-accent-fg">
          {block.ctaLabel}
        </a>
      ) : null}
    </div>
  )
}
```

`HeroBlock` (in `components/pageBuilder/types.ts`) makes optional fields nullable,
so each renders conditionally. Styling is Tailwind utility classes — `bg-accent`
/ `text-accent` come from the `@theme` tokens in `app/globals.css`, so restyle by
editing `className`s.

### The render pipeline

How one section gets from the CMS to the DOM:

```
1. Schema      sanity/schemaTypes/sections/heroSection.ts   ← editor fills fields
2. Projection  registry.tsx → pageBuilderProjection         ← GROQ for those fields
3. Fetch       sanity/lib/queries.ts (page query)           ← typed PageQueryResult
4. Dispatch    renderBlock(block) → <Hero block={block} />  ← _type → component
5. Wrap        PageBuilder.tsx wrap()                        ← <section id> or Fragment
```

Step 5 is the **section-anchor convention**: if a block has a `sectionId`, the
loop wraps it in `<section id="…">` (otherwise a `<Fragment>`), giving in-page
`#anchor` targets. `app/globals.css` adds `scroll-margin-top` so anchored
headings clear the viewport top.

## Site chrome

Navigation and footer reuse the identical registry pattern — they're just block
unions with their own variants, including a `noNav` / `noFooter` "None" marker
that renders nothing:

- **Nav** (`navRegistry.tsx`): `minimalNav` → `MinimalNav`, `ctaNav` → `CtaNav`,
  `noNav` → `null`.
- **Footer** (`footerRegistry.tsx`): `simpleFooter` → `SimpleFooter`,
  `columnsFooter` → `ColumnsFooter`, `noFooter` → `null`.

`SiteShell.tsx` ties it together. It takes a page's optional `navigation` /
`footer` overrides, resolves **override ?? global** (the global comes from Site
Settings), and renders the header, `<main>`, and footer — falling back to
`DefaultHeader` when no nav is set:

```tsx
// components/chrome/SiteShell.tsx (abridged)
export async function SiteShell({navigation, footer, children}) {
  const global = await getGlobalChrome()
  const nav = navigation ?? global.navigation
  const foot = footer ?? global.footer

  return (
    <div className="flex min-h-screen flex-col">
      {nav ? renderNav(nav, ctx) : <DefaultHeader siteName={siteName} />}
      <main className="mx-auto w-full max-w-215 …">{children}</main>
      {foot ? renderFooter(foot, ctx) : null}
    </div>
  )
}
```

Chrome renderers receive a `ChromeContext` (`{siteName}`) rather than the page
`RenderContext`.

## Blog components

The blog renders Sanity documents directly (not page-builder blocks), so it lives
in its own folder:

- **`PostBody`** maps a post's **Portable Text** `body` to React via
  `@portabletext/react` — block styles (`h2`, `h3`, `blockquote`, `normal`),
  bullet/number lists, `strong` / `em` / `link` marks, and inline images (skipped
  when no asset is set).
- **`types.ts`** aliases the TypeGen-generated results (`BlogPost`,
  `BlogPostListItem`) to the names the components import, so they can't drift from
  the GROQ queries. (Page-builder block types are hand-written instead — see the
  **Types** section of the README for why.)

## Render context

`RenderContext` (`components/pageBuilder/context.ts`) is the cross-cutting bag
passed to every section renderer — empty-ish here (just optional `searchParams`).
Add anything your renderers need (feature flags, settings, the current locale, …)
and it's available in each section's `render` without prop-drilling. Chrome uses
its own `ChromeContext` for the same purpose.

## Adding a component

A new section or chrome variant is the same five-step recipe (schema → preview
SVG → component → block type → registry entry). The full walk-through lives in
the **Adding a new section** and **Navigation & footer** sections of
[`README.md`](../README.md).
