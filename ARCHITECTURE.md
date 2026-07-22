# Architecture

Stack:

- Next.js App Router built for the OpenNext Cloudflare adapter.
- `next-intl` locale routing.
- Tailwind v4, Motion, and lucide-react.
- Firebase Web SDK for the public Q&A forum.
- Static public SEO/GEO files under `public/`.

Deployment shape:

- `next build` compiles the App Router application and pre-renders public
  routes.
- `opennextjs-cloudflare build` packages `.open-next/worker.js` and static
  assets for Cloudflare Workers.
- `wrangler.json` defines the Worker entrypoint and `ASSETS` binding.
- Cloudflare dashboard Git integration deploys `main`; GitHub Actions verify
  source, build, SEO, and security without holding deployment credentials.

Important paths:

- `app/[locale]/...` contains public pages.
- `messages/*.json` contains localized UI copy.
- `lib/seo.ts` owns canonical metadata helpers.
- `app/sitemap.ts` emits static sitemap entries.
- `public/robots.txt` defines crawler policy.
- `public/llms.txt` and `public/llms-full.txt` define AI-readable summaries.
- `scripts/analyze-ai-crawler-logs.mjs` analyzes AI crawler access logs.
- `docs/documentation-manifest.json` assigns maintained source areas to docs.
- `scripts/generate-documentation-reference.mjs` inventories routes and source
  declarations with the TypeScript compiler AST.

Current SEO mode:

- Public SEO is multilingual with English as the unprefixed default.
- `lib/seo.ts` owns canonical URL construction, locale-prefixed URL
  construction, and hreflang alternates.
- `app/sitemap.ts` emits every indexed route for every supported locale and
  includes the full alternate-language map on each entry.
