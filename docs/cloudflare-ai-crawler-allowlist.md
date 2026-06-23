# Cloudflare AI Crawler Allowlist

## Scope

`flyto2.com` allows search engines and user-triggered AI retrieval in
`public/robots.txt`, but live probes on 2026-06-23 still returned 403 for
several AI search and realtime browse user agents at the Cloudflare edge.

This is an edge/WAF configuration issue, not a Next.js route-source issue.

## User Agents To Allow

Allow these user agents for `GET` and `HEAD` requests to public marketing,
docs, pricing, security, enterprise, trust, sitemap, robots, and llms paths:

- `ChatGPT-User`
- `OAI-SearchBot`
- `Claude-SearchBot`
- `Claude-User`
- `Claude-Web`
- `PerplexityBot`
- `Perplexity-User`

Keep training crawlers blocked unless the product policy changes:

- `GPTBot`
- `ClaudeBot`
- `anthropic-ai`
- `Google-Extended`
- `Bytespider`
- `CCBot`
- `Meta-ExternalAgent`
- `FacebookBot`

## Cloudflare Rule Shape

Create a custom WAF skip or allow rule before bot/challenge rules:

```text
if http.host in {"flyto2.com", "www.flyto2.com"}
and http.request.method in {"GET", "HEAD"}
and http.user_agent contains one of:
  ChatGPT-User
  OAI-SearchBot
  Claude-SearchBot
  Claude-User
  Claude-Web
  PerplexityBot
  Perplexity-User
and not http.request.uri.path contains one of:
  /.env
  /.git/
  /credentials
  /secrets
  /wp-admin
  /phpmyadmin
then skip managed challenge / bot fight / super bot fight for this request
```

Do not allow these UAs to bypass API auth, admin routes, or private app routes.
This rule is only for public citation and discovery surfaces.

## Verification

After changing Cloudflare, run:

```bash
python3 /Users/chester/flytohub/flyto-indexer/scripts/write_public_site_verification_evidence.py \
  /Users/chester/flytohub/reports/flyto2-public-site-$(date -u +%Y-%m-%dT%H%M%SZ) \
  --base-url https://flyto2.com \
  --browser-status ok \
  --timeout 12
```

Expected result for release confidence:

- `P0 findings: 0`
- `/api-docs/` is available
- `open_graph` is true
- realtime/search AI user agents no longer receive 403

