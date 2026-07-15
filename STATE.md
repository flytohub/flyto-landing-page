# State

Current state on 2026-07-01:

- The site has public routes for Cloud, templates, recipes, pricing,
  changelog, CTEM/security pages, dark web monitoring, whitepapers, legal pages,
  and discussions.
- Homepage SEO and AI-readable indexes now present Flyto2 as open-source AI
  workflow automation, MCP-native agent tools, no-code browser automation, and
  evidence-backed security Warroom on one deterministic flyto-core runtime.
- Homepage, footer, Warroom product entry, pricing, security, enterprise,
  airgap, compare, API docs, trust, docs, blog, and changelog now describe
  Flyto2 Warroom CE as the installable self-hosted baseline and Enterprise
  bridge as the gated upgrade path.
- `/aikido-alternative/` is a canonical public route for teams evaluating
  Aikido-style consolidated security platforms; it deliberately avoids
  unsupported replacement, benchmark, or guaranteed-AutoFix claims.
- `robots.txt`, `llms.txt`, and `llms-full.txt` exist.
- Public crawler policy allows search and user-triggered AI retrieval while
  blocking AI training crawlers.
- English canonical public routes rewrite to the internal `/en/...` app route
  without redirect loops; `/en/...` redirects to the canonical unprefixed URL,
  while non-English locale prefixes are indexed as hreflang variants.
- Sitemap and page metadata now advertise complete locale alternates for the
  16 supported public locales.
- `scripts/analyze-ai-crawler-logs.mjs` can produce JSON, CSV, and Markdown GEO
  crawler evidence from access logs.
- `npm run audit:public-site` guards CE launch links, Docker/GitHub/docs
  distribution channels, Enterprise bridge language, and canonical locale
  middleware behavior.

Known gaps:

- Enterprise, trust, airgap, open-source, API-docs, compare, pricing, docs,
  blog, changelog, and security hub routes now have source pages, sitemap
  coverage, footer discovery, and AI-readable index entries guarded by
  `npm run audit:geo`.
- Login, billing, and customer workflows are outside this repo and must be
  validated in the owning apps before production.
