# Changelog

## Unreleased

### Added

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

### Changed

- Documented the current English-first canonical SEO strategy as an explicit P1
  multilingual SEO gap.
- Updated the Wrangler/Miniflare dependency chain and pinned PostCSS via npm
  overrides so `npm audit` reports zero known vulnerabilities without
  downgrading Next.js.
- Added explicit `Claude-SearchBot` and `Applebot` policies to `robots.txt` and
  linked `robots.txt`, `sitemap.xml`, and `llms.txt` from the AI-readable index.
