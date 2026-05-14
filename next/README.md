# Flyto2 Landing — Next.js

Migration target for the Flyto2 marketing site (currently 22 × ~20-page static
HTML build at the repo root). This `next/` subtree is a parallel implementation
that will eventually replace the root site once parity is reached.

## Stack

- **Next.js 15** App Router, TypeScript, `output: 'export'` (static, GH Pages compatible)
- **Tailwind CSS v4** with `@theme` tokens (CSS-first, no `tailwind.config.ts`)
- **next-intl** for the `[locale]` routing pattern; locale prefix `as-needed` so
  English stays at root paths and other languages live under `/zh/`, `/ja/`, …
- **lucide-react** for icons (no emoji)
- **motion** (Framer Motion successor) for hero stagger and scroll reveals
- **Fraunces** (display, variable axes), **Instrument Sans** (body), **JetBrains Mono** (technical labels) — all via `next/font`

## Layout

```
next/
  app/
    layout.tsx                # root: fonts + metadata
    [locale]/
      layout.tsx              # locale provider, header/footer
      page.tsx                # home / overview
      cloud/page.tsx          # Cloud
      code/page.tsx           # Code
      not-found.tsx           # localized 404
  components/
    layout/                   # Header, Footer, ProductSwitcher,
                              # LanguageSwitcher, MobileMenu
    sections/                 # Hero, ProductDossiers, TrustStrip, CTASection
    ui/                       # Button, Tag, Rule, GrainOverlay
  lib/
    locales.ts                # canonical locale list + native names + flags
    i18n.ts                   # next-intl request config
    nav.ts                    # nav data
    cn.ts                     # clsx + tailwind-merge helper
  messages/
    en.json                   # canonical
    zh.json                   # 繁體
    ja.json                   # 日本語
  public/index.html           # root redirect (locale auto-detect → /en|/zh|…)
  next.config.mjs             # static export, trailingSlash
  postcss.config.mjs          # tailwind v4 plugin
```

## Design language

- **Aesthetic**: editorial / mission-control. Dark canonical palette aligned
  with `@flyto/design-tokens` (purple `#8b5cf6`, cyan `#06b6d4`, ink surfaces),
  with a paper/bone inverted band for the Principles section.
- **Typography**: Fraunces (italic display for accents) + Instrument Sans body
  + JetBrains Mono labels. No Inter, no Roboto, no Space Grotesk.
- **Texture**: subtle film grain overlay, hairline rules, faint background grid,
  aurora gradients, marquee transmission strip.
- **Motion**: staggered hero reveal, scroll-triggered dossier reveals,
  pulse dots for live status. Honors `prefers-reduced-motion`.

## Local dev

```bash
cd next
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build        # static output in out/
```

## Migration scope

- [x] Home / overview
- [x] Cloud overview
- [x] Code overview
- [x] Header / Footer / mobile menu / language switcher (16 langs)
- [x] en, zh, ja translations (structure ready for the remaining 13 langs)
- [ ] Pricing, download, contact, privacy, terms, FAQ, blog index
- [ ] Sitemap / robots / hreflang generation
- [ ] Wire `flyto-i18n` so translations come from the shared source
- [ ] Replace GH Pages workflow once parity reached (output → root or `out/`)

## Why migrate

The current root-level static HTML approach copies the entire ~20-page site
into each of 22 language directories — every header tweak runs through
`scripts/inject-*.js` against ~440 files. Consolidating to component-driven
i18n means one Header, one Hero, one source of truth.
