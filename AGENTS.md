# Agent instructions

This repo ships the public `flyto2.com` product surface.

Before changing behavior, read:

- `PROJECT.md`
- `ARCHITECTURE.md`
- `STATE.md`
- `DECISIONS.md`
- `/Users/chester/flytohub/CODEX_HANDOFF_FLYTO_AUDIT.md`

Rules:

- Do not write credentials, API keys, session tokens, or customer data into this
  repo.
- Preserve the SEO/AEO/GEO contract: `robots.txt`, `llms.txt`, `llms-full.txt`,
  canonical metadata, static content, and sitemap changes must be reviewed
  together.
- Do not make unsupported security, benchmark, or competitor-replacement claims.
- Keep Flyto2 Cloud / Apps / Automation visible as a first-class product line,
  not a side page under security.
- Public security pages must keep consent, evidence, audit, and tenant-isolation
  language precise.
- Run `npm run typecheck` and `npm run build` before release changes when
  dependencies are available.
