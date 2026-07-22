# Scripts

This directory contains local and CI verification scripts for the public site.

Important checks:

- `audit-public-geo-routes.mjs` verifies public answer-engine route coverage.
- `audit-public-site-contract.mjs` verifies canonical public routes and crawler
  policy contracts.
- `generate-discovery.mjs` creates `public/image-sitemap.xml` and
  `public/discovery-manifest.json` from committed visual assets.
- `audit-seo-surface.mjs` validates built metadata, sitemap, robots, llms files,
  image sitemap coverage, social image assets, `security.txt`, Flyto2 naming,
  `@flyto2.com` emails, and keyword evidence.
- `npm run verify` runs the full local release loop for the landing site.
- `generate-documentation-reference.mjs` uses the TypeScript compiler AST to
  inventory tracked declarations, page modules, scripts, configuration,
  locales, discovery assets, and whitepapers.
- `check-documentation.mjs` rejects ownership gaps, generated drift, stale
  stacks/counts/deployment claims, branding errors, and unapproved emails.

Scripts must remain deterministic and should not require secrets, browser
sessions, or external accounts.

See the generated [automation reference](../docs/reference/automation.md) and
[script source reference](../docs/reference/source-scripts-01.md).
