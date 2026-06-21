# Claude Code notes

Flyto2 landing changes should be treated as public product and SEO changes.

Use this order:

1. Read `PROJECT.md`, `ARCHITECTURE.md`, `STATE.md`, and `DECISIONS.md`.
2. Check route metadata, `app/sitemap.ts`, `public/robots.txt`,
   `public/llms.txt`, and `public/llms-full.txt` for public-surface changes.
3. For i18n copy, update `messages/*.json` consistently or document the missing
   locale keys in the handoff.
4. For GEO log analysis, use `npm run geo:logs -- <log files>`.

Never infer or reuse login credentials from repository files or handoffs.
