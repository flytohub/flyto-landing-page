# Tasks

- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [ ] Run `npm run geo:logs -- <access.log> --json <report.json> --csv <report.csv> --markdown <report.md>` on production or staging logs.
- [x] Verify sitemap and canonical output after any route change.
- [x] Decide and implement the multilingual hreflang strategy.
- [x] Sync landing SEO metadata and keyword evidence from `flyto-i18n`.
- [x] Add final trust, enterprise, airgap, open-source, compare, and API-docs route inventory.
- [ ] Apply the Cloudflare AI crawler allowlist in `docs/cloudflare-ai-crawler-allowlist.md`, then rerun live public-site verification.
- [x] Add `/community/` as an indexed public route.
- [x] Wire community route into sitemap, llms files, nav, footer, and SEO audits.
- [x] Move landing message drift guard into this repo and wire it into verify.
- [x] Add image sitemap and discovery manifest for landing visual assets.
- [x] Gate landing discovery files in `npm run build`, `npm run build:cf`, and
  `npm run audit:seo`.
- [ ] Recheck live Cloudflare deployment after the next automatic deploy.
