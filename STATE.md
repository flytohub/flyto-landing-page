# State

Current state on 2026-09-03:

- 2026-09-03: Google Analytics 4 now ships on the public site. `components/Analytics.tsx`
  loads the Flyto2 web stream (`G-7V4D315CBD`, property 527224736) from the root
  layout via `next/script`; the measurement ID is a public client identifier held
  in `lib/analytics.ts` so a build can never silently drop it. flyto2.com serves
  no CSP, so nothing had to be allow-listed. Verified: `npm run typecheck`,
  `npm run docs:reference`, `npm run build` (measurement ID baked into every
  prerendered route), `npm run audit:geo`, and `npm run lint` all pass locally;
  the full `npm run verify` (test + seo:manage) was not run.
- 2026-08-27: The post-migration landing release contract names Next.js 16.3.2
  and primary TypeScript 7.0.2. TypeScript 6.0.3 is retained only as the
  explicitly named `typescript-legacy-docs` legacy documentation alias. CI
  runs `npm run verify`, explicit `npm run build:cf`, and strict
  `flyto-index verify . --full-scan --strict --json` exactly once each; the
  executable public-site audit checks those commands and the package,
  lockfile, README, state, changelog, and handoff version contract.
- 2026-08-14: The temporary Physical AI exhibit preview and its screenshot
  were removed from the homepage, metadata, image discovery, and AI-readable
  indexes.
- 2026-07-28: The public site now has a canonical `/support/` route for
  Flyto2 Cloud, ChatGPT app, MCP routing, connected runner, Warroom, account,
  billing, privacy, and security support. Footer, sitemap, English-only route
  policy, `llms.txt`, `llms-full.txt`, and public-site audits all include it.
- 2026-07-28: `/privacy/` now describes the connected Cloud/MCP execution
  boundary accurately and publishes explicit OAuth, MCP, account, execution,
  audit, support, billing, deletion-buffer, and backup retention periods.
- 2026-07-28: `/.well-known/openai-apps-challenge` is a dynamic plain-text
  verification endpoint backed only by `OPENAI_APPS_CHALLENGE_TOKEN`. It
  returns the exact trimmed token with no-store headers, or HTTP 404 when the
  deployment secret is absent.
- 2026-07-28: The support and privacy release passed the complete
  `npm run verify` suite, the production Next.js build, and browser checks at
  1440px and 390px with no horizontal overflow or console errors.
- 2026-07-22: The current Next.js/OpenNext/Wrangler/Firebase dependency graph
  resolves patched `sharp`, `protobufjs`, and `brace-expansion` versions;
  `npm audit` reports zero known vulnerabilities.
- 2026-07-22: Landing documentation is source-backed. A TypeScript AST
  generator inventories every tracked route module and source declaration,
  plus locale, SEO/discovery, configuration, npm script, workflow, and
  whitepaper contracts. `npm run docs:check`, `npm run verify`, and CI reject
  ownership gaps, generated drift, stale deployment stacks/counts, incorrect
  Flyto2 branding, and unapproved email aliases.
- 2026-07-22: Production packaging is documented as Next.js plus the OpenNext
  Cloudflare Worker adapter. Historical static-hosting claims are no longer
  part of the current architecture contract.
- 2026-07-22: The public site now serves a square, self-contained SVG Tiny PS
  Flyto2 brand mark at `/bimi/flyto2.svg` for BIMI DNS publication.
- 2026-07-18: Landing now publishes generated discovery surfaces for search and
  AI retrieval: `sitemap.xml`, `image-sitemap.xml`, `llms.txt`,
  `llms-full.txt`, `discovery-manifest.json`, social preview images, and
  `.well-known/security.txt`.
- 2026-07-18: `npm run build` and `npm run build:cf` run
  `npm run seo:discovery` first. `npm run audit:seo` fails if image sitemap
  coverage, social image assets, Flyto2 naming, `@flyto2.com` email policy, or
  security contact policy drifts.
- 2026-07-18: Landing SEO now consumes the synced
  `.seo/i18n-seo-manifest.json` cache generated from
  `flyto-i18n/dist/seo-manifest.json`. `npm run audit:seo` checks the surface
  key, upstream source hash when the sibling repo exists, required SEO signals,
  16 locale definitions, keyword evidence, page alternates, sitemap alternates,
  robots, llms, and keyword matrix.
- 2026-07-18: `npm run i18n:check` now guards `messages/*.json` key drift
  locally, and `.github/workflows/i18n-drift.yml` runs the same checker without
  depending on removed scripts from `flyto-i18n`.
- 2026-07-18: Missing `code.platform.*` and security navigation keys were
  filled across non-English locale files with English fallback strings so
  multilingual routes do not render missing messages.
- 2026-07-16: `npm run audit:seo` now validates built homepage and core
  commercial routes for title/description length, canonical URLs, OpenGraph,
  Twitter cards, JSON-LD, hreflang, sitemap coverage, robots, llms files,
  `@flyto2.com` email usage, Flyto2 naming, and keyword-matrix freshness.
- 2026-07-16: `.github/workflows/seo.yml` adds a scheduled and PR/push SEO gate
  with build-output metadata checks, Lighthouse SEO score 1.0, and lychee public
  link checking. GitHub Actions runner availability still has to be monitored
  separately from source-level SEO health.
- The site has public routes for Cloud, templates, recipes, pricing,
  changelog, CTEM/security pages, dark web monitoring, whitepapers, legal pages,
  discussions, and the community contribution hub.
- Homepage SEO and AI-readable indexes now present Flyto2 as open-source AI
  workflow automation, MCP-native agent tools, no-code browser automation, and
  evidence-backed security Warroom on one deterministic flyto-core runtime.
- Homepage, footer, Warroom product entry, pricing, security, enterprise,
  airgap, compare, API docs, trust, docs, blog, and changelog now describe
  Flyto2 Warroom CE as the installable self-hosted baseline and Enterprise
  bridge as the gated upgrade path.
- `/open-source/` now leads with Flyto2 Warroom CE as a self-hosted open-core
  security warroom and BYO offensive validation platform. The page explains the
  CE product loop, demo seed, local JWT/Postgres setup, contribution flow, and
  Enterprise Cloud Bridge without claiming that CE includes private SaaS,
  rating-authority, commercial intelligence, or live remediation overlays.
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
  16 supported public locales, with hreflang and OpenGraph locale values
  derived from the Flyto2 i18n SEO contract.
- `messages/*.json` must stay key-compatible with `messages/en.json`; this is
  enforced by local verify and the i18n drift GitHub Action.
- `scripts/analyze-ai-crawler-logs.mjs` can produce JSON, CSV, and Markdown GEO
  crawler evidence from access logs.
- `npm run audit:public-site` guards CE launch links, Docker/GitHub/docs
  distribution channels, Enterprise bridge language, and canonical locale
  middleware behavior.

Known gaps:

- OpenAI must still issue the real domain-verification token; the landing
  deployment must receive it through the protected
  `OPENAI_APPS_CHALLENGE_TOKEN` runtime variable before verification.
- Enterprise, trust, airgap, open-source, API-docs, compare, pricing, docs,
  blog, changelog, and security hub routes now have source pages, sitemap
  coverage, footer discovery, and AI-readable index entries guarded by
  `npm run audit:geo`.
- Backlink growth still depends on external publication channels such as
  GitHub releases, PyPI package pages, Docker Hub descriptions, YouTube
  descriptions, LinkedIn posts, and community discussions. The landing repo now
  exposes the crawlable assets those channels should reference.
- Cloudflare builds use the committed `.seo/i18n-seo-manifest.json` cache; run
  `npm run seo:sync` locally after changing `flyto-i18n` SEO source data.
- Login, billing, and customer workflows are outside this repo and must be
  validated in the owning apps before production.
