# 2026-06-23 Public Site Fresh Verification

## Scope

Fresh public-site release evidence showed that the product gate score was not
enough for production confidence. The release packet remained blocked by live
public-site verification and a dirty repo outside this landing repo.

## Fresh Probe

Command:

```bash
python3 /Users/chester/flytohub/flyto-indexer/scripts/write_public_site_verification_evidence.py \
  /Users/chester/flytohub/reports/flyto2-continuous-2026-06-23T075628Z \
  --base-url https://flyto2.com \
  --browser-status ok \
  --timeout 12
```

Result before this source fix:

- P0 findings: 0
- P1 findings: 8
- `/api-docs/` returned 404
- `open_graph` was missing
- `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `Claude-Web`,
  `PerplexityBot`, and `Perplexity-User` returned 403 at the Cloudflare edge

## Changes

- Fixed `middleware.ts` so the matcher excludes only `/api` and `/api/*`, not
  public routes like `/api-docs/`.
- Added homepage OpenGraph and Twitter card metadata.
- Extended `scripts/audit-public-site-contract.mjs` to guard the middleware
  matcher and homepage social metadata.
- Added `docs/cloudflare-ai-crawler-allowlist.md` with the required edge-rule
  shape for user-triggered AI search/browse UAs.

## Verification

```bash
npm run audit:public-site
npm run audit:geo
npm test
npm run typecheck
npm run build
```

All passed. The build artifact contains `og:*` metadata and generated
`api-docs` pages.

## Residual

This commit cannot apply Cloudflare WAF/Bot Fight rules without current
Cloudflare credentials. After deploy, apply the allowlist runbook and rerun the
live public-site verification script. Do not mark `public_site_verification` as
fully proven until realtime/search AI UAs stop receiving 403.

