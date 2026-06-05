# Contributing

Thanks for your interest in improving this example! It's a small Next.js +
Sanity demo for [`@maciejtrzcinski/sanity-plugin-section-builder`](https://www.npmjs.com/package/@maciejtrzcinski/sanity-plugin-section-builder)
and [`@maciejtrzcinski/sanity-page-builder-core`](https://www.npmjs.com/package/@maciejtrzcinski/sanity-page-builder-core).

## Prerequisites

- **Node 22+** (≥ 22.12 — see `.nvmrc`; run `nvm use`)
- **pnpm** (version is pinned via `packageManager` in `package.json`)

This app consumes both packages from npm, so there's no sibling-package build
step — `pnpm install` pulls everything it needs.

## Getting started

```sh
cp .env.local.example .env.local   # fill in your Sanity projectId + dataset
pnpm install
pnpm dev                           # frontend :3000, Studio :3000/studio
```

## Before opening a PR

Please make sure the full check suite is green (CI runs the same commands):

```sh
pnpm type-check
pnpm lint
pnpm format:check   # or `pnpm format` to auto-fix
pnpm knip
pnpm build
```

## Code style

- **Prettier** owns formatting (`prettier.config.mjs`) — don't hand-format; run
  `pnpm format`.
- **ESLint** (flat config, `eslint-config-next`) for correctness.
- **Knip** must stay green — remove dead code rather than exporting unused
  symbols.
- Adding a section? Follow the **"Adding a new section"** steps in the README.

## Commits & PRs

- Keep PRs focused; describe the change and how you verified it.
- Reference any related issue.
- By contributing, you agree your work is licensed under the project's
  [MIT License](./LICENSE).
