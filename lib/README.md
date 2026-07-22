# Public Site Logic

This directory contains deterministic product, SEO, and route metadata used by
the public Flyto2 site.

Rules:

- Keep canonical routes centralized.
- Keep `sitemap.ts`, `llms.txt`, and localized page data in sync.
- Do not call private APIs or require runtime credentials from public page
  metadata.
- Keep public open-core wording aligned with Flyto2 Warroom CE docs, GitHub, and
  Docker Hub.

Primary authorities:

- `seo.ts`: origin, locale mapping, canonical paths, hreflang, and shared SEO facts.
- `public-route-pages.ts` and `security-pages.ts`: durable public route copy and
  comparison/security page contracts.
- `public-route-metadata.ts`: shared canonical, OpenGraph, and Twitter metadata.
- `nav.ts`: desktop and mobile product/resource/community navigation.
- `templates.ts` and `whitepapers.ts`: dynamic public slug registries.
- `firebase.ts`, `auth.ts`, `forum.ts`, and `forum-moderation.ts`: public forum
  configuration, identity, storage, and moderation boundaries.

See the generated [library source reference](../docs/reference/source-lib-01.md)
for exact declaration ownership.
