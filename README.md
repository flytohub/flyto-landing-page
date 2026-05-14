<h1 align="center">Flyto2 Landing Page</h1>

<p align="center">
  <b>The marketing site served at <a href="https://flyto2.com">flyto2.com</a>.</b>
</p>

---

## Stack

- Next.js 15 (App Router) with `output: 'export'` for static generation
- next-intl for locale routing (`en`, `zh`, `ja`)
- Tailwind v4 + Motion + lucide-react
- Firebase Web SDK (client-only) for the Q&A forum
- Deployed to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`

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
  layout.tsx              # root: fonts + metadata
  sitemap.ts              # generated sitemap
  [locale]/
    layout.tsx            # locale provider, header/footer, hreflang
    page.tsx              # home
    cloud/                # Cloud product pages
    code/                 # Code product pages
components/
  layout/                 # Header, Footer, LanguageSwitcher, MobileMenu
  sections/               # Hero, ProductPicker, FAQ, etc.
  ui/                     # Button, Tag, Rule
  forum/                  # Firebase-backed forum
lib/
  locales.ts              # locale list + native names + flags
  i18n.ts                 # next-intl request config
  firebase.ts, forum.ts   # forum data layer
  nav.ts, cn.ts           # nav helpers, classnames
messages/
  en.json, zh.json, ja.json
public/
  CNAME, .well-known/, robots.txt, llms.txt, favicon.ico, assets/
```

## Related

- [flyto2.com](https://flyto2.com) — what this repo ships
- [flyto-blog](https://github.com/flytohub/flyto-blog) — articles
- [flyto-docs](https://github.com/flytohub/flyto-docs) — product docs
