# Page Builder Example

A Next.js site with an embedded Sanity Studio, built to show how a page builder
works with two packages:

- [`@maciejtrzcinski/sanity-plugin-section-builder`](https://www.npmjs.com/package/@maciejtrzcinski/sanity-plugin-section-builder)
  adds the page-builder field to the Studio, with an insert menu that shows a
  thumbnail for each section.
- [`@maciejtrzcinski/sanity-page-builder-core`](https://www.npmjs.com/package/@maciejtrzcinski/sanity-page-builder-core)
  handles the frontend. You register each section once and it gives you the
  render loop plus one combined GROQ query.

There are seven sections (Hero, Feature Cards, Quote, Image + Text, FAQ, CTA
Banner, Blog Posts), a small blog, swappable nav and footer, SEO metadata, and
live preview in the Studio's Presentation tool.

The repo is also set up for working alongside an AI coding agent. You can ask it
to build new sections and components, or to create pages straight in your
dataset. See [Working with AI](#working-with-ai).

## Getting started

You need Node 22.12+, pnpm, and a Sanity project. If you don't have one, run
`npx sanity@latest init` or create it at [sanity.io/manage](https://sanity.io/manage).

```sh
cp .env.local.example .env.local   # add your project ID and dataset
pnpm install
pnpm seed                          # optional: sample pages, posts and images
pnpm dev
```

The site runs at http://localhost:3000 and the Studio at
http://localhost:3000/studio.

`pnpm seed` creates a home page, a few example pages (one nested at
`docs/getting-started`) and Site Settings with the home page already set. It's
safe to run again because it overwrites the same documents.

Only the project ID and dataset are required. The other variables in
`.env.local.example` are optional:

- `NEXT_PUBLIC_SITE_URL` is used for canonical URLs, Open Graph tags and the sitemap.
- `SANITY_VIEWER_TOKEN` is a read token that lets Presentation show drafts.
  Don't leave spaces around it, or auth will fail.
- `SANITY_REVALIDATE_SECRET` protects the webhook at `POST /api/revalidate`.

## How it works

Every section is a single entry in `components/pageBuilder/registry.tsx`. Each
entry holds the section's type, the fields it needs and how it renders:

```tsx
defineSection({
  type: 'quoteSection',
  query: `quote, author, role, sectionId`,
  render: (block) => <Quote block={block} />,
})
```

The core package combines these entries into a single GROQ projection and a
`renderBlock` function. Each section's query lives right next to its component,
so the two stay in sync.

The Studio side works the same way. `sanity/sectionBuilderConfig.ts` lists the
sections, and the plugin uses that list to build the field and the insert menu.

Routes:

- `/` renders whichever page is set as Home Page in Site Settings.
- `/[...slug]` renders any page at its full path, including nested ones.
- `/blog` and `/blog/<slug>` are the blog. Page slugs starting with `blog` are
  blocked in the Studio so they can't clash with it.

Nav and footer use the same registry pattern (`components/chrome/`). You set a
default in Site Settings, and any page can override it or hide it.

For diagrams and a component-by-component tour, see
[`docs/architecture.md`](docs/architecture.md) and
[`docs/components.md`](docs/components.md).

## Adding a new section

1. Add a schema in `sanity/schemaTypes/sections/<name>Section.ts`, register it in
   `sanity/schemaTypes/index.ts` and add the name to `sections/sectionTypes.ts`.
2. Add a thumbnail at `public/section-previews/<kebab-name>.svg`.
3. Add the component in `components/sections/`.
4. Add the block type to `components/pageBuilder/types.ts`.
5. Add a `defineSection` entry to `components/pageBuilder/registry.tsx`.

New nav and footer styles follow the same steps without the thumbnail. Their
files are in `sanity/schemaTypes/chrome/` and `components/chrome/`.

## Working with AI

Every section is built the same way, and nothing is wired up by hand. That makes
this repo easy for an AI agent like Claude Code or Cursor to work in.

[`CLAUDE.md`](CLAUDE.md) gives the agent everything it needs: where things
live, the steps for adding a section, the rules for types, and how to create
pages. It also tells the agent to run `pnpm type-check`, `pnpm lint` and
`pnpm knip` before calling a task done. Those three checks catch the usual
mistakes, like a section missing from the registry, a block type that doesn't
match its query, or a leftover export. Claude Code reads `CLAUDE.md`
automatically. With other agents, point them at the file.

**Sections and components.** Describe what you want and the agent works through
the five steps above. That covers the schema, preview SVG, component, block type
and registry entry. Nav and footer variants work the same way.

**Pages.** Connect the [Sanity MCP server](https://www.sanity.io/docs/ai/mcp-server)
and the agent can read your content and create pages in your dataset. It
creates them as drafts, so you can review them in the Studio before you publish.

```sh
pnpm dlx sanity@latest mcp configure   # detects Claude Code, Cursor and VS Code
# or, for Claude Code only:
claude mcp add Sanity -t http https://mcp.sanity.io --scope user
```

Some prompts to try:

- "Add a Testimonials section with a quote, a name, a role and an optional photo."
- "Make a Logo Cloud section and use it on the home page."
- "Create a draft Pricing page with a hero, three feature cards, an FAQ and a CTA banner."
- "Add a footer variant with a newsletter signup line."

## Types

`pnpm typegen` generates `sanity/sanity.types.ts` from the schema and queries.
It runs automatically before `dev`, `build` and `type-check`, and its output is
gitignored.

Most queries are wrapped in `defineQuery`, so their results are typed with no
extra work. The page and chrome queries are the exception. They're assembled
from the registries at runtime, which TypeGen can't follow, so their types are
written by hand in `components/pageBuilder/types.ts`. Don't wrap those queries
in `defineQuery`.

## Scripts

| Script                         | What it does                                |
| ------------------------------ | ------------------------------------------- |
| `pnpm dev`                     | Run the site and Studio                     |
| `pnpm build`                   | Production build                            |
| `pnpm seed`                    | Import sample content                       |
| `pnpm typegen`                 | Regenerate Sanity types                     |
| `pnpm type-check`              | TypeScript check                            |
| `pnpm lint`                    | ESLint                                      |
| `pnpm format` / `format:check` | Prettier                                    |
| `pnpm knip`                    | Find unused files, exports and dependencies |

CI runs type-check, lint, format check, knip and build on every push and PR.
