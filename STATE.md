# State

Current state on 2026-06-21:

- The site has public routes for Cloud, templates, recipes, pricing,
  changelog, CTEM/security pages, dark web monitoring, whitepapers, legal pages,
  and discussions.
- `robots.txt`, `llms.txt`, and `llms-full.txt` exist.
- Public crawler policy allows search and user-triggered AI retrieval while
  blocking AI training crawlers.
- `scripts/analyze-ai-crawler-logs.mjs` can produce JSON, CSV, and Markdown GEO
  crawler evidence from access logs.

Known gaps:

- Full multilingual SEO and hreflang are not currently active.
- Enterprise, trust, airgap, open-source, API-docs, compare, pricing, docs,
  blog, changelog, and security hub routes now have source pages, sitemap
  coverage, footer discovery, and AI-readable index entries guarded by
  `npm run audit:geo`.
- Login, billing, and customer workflows are outside this repo and must be
  validated in the owning apps before production.
