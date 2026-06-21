# Architecture

Stack:

- Next.js App Router with static export.
- `next-intl` locale routing.
- Tailwind v4, Motion, and lucide-react.
- Firebase Web SDK for the public Q&A forum.
- Static public SEO/GEO files under `public/`.

Important paths:

- `app/[locale]/...` contains public pages.
- `messages/*.json` contains localized UI copy.
- `lib/seo.ts` owns canonical metadata helpers.
- `app/sitemap.ts` emits static sitemap entries.
- `public/robots.txt` defines crawler policy.
- `public/llms.txt` and `public/llms-full.txt` define AI-readable summaries.
- `scripts/analyze-ai-crawler-logs.mjs` analyzes AI crawler access logs.

Current SEO mode:

- Public SEO is English-first.
- Non-English locale routes remain reachable, but the current metadata helper
  canonicalizes to bare English paths and does not emit hreflang alternates.
- Treat multilingual SEO/hreflang as a P1 before broad international launch.
