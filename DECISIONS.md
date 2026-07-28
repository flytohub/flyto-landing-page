# Decisions

## 2026-07-28 - ChatGPT app trust surfaces are public and environment-bound

Decision: publish `/support/` and an accurate connected-service privacy policy
as canonical landing routes. Serve the OpenAI Apps challenge from the parent
domain through a dynamic route that reads only
`OPENAI_APPS_CHALLENGE_TOKEN`, returns the exact plain-text value, disables
caching, and fails with HTTP 404 when the secret is absent.

Reason: ChatGPT app review needs durable support, privacy, and domain-ownership
surfaces. The verification token is external release state, so committing it or
returning a placeholder would turn a review requirement into a secret leak or
false success.

## 2026-07-22 - Public documentation is generated from tracked source

Decision: use the TypeScript compiler AST to inventory all tracked landing
declarations and derive route, locale, SEO asset, configuration, automation,
and whitepaper references. Assign every maintained source area in
`docs/documentation-manifest.json`, and fail `npm run verify` and CI when the
generated reference or current architecture claims drift.

Reason: route and SEO audits prove selected public contracts, but they did not
make every helper, component, type, script, or content source discoverable.
Source-backed references provide complete traceability without asking
maintainers to duplicate implementation details by hand.

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
