# Contributing

Flyto2 Landing Page is the public product and SEO surface for Flyto2. Keep
changes deterministic, source-backed, and aligned with Flyto2 Docs.

## Before Editing

Read the local project memory and handoff first:

- `AGENTS.md`
- `PROJECT.md`
- `STATE.md`
- `/Users/chester/flytohub/CODEX_HANDOFF_FLYTO_AUDIT.md`

Use flyto-indexer search, structure, audit, and impact before broad route,
metadata, SEO, or public copy changes.

## Public Surface Rules

- Keep `lib/public-route-pages.ts`, `app/sitemap.ts`, `public/llms.txt`, and
  `public/llms-full.txt` aligned for public route additions.
- Do not add private deployment URLs, credentials, unreleased customer claims,
  or customer data.
- Keep Warroom CE wording aligned with:
  - `https://flyto2.com/open-source/`
  - `https://docs.flyto2.com/warroom/self-hosted-ce`
  - `https://hub.docker.com/r/chesterhsu/flyto-warroom`

Warroom CE is publicly distributed through its documentation and Docker images;
the Warroom application source repository is not public. Flow CE follows the
same public docs-and-Docker availability boundary. Do not publish source or
license claims for either application unless a working public repository and
license are independently verified.

## Verification

Run the full local release loop before publishing:

```sh
npm run verify
```

For SEO, open-core, or crawler-facing changes, also run:

```sh
npm run audit:geo
npm run audit:public-site
flyto-index verify . --full-scan
```
