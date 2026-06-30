# 2026-07-01 Aikido Alternative Route

## Scope

Added a public competitor-alternative route for teams evaluating Aikido-style
consolidated security platforms. The page positions Flyto2 as an open-core,
self-hosted security war room rather than as a clone or unsupported full
replacement claim.

## Changes

- Added `/aikido-alternative/` through `publicRoutePages` and a matching
  `app/[locale]/aikido-alternative/page.tsx` wrapper.
- Added footer discovery under the Open Source column.
- Added sitemap coverage through `requiredGeoRoutes`.
- Added `llms.txt` and `llms-full.txt` citation guidance.
- Extended `audit:public-site` so the route, footer link, CE wording, and
  safe competitor-comparison language are contract-checked.

## Positioning Guardrail

Use:

> Flyto2 is an open-core, self-hosted security war room for teams evaluating
> Aikido-style consolidated security platforms.

Avoid:

- full replacement claims
- benchmark superiority without independent evidence
- guaranteed coverage
- 100% AutoFix success claims

## Verification

Run:

```bash
npm run audit:public-site
npm run audit:geo
npm run verify
npm audit --json
python3 -m src.cli verify /Users/chester/flytohub/flyto-landing-page --full-scan --query 'Flyto2 Aikido alternative Warroom CE evidence AutoFix Enterprise bridge'
```
