# App Routes

This directory contains the Next.js App Router entry points for public Flyto2
pages.

Route modules should stay thin:

- Load localized page data from `lib/`.
- Use shared layout and section components from `components/`.
- Keep sitemap and metadata generation aligned with the canonical public route
  registry.
- Do not embed secrets, customer data, or private deployment URLs.

The generated [route reference](../docs/reference/routes.md) lists all page
modules and records metadata, structured-data, and static-parameter ownership.
The [app source reference](../docs/reference/source-app-01.md) covers every
route component, helper, type, interface, and source registry with exact links.

Adding a page requires synchronized review of its route metadata,
`app/sitemap.ts`, `lib/public-route-pages.ts` when it is a GEO route, navigation
or footer discovery, `public/llms*.txt`, locale messages, and the SEO audits.
