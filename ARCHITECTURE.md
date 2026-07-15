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

- Public SEO is multilingual with English as the unprefixed default.
- `lib/seo.ts` owns canonical URL construction, locale-prefixed URL
  construction, and hreflang alternates.
- `app/sitemap.ts` emits every indexed route for every supported locale and
  includes the full alternate-language map on each entry.
