# Changelog

## Unreleased

### Added

- Added build-generated landing discovery files: `public/image-sitemap.xml` and
  `public/discovery-manifest.json`, covering committed product screenshots and
  visual assets.
- Added `npm run seo:discovery` and wired it into both `npm run build` and
  `npm run build:cf` so local and Cloudflare builds publish the same discovery
  surface.
- Added SEO audit checks for image sitemap coverage, social image reachability,
  `security.txt`, and discovery manifest health.
- Added `/community/` as a public indexed route for Flyto2 Discussions,
  good-first issues, showcases, contribution routing, and review-first social
  promotion.
- Added community route coverage to sitemap, footer, mobile navigation,
  `llms.txt`, `llms-full.txt`, and SEO/public-route audits.
- Added a local `messages/*.json` drift guard and wired it into `npm run test`
  plus the i18n drift GitHub Action.
- Added CE-first launch surface coverage across homepage, pricing, security,
  enterprise, airgap, compare, docs, API docs, trust, blog, changelog, footer,
  nav, and AI-readable indexes.
- Added `/aikido-alternative/` as a careful competitor-alternative page for
  open-core security war room positioning, evidence-backed AutoFix loops, and
  Enterprise bridge boundaries.
- Added public-site contract checks for Flyto2 Warroom CE GitHub, Docker Hub,
  self-hosted docs, Enterprise bridge copy, and canonical default-locale
  routing.
- Added project memory files, workflow docs, and handoff registry.
- Added `npm run geo:logs` to analyze AI crawler access logs and produce JSON,
  CSV, and Markdown evidence.
- Added source routes and AI-readable index coverage for `/pricing`,
  `/security`, `/enterprise`, `/airgap`, `/open-source`, `/compare`,
  `/api-docs`, `/trust`, `/docs`, `/blog`, and `/changelog`.
- Added `npm run audit:geo` to keep required public SEO/AEO/GEO routes wired
  into source, sitemap, robots, and AI-readable indexes.
- Added `npm run audit:public-site` to guard the public-site route contract,
  AI-readable critical URLs, and explicit AI/search crawler policies.
- Added `docs/cloudflare-ai-crawler-allowlist.md` for the edge rule needed to
  let AI search and realtime browse crawlers reach public citation pages.
- Added `npm run audit:seo`, Lighthouse CI configuration, and a dedicated SEO
  Gate workflow for build-output metadata, sitemap, robots, llms, keyword
  freshness, and public link checks.
- Added `.seo/i18n-seo-manifest.json` plus `npm run seo:sync` so landing SEO
  metadata, hreflang, sitemap checks, and keyword evidence can stay aligned
  with `flyto-i18n/dist/seo-manifest.json`.

### Changed

- Repositioned `/open-source/` around Flyto2 Warroom CE as a self-hosted
  open-core security warroom and BYO offensive validation platform, with CE
  product-loop value, local install details, contribution flow, and Enterprise
  Cloud Bridge boundaries surfaced above the fold.
- Changed homepage Warroom entry and CTA to lead with installable Warroom CE
  and Enterprise bridge upgrade paths.
- Replaced the next-intl default-locale middleware loop with deterministic
  English canonical rewrite and explicit non-English locale handling.
- Replaced the earlier single-locale SEO gap with complete locale-aware
  canonical, sitemap, and hreflang coverage.
- Updated the Wrangler/Miniflare dependency chain and pinned PostCSS via npm
  overrides so `npm audit` reports zero known vulnerabilities without
  downgrading Next.js.
- Added explicit `Claude-SearchBot` and `Applebot` policies to `robots.txt` and
  linked `robots.txt`, `sitemap.xml`, and `llms.txt` from the AI-readable index.
- Fixed the `next-intl` middleware matcher so `/api-docs/` is not excluded as
  though it were an `/api` route.
- Added OpenGraph and Twitter card metadata to the homepage so the public-site
  verification probe can prove citation-ready social/AI summary metadata.
- Derived landing site origin, OpenGraph locale, hreflang values, and SEO
  keyword additions from the synced Flyto2 i18n SEO manifest while preserving
  existing public locale prefixes.
