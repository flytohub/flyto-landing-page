<h1 align="center">Flyto2 Landing Page</h1>

<p align="center">
  <b>The marketing site served at <a href="https://flyto2.com">flyto2.com</a>.</b>
</p>

---

## Stack

- Next.js 15 (App Router) with `output: 'export'` for static generation
- next-intl for locale routing — 16 locales (`en, zh, cn, ja, ko, de, es, fr, it, pt, hi, id, pl, th, tr, vi`)
- Tailwind v4 + Motion + lucide-react
- Firebase Web SDK (client-only) for the Q&A forum
- Cloudflare proxy in front of GitHub Pages (HTTPS, caching, edge redirects)
- Deployed via `.github/workflows/deploy.yml` on every push to `main`

## Installation

Use Node.js 20 and npm. Install dependencies from the lockfile:

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

## Local dev

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build        # static output in out/
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

## Verification

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
CI also runs `flyto-index verify . --full-scan --json` to catch source-level
secret, taint, impact, and instruction hygiene regressions.

## API Surface

This repo does not expose backend API routes. Its public contract is the static
route and metadata surface:

- localized routes under `app/[locale]`
- `app/sitemap.ts`
- `public/robots.txt`
- `public/llms.txt`
- `public/llms-full.txt`
- `public/.well-known/security.txt`

## Layout

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
```

## SEO / AEO / GEO infrastructure

- **Sitemap**: `app/sitemap.ts` emits English-first canonical public routes,
  plus template and whitepaper slugs.
- **Per-page canonical**: pages call `pageAlternates(path, locale)` from
  `lib/seo.ts`. The current release canonicalizes to bare English paths and
  does not advertise hreflang alternates.
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
