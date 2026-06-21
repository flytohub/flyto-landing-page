# GEO log analysis

Use `npm run geo:logs` to analyze access logs for AI search and user-triggered
AI browsing evidence.

```bash
npm run geo:logs -- \
  --json reports/geo-ai-crawlers.json \
  --csv reports/geo-ai-crawlers.csv \
  --markdown reports/geo-ai-crawlers.md \
  access.log
```

The analyzer reports:

- crawler counts by user agent
- crawler counts by type: training, search index, realtime browse
- Top 10 paths
- Top 10 IPs
- hourly distribution in Asia/Taipei
- hits for `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/docs`, `/pricing`,
  `/security`, and `/enterprise`
- suspicious scanner paths such as `/.env`, `/.git/config`, `/wp-admin`, and
  `/phpmyadmin`
- `Claude-User` entries containing `claude-code`, excluded from user-browse
  evidence

ASN enrichment is intentionally offline. Pass `--asn-map ip-asn.csv` with
columns `ip,asn,provider,country` when ASN data has been resolved externally.
