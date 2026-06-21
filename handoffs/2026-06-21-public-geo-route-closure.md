# Public GEO Route Closure

Date: 2026-06-21

## Problem

The built `out/` directory contained some public pages, but source route
coverage did not fully match the release checklist for SEO/AEO/GEO. Required
citation routes such as `/enterprise`, `/airgap`, `/open-source`, `/compare`,
`/api-docs`, `/trust`, `/docs`, `/blog`, `/pricing`, `/security`, and
`/changelog` needed source pages, sitemap coverage, and AI-readable index
coverage.

## Fix

- Added a centralized `public-route-pages` content registry.
- Added reusable `PublicRoutePage` rendering with WebPage,
  SoftwareApplication, and FAQPage structured data.
- Added source routes for all required public citation pages.
- Added footer discovery links.
- Added required route coverage to sitemap generation.
- Updated `llms.txt` and `llms-full.txt`.
- Added `npm run audit:geo` to guard source routes, sitemap wiring,
  AI-readable files, and AI crawler policy.

## Verification

- `npm run audit:geo`
- `npm run typecheck`
- `npm run build`
