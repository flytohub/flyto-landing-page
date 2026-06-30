# Scripts

This directory contains local and CI verification scripts for the public site.

Important checks:

- `audit-public-geo-routes.mjs` verifies public answer-engine route coverage.
- `audit-public-site-contract.mjs` verifies canonical public routes and crawler
  policy contracts.
- `npm run verify` runs the full local release loop for the landing site.

Scripts must remain deterministic and should not require secrets, browser
sessions, or external accounts.

