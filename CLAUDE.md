# Claude Code notes

Flyto2 landing changes should be treated as public product and SEO changes.

Use this order:

1. Read `PROJECT.md`, `ARCHITECTURE.md`, `STATE.md`, and `DECISIONS.md`.
2. Use flyto-indexer search and impact, or repo search when the indexer is not
   available, for pre-change exploration of affected routes and shared metadata
   before changing public SEO/GEO behavior.
3. Check route metadata, `app/sitemap.ts`, `public/robots.txt`,
   `public/llms.txt`, and `public/llms-full.txt` for public-surface changes.
4. For i18n copy, update `messages/*.json` consistently or document the missing
   locale keys in the handoff.
5. For GEO log analysis, use `npm run geo:logs -- <log files>`.
6. For post-change verification, run `npm run audit:geo`,
   `npm run typecheck`, `npm run build`, and `npm run verify`; document skipped
   checks in the handoff.

Never infer or reuse login credentials from repository files or handoffs.
