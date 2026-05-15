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

## Local dev

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build        # static output in out/
```

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

## SEO infrastructure

- **Sitemap**: `app/sitemap.ts` walks `app/[locale]/`, appends template + whitepaper slugs, emits one `<url>` per `(locale × route)` with full hreflang cluster (+ `x-default`). Roughly 370 URLs at the time of writing.
- **Per-page canonical + hreflang**: every static page calls `pageAlternates(path, locale)` from `lib/seo.ts` so each locale is its own self-canonical (avoids the duplicate-of-/en/ trap).
- **Cloudflare Worker `flyto-redirects`** sits in front of the site and 301s ~230 historical `.html` URLs (pre-redesign Google-indexed pages) to their new directory-style equivalents. Edit the script directly in Cloudflare — it is not in this repo.

## Related

- [flyto2.com](https://flyto2.com) — what this repo ships
- [flyto-blog](https://github.com/flytohub/flyto-blog) — articles (blog.flyto2.com)
- [flyto-docs](https://github.com/flytohub/flyto-docs) — product docs (docs.flyto2.com)
