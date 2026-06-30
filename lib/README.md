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

