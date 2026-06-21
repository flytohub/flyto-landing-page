# Landing Dependency Audit Closure

## Context

GitHub reported default-branch vulnerabilities after the public GEO route
closure push. Local `npm audit --json` showed high-risk findings through the
Wrangler/Miniflare chain plus a moderate Next.js nested PostCSS advisory.

## Fix

- Ran `npm update wrangler` to move the Cloudflare local tooling chain to a
  fixed transitive set.
- Added an npm `overrides.postcss` pin at `8.5.10` so Next.js resolves the safe
  PostCSS release instead of the vulnerable nested copy.
- Did not run `npm audit fix --force` because npm suggested downgrading Next.js
  to `9.3.3`, which would break the Next 15 App Router site.

## Verification

- `npm audit --json`: 0 vulnerabilities.
- `npm run verify`: passed, including GEO audit, TypeScript, tests, and static
  build.
- `flyto-index verify . --full-scan --json`: passed with no secret or taint
  findings; remaining warning is documentation inline coverage only.
- Workspace Flyto2 product gate: `READY_FOR_CONTROLLED_PRODUCTION`, 0 blockers,
  0 warnings.
