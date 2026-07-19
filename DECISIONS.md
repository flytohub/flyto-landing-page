# Decisions

## 2026-07-19 - Open-source route leads with Warroom CE

Decision: `/open-source/` should primarily explain Flyto2 Warroom CE as a
self-hosted open-core security warroom and BYO offensive validation platform.
The page can still mention Flyto2 Core as the shared automation runtime, but
the first-screen product value should be the installable CE loop.

Reason: public adoption needs a clear GitLab-style CE story: clone, run, seed a
workspace, inspect findings, attack paths, evidence, remediation, and reports.
The Enterprise Cloud Bridge remains the upgrade path for commercial
intelligence, rating authority, identity, managed runners, and live remediation
without exposing private implementation.

## 2026-07-18 - Community route is a public SEO surface

Decision: `/community/` is a first-class indexed landing route for contribution
paths, good-first issues, showcases, public examples, and review-first social
promotion.

Reason: community growth needs a canonical URL that social posts, GitHub
templates, docs, and blog articles can cite without scattering contributor
instructions across many repos.

## 2026-07-18 - Landing consumes the shared i18n SEO contract

Decision: landing keeps a committed `.seo/i18n-seo-manifest.json` cache synced
from `flyto-i18n/dist/seo-manifest.json`; build-time metadata reads the cache,
and `npm run audit:seo` compares the cache to upstream when the sibling repo is
available.

Reason: Cloudflare deploys this repository by itself, so public builds cannot
depend on a local sibling checkout. The cache keeps deployment stable while the
audit prevents the three public surfaces from drifting away from the shared
Flyto2 multilingual SEO source.

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
