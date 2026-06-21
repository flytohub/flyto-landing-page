# Public memory and GEO log analyzer

Date: 2026-06-21

Summary:

- Added the root project memory set.
- Added workflow docs and handoff registry.
- Added `scripts/analyze-ai-crawler-logs.mjs`.
- Added fixture coverage for search crawler, realtime browse, fake scanner path,
  and `Claude-User claude-code` exclusion.

Verification:

```bash
node scripts/analyze-ai-crawler-logs.mjs \
  --json /tmp/flyto2-geo-report.json \
  --csv /tmp/flyto2-geo-report.csv \
  --markdown /tmp/flyto2-geo-report.md \
  scripts/fixtures/ai-crawler-sample.log
```

Open risks:

- Full multilingual hreflang remains P1.
- Production GEO evidence still requires real access logs.
