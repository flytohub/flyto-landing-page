# Grouped dependency/source migration release contract

Date: 2026-08-27

## Implementation

- Recorded Next.js 16.3.2 and TypeScript 7.0.2 as the current landing stack.
- Retained TypeScript 6.0.3 only through the explicitly named
  `typescript-legacy-docs` alias for legacy documentation generation
  compatibility; it is not the primary compiler.
- Reduced CI to one `npm run verify`, one explicit `npm run build:cf`, and one
  strict `flyto-index verify . --full-scan --strict --json` after `npm ci`.
  Checks already included in `npm run verify` are not repeated as CI steps.
- Extended `scripts/audit-public-site-contract.mjs` to validate the exact
  dependency versions and alias in `package.json` and `package-lock.json`, the
  exact CI command counts, and this documentation contract.

## Verification contract

Release verification is:

```text
npm ci
npm run verify
npm run build:cf
flyto-index verify . --full-scan --strict --json
```

The implementation worker ran this sequence after regenerating the three
affected source-reference pages:

- `npm ci`: passed.
- `npm run verify`: documentation, tests, locale, GEO, public-site contract,
  and lint/typechecking passed; the production build could not fetch
  Bricolage Grotesque, Geist, or Geist Mono from Google Fonts in the
  network-restricted worker sandbox, so the command did not complete.
- `npm run build:cf`: reached the nested Next.js build and stopped at the same
  external Google Fonts fetch restriction.
- `flyto-index verify . --full-scan --strict --json`: passed 18 checks with
  zero warnings and zero failures.

The host must rerun the two build-bearing commands in its governed environment;
this handoff does not claim they passed in the implementation sandbox.
