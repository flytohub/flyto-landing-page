# Decisions

## 2026-07-15 - Public SEO must cover automation and security together

Decision: the landing page, AI-readable indexes, and structured metadata must
describe Flyto2 as open-source AI workflow automation, MCP-native agent tools,
no-code browser automation, and evidence-backed security Warroom on one
flyto-core runtime.

Reason: keyword evidence and live-page review showed the public surface could
collapse into security-only positioning. Flyto2 has a security Warroom, but the
open-source execution kernel is also the discoverable automation and MCP
foundation for AI agents.

## 2026-07-15 - Public SEO is multilingual with English as x-default

Decision: advertise all supported locale routes through canonical metadata,
hreflang alternates, and sitemap alternates. English remains the unprefixed
default URL and `x-default` target.

Reason: the landing page has supported locale routes and localized message
bundles, and international discovery now needs explicit alternates instead of
leaving non-English pages reachable but undiscoverable.

## 2026-06-21 - Initial SEO avoided partial hreflang

Decision: keep the canonical helper limited until the multilingual SEO strategy
is fully verified.

Reason: partial hreflang is worse than no hreflang. Non-English routes are
reachable for users, but release readiness must not claim full international
SEO until localized metadata, sitemap entries, and screenshots are verified.

## 2026-06-21 - GEO crawler evidence is release evidence

Decision: include AI crawler access-log analysis in release packets.

Reason: GEO readiness requires observability. `robots.txt` and `llms.txt` are
necessary, but we also need evidence that AI search and user-triggered crawlers
reach citation-ready pages.
