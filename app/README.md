# App Routes

This directory contains the Next.js App Router entry points for public Flyto2
pages.

Route modules should stay thin:

- Load localized page data from `lib/`.
- Use shared layout and section components from `components/`.
- Keep sitemap and metadata generation aligned with the canonical public route
  registry.
- Do not embed secrets, customer data, or private deployment URLs.

