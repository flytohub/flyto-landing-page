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

Scripts must remain deterministic and should not require secrets, browser
sessions, or external accounts.
