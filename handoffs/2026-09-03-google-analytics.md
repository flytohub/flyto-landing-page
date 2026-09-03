# Google Analytics 4 on the public site

Owner: claude
Branch: main
Date: 2026-09-03

## What changed

- `lib/analytics.ts` (new) — exports `GA_MEASUREMENT_ID = 'G-7V4D315CBD'`, the
  Flyto2 web stream (property 527224736, stream 13723511819). A public client
  identifier, held in source rather than a build secret so a build can never
  silently drop it; an empty value disables the tag.
- `components/Analytics.tsx` (new) — loads gtag.js and the GA4 config through
  `next/script` with `strategy="afterInteractive"`. Renders nothing when the
  measurement ID is empty.
- `app/layout.tsx` — renders `<Analytics />` at the end of `<body>`, so every
  route reports a page view.
- `CHANGELOG.md`, `STATE.md`, `docs/reference/*` — updated for the new component,
  library declaration, and layout change (docs regenerated with `npm run docs:reference`).

## Why

The Flyto2 GA property existed but flyto2.com carried no tracking code, so it
recorded zero data. Chose `next/script` over `@next/third-parties/google` to
avoid adding a dependency under the pinned release contract. Chose a source
constant over a `NEXT_PUBLIC_*` build variable because the measurement ID is
public and a missing variable would silently ship an analytics-less build (the
same trap the sibling turibi repo nearly hit).

## Verified

- `npm run typecheck` — pass.
- `npm run docs:reference` — pass (12 pages; drift committed).
- `npm run build` — pass; `G-7V4D315CBD` is baked into every prerendered
  route/RSC (5319 files) and `googletagmanager.com/gtag` appears in the emitted
  HTML.
- `npm run audit:geo` — pass (19 routes).
- `npm run lint` — pass.
- Live `curl -I https://flyto2.com/` shows no `Content-Security-Policy` header,
  so gtag is not policy-blocked (unlike turibi, which needed a CSP change).

## Not verified

- `npm run verify` in full (test + audit:seo + seo:score + seo:manage) was not
  run; those touch SEO scoring/management flows unrelated to this change.
- No live confirmation on production yet — GA only starts collecting after this
  is deployed to flyto2.com (Cloudflare). Confirm a `gtag/js` 200 and a
  `/g/collect` beacon after deploy.

## Follow-ups

- Deploy to flyto2.com, then verify GA receives a page view in Realtime.
- Analytics is unconditional (no cookie-consent banner exists on the site). If a
  consent gate is later required, wrap the tag in Google Consent Mode.
- The other three sibling sites are separate: turibi.com/yuloq.com already ship
  GA + Ahrefs (turibi repo); 2lovetale.com still needs its own tag.
