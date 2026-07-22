# Flyto2 Landing Technical Whitepaper

Status: current public-site architecture and documentation contract. Last reviewed: 2026-07-22.

## Abstract

`flyto-landing-page` is the canonical public product, conversion, and search
surface for Flyto2. It presents Flyto2 Cloud, Apps, Automation, Warroom CE,
Enterprise boundaries, technical whitepapers, community paths, and comparison
content through one multilingual Next.js application. The site is designed for
people, search engines, and answer engines without allowing metadata, sitemap,
localized copy, or AI-readable summaries to drift into separate product stories.

## Audience And Scope

The site serves automation builders, developers evaluating the open-source
runtime, security teams evaluating the Warroom, enterprise buyers, community
contributors, and crawlers that need stable citation-ready facts. It owns public
positioning and discovery. It does not own execution, tenant data, billing
authority, security findings, rating authority, or provider actions.

Product claims must resolve to maintained source repositories and current public
contracts. The landing site must not turn planned work into shipped capability,
describe Community Edition as containing private overlays, or claim guaranteed
replacement of another vendor.

## Runtime Architecture

The application uses the Next.js App Router and `next-intl`. Public route modules
live under `app/[locale]/`; shared layouts and sections live in `components/`;
route, content, locale, and SEO registries live in `lib/`, `messages/`,
`content/`, and `.seo/`.

Production uses the OpenNext Cloudflare adapter. `next build` creates the Next
application, `opennextjs-cloudflare build` creates `.open-next/worker.js` and
static assets, and `wrangler.json` defines the Worker and asset binding. The
Cloudflare dashboard Git integration deploys pushes to `main`; GitHub Actions
verify source and build output but do not require deployment credentials.

## Public Route Contract

English is the unprefixed canonical locale. Other locales use explicit prefixes.
Middleware rewrites canonical English paths to the internal locale route and
redirects public `/en/` variants to the unprefixed URL. Every page module owns or
delegates metadata generation; dynamic template and whitepaper routes enumerate
static parameters from source registries.

`lib/seo.ts` is the canonical URL and hreflang authority. `app/sitemap.ts`
combines static routes, required GEO routes, template slugs, and whitepaper slugs
for all supported locales. The generated [route reference](reference/routes.md)
maps each page module to its metadata, structured-data, and static-parameter
contract.

## SEO, AEO, And GEO Contract

Discovery is a coordinated release surface:

- page titles, descriptions, canonical links, OpenGraph, Twitter, and hreflang;
- `sitemap.xml` and `image-sitemap.xml`;
- `robots.txt`, `llms.txt`, and `llms-full.txt`;
- `discovery-manifest.json`, social images, BIMI, and `security.txt`;
- localized message catalogues and the shared i18n SEO manifest;
- keyword evidence, long-tail route coverage, Lighthouse, and link checks.

No single file proves SEO quality. Local audits validate source and built HTML;
Lighthouse validates rendered technical signals; link checks validate public
references; access-log analysis supplies crawler evidence; Search Console data,
when available, supplies external discovery evidence. Scores are gates and
diagnostics, not a guarantee of ranking or traffic.

## Localization

`messages/en.json` is the key baseline. Every locale must carry the same leaf key
set, while `.seo/i18n-seo-manifest.json` supplies hreflang, OpenGraph locale,
origin, and shared keyword clusters. A landing build consumes the committed
manifest cache so Cloudflare deployment does not depend on sibling repositories;
the sync audit checks the upstream `flyto-i18n` source when it is locally
available.

## Content And Whitepapers

Long-form product content is committed under `content/whitepaper/`. The registry
in `lib/whitepapers.ts` controls public slugs and reading-time metadata. These
documents explain architecture and product boundaries, but quantitative claims
must be refreshed from source-backed inventories. Historical module counts,
stacks, endpoint counts, or deployment descriptions are release-blocking drift.

## Forum And Client Data

The public discussion UI uses the Firebase Web SDK and degrades when public web
configuration is unavailable. Firestore rules remain the authority for public
forum access. Bulk seeding and moderation scripts are operator tools; they use
local credentials and must never be required to render or crawl public pages.

## Security And Privacy

The repository contains no service-account files, private API keys, customer
data, or deployment secrets. Browser-visible Firebase configuration is provided
through `NEXT_PUBLIC_*` values. Moderation credentials are local-only. Public
contact addresses use approved `@flyto2.com` aliases, and vulnerability reports
go to `security@flyto2.com` or GitHub private vulnerability reporting.

Public metadata and forum rendering must treat user content as untrusted. The
site avoids runtime private API dependencies for indexable content, and product
copy must preserve consent, tenant-isolation, evidence, and authorization
boundaries.

## Verification

`npm run verify` is the local release gate. It checks documentation drift,
message-key parity, GEO/public route contracts, TypeScript, the production build,
built SEO metadata, page scoring, and the SEO management report. CI also runs a
strict flyto-indexer full scan, dependency and secret checks, Lighthouse, public
link checks, CodeQL, and SBOM generation.

The generated [source reference](reference/README.md) uses the TypeScript compiler
AST to inventory tracked components, functions, methods, interfaces, types,
constants, scripts, and route modules. `docs/documentation-manifest.json` assigns
every maintained source area to durable narrative and generated documentation.

## Limitations

- Search rank, backlinks, social reach, and crawler traffic require external
  publication and cannot be proven by repository checks alone.
- Search Console and production access logs are external evidence and may not be
  present in a local checkout.
- Cloudflare dashboard deployment and edge redirect rules require live-platform
  verification after source checks pass.
- Generated source references prove traceability, not the accuracy of every
  product claim; current quantitative claims still require human review.
