# Architecture (C4)

The [C4 model](https://c4model.com/) diagrams below describe this app at three
zoom levels — **Context**, **Container**, and **Component**. They're written as
[Mermaid](https://mermaid.js.org/) `C4*` diagrams and render on GitHub.

For the narrative version see [`README.md`](../README.md); for change-oriented
guidance see [`CLAUDE.md`](../CLAUDE.md).

> One deployment, two faces: a single Next.js app serves both the public
> **Frontend** and the **embedded Sanity Studio** at `/studio`. The only backend
> is the hosted **Sanity Content Lake**; there is no custom server or database.

---

## Level 1 — System Context

Who uses the system and what it talks to.

```mermaid
C4Context
    title System Context — Page Builder App

    Person(editor, "Content Editor", "Authors pages, blog posts, navigation, footer and site settings")
    Person(visitor, "Site Visitor", "Reads the public marketing site + blog")
    System_Ext(crawler, "Search Engine", "Crawls robots.txt, sitemap.xml and pages")

    System(app, "Page Builder App", "Next.js 16 app with an embedded Sanity Studio — renders pages from a CMS-driven page builder and lets editors author them")

    System_Ext(lake, "Sanity Content Lake", "Hosted CMS backend: document store, GROQ query API, Live Content API, asset pipeline")
    System_Ext(imgcdn, "Sanity Image CDN", "On-the-fly image resizing / format negotiation (cdn.sanity.io)")

    Rel(visitor, app, "Views pages & blog", "HTTPS")
    Rel(crawler, app, "Fetches robots / sitemap / pages", "HTTPS")
    Rel(editor, app, "Edits content & previews live", "HTTPS / Studio")

    Rel(app, lake, "Queries content & drafts; receives publish webhooks", "HTTPS / GROQ")
    Rel(app, imgcdn, "Loads & resizes images", "HTTPS")
    Rel(lake, imgcdn, "Serves assets via")

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```

---

## Level 2 — Containers

Inside the single Next.js deployment. The two npm packages
(`@maciejtrzcinski/sanity-page-builder-core` and
`@maciejtrzcinski/sanity-plugin-section-builder`) are build-time
libraries, shown here because they own the page-builder wiring on each side.

```mermaid
C4Container
    title Container diagram — Page Builder App

    Person(editor, "Content Editor", "Authors content; previews via Presentation")
    Person(visitor, "Site Visitor", "Reads the public site")
    System_Ext(crawler, "Search Engine", "robots / sitemap / pages")

    System_Boundary(app, "Page Builder App (single Next.js deployment)") {
        Container(frontend, "Frontend", "Next.js App Router · React Server Components", "Renders /[...slug] pages, /blog, SEO metadata, robots.ts, sitemap.ts, JSON-LD")
        Container(studio, "Embedded Studio", "Sanity Studio SPA at /studio", "Document editing, structure, and Presentation live-preview tool")
        Container(api, "API Routes", "Next.js Route Handlers", "draft-mode enable/disable, revalidate webhook")
        Container(datalib, "Data Layer", "TypeScript · sanity/lib", "GROQ queries + typed fetch (Live API), SEO, image loader, client/token")
        Container(core, "sanity-page-builder-core", "npm library", "Renderer registry, render loop, GROQ-projection assembly")
        Container(plugin, "sanity-plugin-section-builder", "npm Sanity plugin", "Page-builder array field + insert-menu preview grid")
    }

    System_Ext(lake, "Sanity Content Lake", "GROQ + Live + Mutations API; document & asset store")
    System_Ext(imgcdn, "Sanity Image CDN", "cdn.sanity.io")

    Rel(visitor, frontend, "Views pages", "HTTPS")
    Rel(crawler, frontend, "Fetches robots/sitemap/pages", "HTTPS")
    Rel(editor, studio, "Edits & publishes content", "HTTPS")
    Rel(editor, frontend, "Previews (Presentation iframe)", "HTTPS")

    Rel(frontend, datalib, "Fetches typed content")
    Rel(frontend, core, "Renders blocks via registry")
    Rel(frontend, imgcdn, "Loads images", "next/image custom loader")
    Rel(frontend, api, "Enter/exit preview links", "HTTPS")
    Rel(studio, plugin, "Provides page-builder field")

    Rel(datalib, lake, "GROQ + Live queries (viewer token for drafts)", "HTTPS")
    Rel(studio, lake, "Reads / writes documents", "HTTPS")
    Rel(studio, frontend, "Opens preview & enables draft mode", "iframe + /api/draft-mode/enable")
    Rel(lake, api, "Publish webhook → revalidateTag", "HTTPS POST /api/revalidate")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## Level 3a — Components: Frontend rendering pipeline

How a request becomes HTML. The page-builder and chrome both use the same
registry pattern from `page-builder-core`.

```mermaid
C4Component
    title Component diagram — Frontend rendering

    Person(visitor, "Site Visitor", "")
    Container_Ext(datalib, "Data Layer", "sanity/lib", "Typed GROQ fetch helpers")
    Container_Ext(core, "sanity-page-builder-core", "npm library", "createPageBuilderFromSections, render loop")

    Container_Boundary(fe, "Frontend (Next.js App Router)") {
        Component(routes, "Route handlers", "app/(frontend)/*", "[...slug], page.tsx (home), blog/, layout.tsx, not-found")
        Component(seo, "SEO routes", "robots.ts · sitemap.ts · generateMetadata", "Emits robots, sitemap, OG/Twitter, JSON-LD")
        Component(shell, "SiteShell", "components/chrome", "Resolves nav/footer: per-page override ?? global")
        Component(chromeReg, "Nav/Footer registries", "components/chrome/*Registry", "_type → component + GROQ projection")
        Component(pb, "PageBuilder", "components/pageBuilder", "renderPageBuilderBlocks(blocks, ctx)")
        Component(pbReg, "Section registry", "components/pageBuilder/registry", "defineSection({type, query, render}) ×5")
        Component(sections, "Section components", "components/sections/*", "Hero, FeatureCards, Quote, Faq, CtaBanner, BlogPosts")
        Component(postbody, "PostBody", "components/blog", "Portable Text renderer for blog bodies")
    }

    Rel(visitor, routes, "HTTP request", "HTTPS")
    Rel(routes, datalib, "getPage / getBlogPost / getGlobalChrome")
    Rel(routes, seo, "Builds metadata")
    Rel(seo, datalib, "SEO + sitemap queries")
    Rel(routes, shell, "Wraps page in chrome")
    Rel(shell, chromeReg, "Renders nav/footer")
    Rel(routes, pb, "Renders pageBuilder[]")
    Rel(pb, pbReg, "Looks up renderer by _type")
    Rel(pbReg, sections, "Renders block")
    Rel(routes, postbody, "Renders blog body")
    Rel(pbReg, core, "Built by")
    Rel(chromeReg, core, "Built by")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## Level 3b — Components: Data & integration layer

`sanity/lib` plus the generated types. Everything that touches the Content Lake
or shapes typed results lives here.

```mermaid
C4Component
    title Component diagram — Data & integration layer

    Container_Ext(frontend, "Frontend", "App Router / RSC", "")
    Container_Ext(api, "API Routes", "Route Handlers", "")
    System_Ext(lake, "Sanity Content Lake", "GROQ + Live + Mutations")
    System_Ext(imgcdn, "Sanity Image CDN", "cdn.sanity.io")

    Container_Boundary(lib, "Data layer (sanity/lib) + generated types") {
        Component(queries, "queries.ts", "GROQ + fetch helpers", "Static queries via defineQuery; composed page/chrome queries hand-typed")
        Component(client, "client.ts", "createClient (next-sanity)", "Stega-enabled GROQ client")
        Component(live, "live.ts", "defineLive", "sanityFetch + <SanityLive />, draft perspective")
        Component(token, "token.ts / env.ts", "Config", "SANITY_VIEWER_TOKEN, projectId/dataset")
        Component(meta, "metadata.ts", "SEO", "buildSeoMetadata, OG image resolution")
        Component(cached, "cachedFetch.ts", "ISR cache", "Cached layout settings (fallback OG image)")
        Component(utils, "utils.ts", "Image helpers", "sanityImageUrl, imageDimensions")
        Component(loader, "imageLoader.ts", "next/image loader", "Wired via next.config images.loaderFile")
        ComponentDb(types, "sanity.types.ts", "Generated (TypeGen)", "Schema + *QueryResult types; gitignored, regenerated by pnpm typegen")
    }

    Rel(frontend, queries, "Calls fetch helpers")
    Rel(frontend, meta, "generateMetadata")
    Rel(frontend, loader, "next/image src")
    Rel(api, live, "Draft mode reads")

    Rel(queries, live, "sanityFetch (tagged)")
    Rel(queries, client, "client.fetch (build-time)")
    Rel(queries, types, "Result types inferred from")
    Rel(live, client, "wraps")
    Rel(client, token, "reads token/env")
    Rel(meta, cached, "fallback OG image")
    Rel(meta, utils, "OG image URLs")

    Rel(live, lake, "GROQ + Live queries", "HTTPS")
    Rel(client, lake, "GROQ queries", "HTTPS")
    Rel(loader, imgcdn, "Resizes via", "HTTPS")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## Notes on the diagrams

- **Single deployment.** Frontend, Studio, and API routes are one Next.js app
  (Studio mounts at `/studio` via a catch-all route). The C4 "containers" are
  logical, not separately deployed processes.
- **No custom backend.** The only system of record is the Sanity Content Lake;
  reads go through the Live Content API (`sanityFetch`) for instant updates with
  ISR as a baseline, and on-demand revalidation arrives via the publish webhook.
- **Two render registries, one pattern.** Both the page builder and the site
  chrome (nav/footer) map a Sanity `_type` → component + GROQ projection through
  `page-builder-core`; see Level 3a.
- **Types.** Query result types are generated by Sanity TypeGen; the composed
  page/chrome queries can't be statically typed and are hand-written (see
  README → _Types_).

To edit these, update the Mermaid blocks above and preview on GitHub or any
Mermaid-aware viewer.
