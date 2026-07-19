# Warroom CE Open-source Positioning

Date: 2026-07-19

## Summary

The `/open-source/` route now leads with Flyto2 Warroom CE as the self-hosted
open-core security warroom and BYO offensive validation platform.

The page explains that CE can be installed locally, seeded with a demo
workspace, and used to inspect code, container, cloud, runtime, external,
evidence, AutoFix, reporting, and validation loops without Flyto2 Cloud.

## Boundary

The page keeps Enterprise Cloud Bridge as the upgrade path for commercial
intelligence, rating authority, managed runners, enterprise identity, and live
cloud/container/runtime remediation. It should not claim CE includes private
SaaS, commercial provider, or Enterprise overlay implementation.

## Verification

```text
npm run audit:public-site
npm run audit:seo
npm run typecheck
npm run build
flyto-indexer verify --full-scan
```
