# 2026-07-22 Source-Backed Landing Documentation

## Summary

The landing repository now has a source-backed documentation contract instead
of relying on manually maintained feature counts and architecture claims.

- `docs/documentation-manifest.json` assigns every maintained route, component,
  library, script, workflow, runtime configuration, content source, locale
  catalogue, and public discovery asset to durable documentation.
- `scripts/generate-documentation-reference.mjs` uses the TypeScript compiler AST
  to generate declaration, route, configuration, automation, content, and SEO
  references under `docs/reference/`.
- `scripts/check-documentation.mjs` fails on generated-reference drift, unowned
  source, missing project memory, stale module counts or deployment claims,
  legacy branding, and unapproved email addresses.
- `docs/WHITEPAPER.md` documents the current Next.js App Router, `next-intl`,
  OpenNext, and Cloudflare Worker architecture and its operational boundaries.

The generated inventory covers 798 declarations in 128 source files, 48 page
modules, 16 locale catalogues, 488 English baseline message keys, 16 environment
variables, 20 npm scripts, four GitHub workflows, and seven public whitepapers.
The exact inventory and source fingerprint are in `docs/reference/README.md`.

## Claim And Search Alignment

The public audit and supplement whitepapers now use source-backed Flyto2 facts:
451 Core modules in 84 categories, 41 Core recipes, 665 Engine route
registrations, and 20 Indexer smart tools plus 47 compatibility tools. The
landing deployment description now matches the OpenNext Cloudflare Worker
configuration rather than the retired static-hosting model.

The `/open-source/` page and the SEO score contract now share the long-tail
intent `open source security war room`. Its title, description, H1, and opening
copy describe Warroom CE directly instead of scoring the page against the
unrelated AI agent framework intent.

## Verification

- `npm run docs:reference`
- `npm run docs:check`
- `npm run verify`
- `flyto-index verify . --full-scan --strict --json`
- Chromium visual checks at 390x844 and 1440x900 for `/cloud/`
- Chromium metadata and overflow check at 390x844 for `/open-source/`

The mobile and desktop checks confirmed viewport-width rendering with no
visible content overflow. The compact recipe cards on `/cloud/` remain within
the mobile viewport, and `/open-source/` emits the aligned title, description,
and H1.
