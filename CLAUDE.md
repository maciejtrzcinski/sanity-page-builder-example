# CLAUDE.md

Guidance for working in this repo. Pairs with `README.md` (user-facing docs) —
read that for the full feature tour; this file is the orientation for making changes.

## What this is

A single Next.js (App Router) app with an **embedded Sanity Studio** at
`/studio`, demoing a **page builder** built from two npm packages:

- `@maciejtrzcinski/sanity-plugin-section-builder` — Studio: the page-builder
  field + insert-menu grid with preview thumbnails.
- `@maciejtrzcinski/sanity-page-builder-core` — frontend: typed renderer
  registry, render loop, and GROQ-projection assembly.

Both are installed from npm (compiled JS — no transpile, dedupe aliases, or
build step needed), so `next.config.ts` only carries the image-loader config.

## Commands

- `pnpm dev` — Next.js + Studio (port 3000; `/studio` for the Studio).
- `pnpm build` / `pnpm type-check` / `pnpm lint` / `pnpm format:check` / `pnpm knip`
- `pnpm typegen` — regenerate `sanity/sanity.types.ts` from the schema + GROQ.
- `pnpm seed` — import `sanity/seed.ndjson` sample content (re-runnable).

`dev`, `build`, and `type-check` run `pnpm typegen` first via `pre*` hooks.
**Before declaring work done, run `pnpm type-check && pnpm lint && pnpm knip`** —
all three are CI gates (along with `format:check` and `build`).

## Architecture

C4 diagrams (Context / Container / Component) live in
[`docs/architecture.md`](docs/architecture.md).

- **Routes** (`app/(frontend)/`): `[...slug]` catch-all renders any page's
  `pageBuilder` at its full path; `blog/` has its own index + `[slug]` post
  routes (which take precedence over the catch-all). `page.tsx` (root) renders
  Site Settings → Home Page. `app/studio/[[...tool]]` mounts the Studio.
- **Page builder**: each section is one `defineSection({type, query, render})`
  entry in `components/pageBuilder/registry.tsx`. `createPageBuilderFromSections`
  combines them into `renderBlock` + a single GROQ projection
  (`pageBuilderProjection`). `PageBuilder.tsx` runs the render loop.
- **Chrome** (nav/footer) mirrors the same pattern in
  `components/chrome/{nav,footer}Registry.tsx`; `SiteShell.tsx` resolves
  per-page override ?? global default.
- **Data layer** (`sanity/lib/`): `client.ts` (stega-enabled), `live.ts`
  (`sanityFetch` + `<SanityLive />`), `queries.ts` (all GROQ + fetch helpers),
  `metadata.ts` (SEO), `imageLoader.ts` (next/image → Sanity CDN loader, wired
  via `next.config.ts` `images.loaderFile`).
- **Schema** (`sanity/schemaTypes/`): `page`, `settings`, blog types, `person`,
  and `sections/*` + `chrome/*` object types. `sectionBuilderConfig.ts` lists
  the `SECTIONS` registered in the Studio.

## Adding a section

Schema (`sanity/schemaTypes/sections/<name>Section.ts` + register in
`index.ts` and `sections/sectionTypes.ts`) → preview SVG in
`public/section-previews/<kebab-name>.svg` → component in
`components/sections/` → block variant in `components/pageBuilder/types.ts` →
`defineSection` entry in `registry.tsx`. (README has the detailed version.)

## Types (TypeGen) — important

GROQ results are typed by Sanity TypeGen. `sanity/sanity.types.ts` and
`schema.json` are **generated and gitignored** — never hand-edit or commit them;
run `pnpm typegen` (or any `pre*`-hooked command) to refresh.

- **Static literal queries** are wrapped in `defineQuery`, so `sanityFetch` /
  `client.fetch` infer results — don't add `as` casts.
- **Composed queries** (`pageQuery`, `homePageQuery`, `siteChromeQuery`,
  `blogIndexQuery`) interpolate runtime registry projections and **cannot be
  typed by TypeGen** — they stay hand-typed via `PageQueryResult` in
  `components/pageBuilder/types.ts`. Do **not** try to wrap them in `defineQuery`.
- `@sanity/client` is a direct dep solely so the generated module augmentation
  resolves; keep it.

## Conventions & gotchas

- **Prettier**: no semicolons, single quotes, no bracket spacing, width 100.
  Import order is enforced by ESLint — match the existing grouping.
- **Env** (`.env.local`, see `.env.local.example`): `NEXT_PUBLIC_SANITY_PROJECT_ID`,
  `NEXT_PUBLIC_SANITY_DATASET` are required (asserted in `sanity/env.ts`).
  `SANITY_VIEWER_TOKEN` (read token) enables draft reads for Presentation —
  store it with **no surrounding whitespace** (a stray space breaks auth).
- **Draft mode / Presentation**: `/api/draft-mode/{enable,disable}` are API
  routes — link to them with a plain `<a>`, not `next/link` (a client-side
  navigation won't reliably apply the Set-Cookie/redirect). Visual editing only
  connects inside the Studio Presentation iframe.
- **Images**: use `next/image` with `sanity/lib/utils.ts` helpers
  (`sanityImageUrl`, `imageDimensions`); resizing goes through the Sanity CDN via
  the custom loader, so no `images.remotePatterns` entry is needed.
