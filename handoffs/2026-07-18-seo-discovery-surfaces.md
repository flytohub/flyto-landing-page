# 2026-07-18 SEO Discovery Surfaces

## Summary

Landing now generates search discovery files during local and Cloudflare builds:

- `public/image-sitemap.xml` lists committed product screenshots and visual
  assets for image search.
- `public/discovery-manifest.json` records the deterministic source hash and
  image count used by the discovery generator.
- `public/robots.txt`, `public/llms.txt`, and `public/llms-full.txt` reference
  the image sitemap alongside the existing public sitemap and AI-readable files.

`scripts/audit-seo-surface.mjs` now fails if discovery files are missing, if
social image assets do not exist in the built site, if `security.txt` loses the
Flyto2 contact policy, or if old brand/email drift appears in the discovery
surface.

## Verification

- `npm run seo:discovery`
- `npm run verify`

`npm run verify` passed after generating 43 image sitemap entries and rebuilding
the public Next site.
