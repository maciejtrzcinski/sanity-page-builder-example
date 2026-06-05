# Page Builder Example

A minimal Next.js + Sanity app (single repo, embedded Studio — the
[sanity-template-nextjs-clean](https://github.com/sanity-io/sanity-template-nextjs-clean)
shape) showing how to build a **page builder** with two small packages:

- **[`@maciejtrzcinski/sanity-plugin-section-builder`](https://www.npmjs.com/package/@maciejtrzcinski/sanity-plugin-section-builder)** — Studio side:
  the page-builder field + insert-menu grid with **preview thumbnails**.
- **[`@maciejtrzcinski/sanity-page-builder-core`](https://www.npmjs.com/package/@maciejtrzcinski/sanity-page-builder-core)** — frontend side:
  the typed **renderer registry**, the **render loop**, GROQ-projection assembly,
  and block-type extraction.

It ships **5 sections** — Hero, Feature Cards, Quote, FAQ, CTA Banner — and a
`/[...slug]` catch-all route that renders any page's `pageBuilder` at its full
path (so nested slugs like `docs/getting-started` work). It also wires up
CMS-driven **SEO metadata** (Open Graph / Twitter cards, canonical URLs,
`noIndex`), **ISR + Live** caching, `robots.ts` / `sitemap.ts`, JSON-LD, and an
on-demand **revalidation webhook**.

## How it fits together

> For C4 architecture diagrams (Context / Container / Component), see
> [`docs/architecture.md`](docs/architecture.md). For the components editors
> compose into pages and how each is wired to the CMS, see
> [`docs/components.md`](docs/components.md).

```
Studio (sanity.config.ts)
  └─ sectionBuilder(SECTIONS)        ← preview thumbnails on every section
  page document
     └─ sectionField(SECTIONS)       ← the pageBuilder array + insert-menu grid

Frontend
  components/pageBuilder/registry.tsx
     └─ defineSection({type, query, render}) ×5
        └─ createPageBuilderFromSections(...)  → renderBlock + combined GROQ query
  components/pageBuilder/PageBuilder.tsx
     └─ renderPageBuilderBlocks(blocks, ctx, {renderBlock, wrap})
  components/pageBuilder/types.ts
     └─ PageBuilderBlockOf<PageQueryResult>     → the block union
```

Both `SECTIONS` (Studio) and the section modules (frontend) are the single
sources of truth on their side; the packages do the wiring.

## Prerequisites

- Node 22+ (≥ 22.12), pnpm
- A free Sanity project (`npx sanity@latest init` or [sanity.io/manage](https://sanity.io/manage))

Both packages (`@maciejtrzcinski/sanity-page-builder-core` and
`@maciejtrzcinski/sanity-plugin-section-builder`) are installed from npm, so
there's no sibling-package build step — just install and go.

## Setup

```sh
cp .env.local.example .env.local        # fill in your projectId + dataset
pnpm install
pnpm seed                               # optional: import sample pages
pnpm dev
```

- Frontend → http://localhost:3000
- Studio → http://localhost:3000/studio

`pnpm seed` imports `sanity/seed.ndjson` into your dataset: a **Home** landing
page, `welcome`, `about`, and a nested `docs/getting-started`, plus the **Site
Settings** doc (with its `homePage` set to Home). It also uploads the sample
images in `sanity/seed_images/` — documents reference them by a `seedImage:<key>`
token that the seed script resolves against `seed_images/manifest.ndjson`. It's
re-runnable and overwrites the seeded docs by `_id`.

The site root `/` renders the page chosen in **Site Settings → Home Page** (its
`pageBuilder`), falling back to a list of all pages when none is set.

## Create content

1. Open `/studio`, create a **Page**, give it a title + slug.
2. In **Page builder**, click **Add item** — the insert menu shows the 5 sections
   as a **visual grid** (the preview SVGs in `public/section-previews/`). Each
   item in the array also shows its thumbnail.
3. Fill in a few sections and **Publish**.
4. Visit `/<your-slug>` — the page renders through the page builder.

Every section also has an optional **Section anchor id** field. Set it and the
section renders as `<section id="…">` (with `scroll-margin-top` so the heading
clears the viewport top), giving you `#anchor` targets for in-page links. Link
fields (Hero/CTA `ctaHref`, etc.) accept a relative path (`/studio`) or an
absolute `http`/`https`/`mailto`/`tel` URL.

## Adding a new section

1. **Schema** — add `sanity/schemaTypes/sections/<name>Section.ts` (object type),
   register it in `sanity/schemaTypes/index.ts`, and add its name to
   `sanity/schemaTypes/sections/sectionTypes.ts`.
2. **Preview** — drop `public/section-previews/<kebab-name>.svg` (matches the
   filename convention `${toKebabCase(type)}.svg`).
3. **Component** — add `components/sections/<Name>.tsx`.
4. **Block type** — add the variant to `components/pageBuilder/types.ts`.
5. **Module** — add a `defineSection({type, query, render})` entry in
   `components/pageBuilder/registry.tsx`.

That's it — the section now appears in the Studio insert menu (with thumbnail),
fetches its own fields, and renders on the frontend.

## Styling

Styled with **Tailwind CSS v4** — `app/globals.css` is just `@import 'tailwindcss';`
plus a small `@theme` block (exposing `bg-accent` / `text-accent`), and
`postcss.config.mjs` loads `@tailwindcss/postcss`. No `tailwind.config.js` is
needed (v4 auto-detects content). The section components use utility classes, so
restyle them by editing the `className`s.

## Scripts

| Script                | What it does                                                       |
| --------------------- | ------------------------------------------------------------------ |
| `pnpm dev`            | Start Next.js (frontend + embedded Studio at `/studio`)            |
| `pnpm build`          | Production build                                                   |
| `pnpm type-check`     | `tsc --noEmit`                                                     |
| `pnpm typegen`        | Extract the schema + generate `sanity/sanity.types.ts` (see below) |
| `pnpm lint`           | ESLint (flat config, `eslint-config-next`)                         |
| `pnpm format`         | Prettier write (`format:check` to verify only)                     |
| `pnpm knip`           | Find unused files / dependencies / exports                         |
| `pnpm extract-schema` | Extract the Sanity schema to `schema.json`                         |

`dev`, `build`, and `type-check` each run `pnpm typegen` first (via `pre*`
hooks), so the generated types are always fresh and present — see **Types**.

CI (`.github/workflows/ci.yml`) runs type-check, lint, format check, knip, and
build on every push and PR.

## Types

GROQ query results are typed with **Sanity TypeGen**. `pnpm typegen` extracts
the Studio schema to `schema.json`, then generates `sanity/sanity.types.ts` —
both **gitignored** (regenerated, not committed). The `pre*` hooks above ensure
the file exists before any command needs it.

- **Static queries** (the blog + SEO + list/slug/sitemap queries in
  `sanity/lib/queries.ts`) are wrapped in `defineQuery`, so TypeGen emits exact
  `*QueryResult` types and — via `overloadClientMethods` + the generated
  `@sanity/client` augmentation — `sanityFetch` / `client.fetch` infer their
  results automatically (no casts). The blog component types (`BlogPost`,
  `BlogPostListItem`) are aliases of those generated results.
- **Composed queries** — `pageQuery`, `homePageQuery`, `siteChromeQuery`,
  `blogIndexQuery` — interpolate runtime registry projections
  (`${pageBuilderProjection}`, nav/footer), which TypeGen can't resolve
  statically, so they **stay hand-typed** via `PageQueryResult` (fed to
  `PageBuilderBlockOf`). Don't wrap these in `defineQuery`.
- `@sanity/client` is a **direct dependency** only so the generated
  `declare module '@sanity/client'` augmentation resolves (it's otherwise
  transitive via `next-sanity` and pnpm won't hoist it).

## SEO, caching & revalidation

- **Per-page SEO** — the `page` document has an **SEO** tab (`seoTitle`,
  `seoDescription`, `seoGraphImage`, `noIndex`). `generateMetadata` turns these
  into title/description, Open Graph + Twitter cards (image cropped to 1200×630
  via the Sanity CDN), canonical URLs, and robots directives. The
  **Site Settings** singleton holds a fallback social image. See
  `sanity/lib/metadata.ts`.
- **`robots.ts` / `sitemap.ts`** — generated from the CMS; the sitemap lists all
  indexable pages (skips `noIndex`) and JSON-LD is emitted per page.
- **Caching** — pages use the Live Content API (`sanityFetch` + `<SanityLive />`)
  for instant updates, with `export const revalidate` as an ISR baseline. Every
  fetch is cache-tagged (`page`, `page:<slug>`, `settings`).
- **Revalidation webhook** — point a Sanity webhook at `POST /api/revalidate`
  (secret in `SANITY_REVALIDATE_SECRET`) to revalidate the relevant tags on
  publish. Set `NEXT_PUBLIC_SITE_URL` so canonical/OG URLs and the sitemap are
  absolute.
- **Live preview (Presentation)** — the Studio's **Presentation** tool opens the
  frontend in an iframe with click-to-edit overlays. It enables Next.js draft
  mode via `/api/draft-mode/enable`; the frontend renders `<VisualEditing />`
  and an "Exit preview" link while in draft mode. Set `SANITY_VIEWER_TOKEN`
  (a read token) to see drafts. Reading `draftMode()` in the layout doesn't cost
  the static/ISR prerender: Next prerenders the non-draft variant for normal
  visitors and only renders dynamically when the draft cookie is present.

## Blog

A small blog sits alongside the page builder:

- **Taxonomy** — `blogCategory` documents; each `blogPost` optionally references one.
- **People** — `person` is a reusable core entity (name, role, photo, bio); a
  `blogPost` references one as its **author**, shown as a byline on the post and
  in listings, and emitted in the `BlogPosting` JSON-LD.
- **Posts** — `blogPost` documents with a **Portable Text** (WYSIWYG) `body`,
  cover image, excerpt, category, author, `publishedAt`, and the shared SEO
  fields. Rendered at **`/blog/<slug>`** (`@portabletext/react`), with SEO
  metadata and JSON-LD.
- **Index** — a **Blog Index** singleton composed with the page builder, rendered
  at **`/blog`**. Drop the **Blog Posts** section into it (or any page) to list
  posts, optionally filtered by category — the section runs its own GROQ
  sub-query (`^.category` filter, newest first) and the component slices to
  `max`.
- **Reserved namespace** — regular `page` slugs of `blog` or `blog/*` are
  rejected in the Studio so they can't shadow the blog routes (which take
  precedence over the `/[...slug]` catch-all anyway).

Blog fetches are tagged `blog` (and `blogPost:<slug>`); the revalidation webhook
maps blog document types to those tags.

## Navigation & footer

Site chrome reuses the page-builder pattern: **navigation** and **footer** are
each a set of variant object types (`minimalNav` / `ctaNav`,
`simpleFooter` / `columnsFooter`), selected via a single-item array (`max(1)`).

- **Global default** — set once on the **Site Settings** singleton
  (`navigation`, `footer`).
- **Per-page override** — each page's **Appearance** tab can override the nav
  and/or footer (`navigationOverride`, `footerOverride`); empty inherits the
  global.
- **None** — every selector includes a **"No navigation" / "No footer"** option
  (`noNav` / `noFooter`) that renders nothing. Picking it is distinct from
  leaving the field empty (which inherits): use it to hide chrome on a specific
  page, or site-wide in Settings.

Rendering mirrors the page builder: `components/chrome/navRegistry.tsx` and
`footerRegistry.tsx` use `createPageBuilderFromSections` to map each variant
`_type` → component + GROQ projection. `components/chrome/SiteShell.tsx`
resolves **override ?? global**, then renders the header, `<main>`, and footer
(falling back to a default header when none is set). Add a new nav/footer style
exactly like a section: schema type → component → registry entry.

## Notes

- **Auto-detect alternative.** This example lists sections explicitly in
  `sectionBuilderConfig.ts` (simplest, and cycle-safe to import from a schema
  module). Larger studios can instead pass `detect: {types: schemaTypes}` to
  auto-detect every `*Section` type — see the plugin README.
- **Typegen.** This example runs Sanity TypeGen (`pnpm typegen`) for its static
  queries; the page-builder/chrome queries are composed from runtime registry
  projections that TypeGen can't resolve, so their shape is hand-written in
  `components/pageBuilder/types.ts` and fed to `PageBuilderBlockOf`. See the
  **Types** section above.
- **No type casts.** Both packages are installed from npm against this app's
  single copy of `sanity`/`react`, so the Studio field/plugin and the
  dependency-free frontend core type-check cleanly — no `as` casts needed.
- **Presentation overlays.** Live preview is wired at the route/Studio level (see
  _SEO, caching & revalidation_). For per-block click-to-edit overlays,
  `renderPageBuilderBlocks` additionally supports `documentId` + `pathBase` +
  `dataAttr` — not enabled here to keep the render loop minimal.
