<h1 align="center">Flyto2 Landing Page</h1>

<p align="center">
  <b>The public front door for Flyto2 Cloud, Flyto2 Warroom, docs, blog, and AI-search discovery.</b>
</p>

<p align="center">
  <a href="https://flyto2.com">Website</a> |
  <a href="https://docs.flyto2.com">Docs</a> |
  <a href="https://blog.flyto2.com">Blog</a> |
  <a href="https://github.com/flytohub/flyto-core">Open-source engine</a>
</p>

<p align="center">
  <a href="https://github.com/flytohub/flyto-landing-page/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/flytohub/flyto-landing-page/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/flytohub/flyto-landing-page/actions/workflows/seo.yml"><img alt="SEO Gate" src="https://github.com/flytohub/flyto-landing-page/actions/workflows/seo.yml/badge.svg"></a>
  <a href="https://github.com/flytohub/flyto-landing-page/actions/workflows/security.yml"><img alt="Security" src="https://github.com/flytohub/flyto-landing-page/actions/workflows/security.yml/badge.svg"></a>
</p>

---

Flyto2.com is the public conversion and citation surface for the Flyto2
ecosystem. It explains the open-source execution engine, cloud automation,
security war room, templates, pricing, downloads, trust pages, and long-tail
SEO pages in 16 locales.

This repository is intentionally optimized for three audiences:

- **Developers** who want to understand what Flyto2 does and try the open-source
  engine quickly.
- **Security and automation buyers** who need trust, pricing, compliance,
  product boundaries, and contact paths.
- **Search, AI answer engines, and crawlers** that need stable metadata,
  hreflang, sitemap, `robots.txt`, `llms.txt`, and citation-ready summaries.

## Quick start

```bash
npm ci
npm run dev
```

Open `http://localhost:3000/en` for English, or replace `en` with any supported
locale. Before pushing public copy, run:

```bash
npm run verify
```

That command runs documentation drift, route and locale contracts, TypeScript,
the production build, built-page SEO scoring, and the SEO management gate.

## What this repo owns

- Public pages for Flyto2 Cloud, Warroom, open source, pricing, security,
  enterprise, docs, blog, changelog, contact, and comparison routes.
- Long-tail comparison pages for n8n, Zapier, Make, Playwright, LangGraph,
  Aikido, and Bitsight alternative searches.
- Multilingual route generation for 16 locales.
- Sitemap, canonical URLs, hreflang clusters, `x-default`, and AI-readable
  `llms.txt` / `llms-full.txt`.
- GitHub/GitLab-facing Markdown standards for the public Flyto2 repositories:
  see [docs/github-gitlab-md-playbook.md](docs/github-gitlab-md-playbook.md).

## Stack

- Next.js 15 App Router packaged for Cloudflare Workers with OpenNext
- next-intl for locale routing — 16 locales (`en, zh, cn, ja, ko, de, es, fr, it, pt, hi, id, pl, th, tr, vi`)
- Tailwind v4 + Motion + lucide-react
- Firebase Web SDK (client-only) for the Q&A forum
- Cloudflare Worker plus static asset binding (HTTPS, caching, edge redirects)
- Deployed by the Cloudflare dashboard Git integration on pushes to `main`.
  GitHub Actions intentionally does not run `wrangler deploy`, so public
  repository secrets are not required for Cloudflare deployment.

## Installation details

Use Node.js 22 and npm. Install dependencies from the lockfile:

```bash
npm ci
```

For local forum development, copy `.env.example` or `.env.local.example` to
`.env.local` and fill in the Firebase public web config. Do not commit real API
keys, service-account JSON, access tokens, or moderation credentials.

## Usage

Start the local Next.js dev server:

```bash
npm run dev
```

Open `http://localhost:3000/en` for the English landing page, or replace `en`
with any supported locale. Public pages are static and must render enough
server-generated text for SEO, AEO, and GEO crawlers without relying on
client-only hydration.

## Developer loop

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build        # Next.js production output in .next/
npm run build:cf     # Cloudflare Worker output in .open-next/
```

## Configuration

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase web API key for the forum client.
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain.
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID.
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket.
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase sender ID.
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID.
- `GOOGLE_APPLICATION_CREDENTIALS`: local-only service account path for
  moderation scripts.
- `ANTHROPIC_API_KEY`: local-only moderation script key.

The site must build without Firebase values. Forum components should degrade
without blocking public SEO/GEO pages.

## Testing And Verification

Run the closed loop before release changes:

```bash
npm run audit:geo
npm run lint
npm test
npm run build
npm run verify
```

`npm run audit:geo` checks required public GEO routes, `robots.txt`,
`llms.txt`, `llms-full.txt`, sitemap registration, and AI crawler policy.
CI also runs `flyto-index verify . --full-scan --strict --json` to catch source-level
secret, taint, impact, and instruction hygiene regressions.

## API Surface

This repo does not expose backend API routes. Its public contract is the page,
metadata, and discovery surface:

- localized routes under `app/[locale]`
- `app/sitemap.ts`
- `public/robots.txt`
- `public/llms.txt`
- `public/llms-full.txt`
- `public/.well-known/security.txt`

## Architecture

```
app/
  layout.tsx                       # root: fonts + metadata
  sitemap.ts                       # auto-discovers app/[locale]/ + templates + whitepapers
  [locale]/
    layout.tsx                     # locale provider, header/footer, hreflang
    page.tsx                       # home
    contact/                       # Contact page (Organization JSON-LD)
    privacy/, terms/, whitepaper/  # legal + content pages
    cloud/                         # Cloud product
      templates/
        page.tsx                   # hub: marketing grid + community grid
        [slug]/page.tsx            # template detail (SoftwareApplication + FAQPage JSON-LD)
      pricing/, download/, integrations/, recipes/, use-cases/,
      changelog/, discussions/
    code/                          # Warroom product (Beta)
      security/, pricing/, integrations/, use-cases/, discussions/
components/
  layout/                          # Header, Footer, LanguageSwitcher, MobileMenu, MegaMenu
  sections/                        # Hero, ProductPicker, FAQ, CTASection, etc.
  ui/                              # Button, Tag, Rule
  forum/                           # Firebase-backed forum
lib/
  locales.ts                       # locale list + native names + region flags
  i18n.ts                          # next-intl request config
  nav.ts                           # productNavGrouped (3 dropdowns: Product / Resources / Community)
  templates.ts                     # community template content database (17 primary + 4 aliases)
  seo.ts                           # pageAlternates() — canonical + hreflang cluster
  firebase.ts, forum.ts            # forum data layer
  whitepapers.ts                   # whitepaper slug index
  cn.ts                            # classnames helper
messages/
  en, zh, cn, ja, ko, de, es, fr,
  it, pt, hi, id, pl, th, tr, vi
public/
  CNAME, .well-known/, robots.txt, llms.txt, favicon.ico, flags/, assets/
docs/reference/
  README.md                        # generated source and public-contract index
  routes.md                        # every App Router page module
  source-*.md                      # every tracked declaration and source line
```

## SEO / AEO / GEO infrastructure

- **Sitemap**: `app/sitemap.ts` emits every indexed public route for every
  supported locale, including template and whitepaper slugs, with full hreflang
  alternate clusters and `x-default`.
- **Per-page canonical**: pages call `pageAlternates(path, locale)` from
  `lib/seo.ts`. English uses bare canonical paths, localized routes use their
  locale-prefixed paths, and every page advertises the same 16-locale alternate
  cluster.
- **AI-readable files**: `public/llms.txt` and `public/llms-full.txt` provide
  citation-ready summaries for AI search and answer engines.
- **Crawler policy**: `public/robots.txt` allows search and user-triggered AI
  retrieval while blocking AI training crawlers.
- **GEO observability**: `npm run geo:logs -- <access.log>` produces JSON, CSV,
  and Markdown reports for AI crawler access-log evidence.
- **Cloudflare Worker `flyto-redirects`** sits in front of the site and 301s
  historical `.html` URLs to their current directory-style equivalents. Edit
  the script directly in Cloudflare; it is not in this repo.
- **Cloudflare AI crawler allowlist** is documented in
  `docs/cloudflare-ai-crawler-allowlist.md`. Robots policy alone is not enough
  when Cloudflare bot/challenge rules return 403 to realtime browse UAs.

## Related

- [flyto2.com](https://flyto2.com) — what this repo ships
- [flyto-blog](https://github.com/flytohub/flyto-blog) — articles (blog.flyto2.com)
- [flyto-docs](https://github.com/flytohub/flyto-docs) — product docs (docs.flyto2.com)

## Contributing

Keep public route copy, metadata, sitemap entries, crawler policy, and
AI-readable files in sync. Add or update a handoff under `handoffs/` whenever a
release changes the public GEO/AEO/SEO contract.

## License And Reuse

This website repository does not currently declare a standalone source or
content license. Do not assume that site copy, screenshots, trademarks, or
third-party assets inherit the Apache-2.0 license used by Flyto2 Core. Check the
license in the owning repository or contact `team@flyto2.com` before reuse.
