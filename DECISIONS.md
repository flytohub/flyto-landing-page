# Decisions

## 2026-06-21 - Public SEO is English-first for this release

Decision: keep the current canonical helper English-first until the multilingual
SEO strategy is fully verified.

Reason: partial hreflang is worse than no hreflang. Non-English routes are
reachable for users, but release readiness must not claim full international
SEO until localized metadata, sitemap entries, and screenshots are verified.

## 2026-06-21 - GEO crawler evidence is release evidence

Decision: include AI crawler access-log analysis in release packets.

Reason: GEO readiness requires observability. `robots.txt` and `llms.txt` are
necessary, but we also need evidence that AI search and user-triggered crawlers
reach citation-ready pages.
