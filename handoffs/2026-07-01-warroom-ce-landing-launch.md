# 2026-07-01 Warroom CE Landing Launch

## Scope

The public landing site needed to match the new Flyto2 Warroom CE open-core
positioning. Before this change, `/open-source/` carried most of the CE story,
but homepage, pricing, security, enterprise, footer, nav, and AI-readable files
did not consistently explain the self-hosted CE baseline and Enterprise bridge.

## Changes

- Updated homepage Warroom entry and final CTA to lead with installable
  Warroom CE and Enterprise bridge upgrade paths.
- Updated public route data for pricing, security, enterprise, airgap, compare,
  API docs, trust, docs, blog, and changelog so each page has CE and Enterprise
  bridge language where relevant.
- Updated security landing pages to route ASM, EASM, CTEM, dark web, MSSP, AI
  security, and external-rating positioning back to CE/self-hosted docs and
  Enterprise bridge.
- Added footer links for Flyto2 Warroom CE, Docker images, and self-hosted
  docs; changed header Open Source nav to `/open-source`.
- Extended `llms.txt` and `llms-full.txt` with CE distribution, Enterprise
  bridge, open-core boundary, and citation guidance.
- Replaced the default-locale next-intl redirect loop with deterministic
  middleware: unprefixed English URLs rewrite internally to `/en/...`,
  `/en/...` redirects to canonical, and non-English locale prefixes remain
  reachable.
- Extended `scripts/audit-public-site-contract.mjs` so the CE launch surface
  and canonical router behavior are tested.

## Verification

```bash
npm run verify
npm audit --json
python3 -m src.cli verify /Users/chester/flytohub/flyto-landing-page \
  --full-scan \
  --query 'Flyto2 Warroom CE landing pages self-hosted GitHub Docker Enterprise bridge open core router canonical'
```

Results:

- `npm run verify`: pass
- `npm audit --json`: 0 vulnerabilities
- `flyto-indexer verify --full-scan`: 16 pass, 0 warn, 0 fail
- Local route smoke:
  - `/open-source/`: 200
  - `/en/open-source/`: 307 to `/open-source/`
  - `/zh/open-source/`: 200

## Notes

`next build` still prints the existing next-intl dynamic-import cache warning
for `next-intl/dist/esm/production/extractor/format/index.js`; the build exits
successfully and generates 1076 static pages.
