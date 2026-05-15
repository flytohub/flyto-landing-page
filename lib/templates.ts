export type TemplateContent = {
  slug: string;
  title: string;
  iconName: string;
  category: string;
  metaDescription: string;
  lede: string;
  whatItDoes: string[];
  features: string[];
  useCases: string[];
  howItWorks: string[];
  integrations: string[];
  quickStart: string;
  bestPractices: string[];
  faqs: Array<{ q: string; a: string }>;
  canonicalSlug?: string;
};

export const templates: TemplateContent[] = [
  // 1. Auto-Login Template
  {
    slug: "auto-login-template",
    title: "Auto-Login Template",
    iconName: "FileText",
    category: "Authentication & Sessions",
    metaDescription:
      "Automate website logins on Flyto2 Cloud with 2FA support, encrypted credential storage, and persistent session reuse for headless browser workflows.",
    lede:
      "Sign into any site programmatically without rewriting selectors for every flow. The Auto-Login Template handles form fields, MFA challenges, and session persistence so downstream automations start authenticated.",
    whatItDoes: [
      "The template orchestrates the full login handshake against modern web applications: locating credential inputs, submitting the form, solving second-factor prompts via TOTP secrets or email codes, and capturing the resulting authenticated cookies. It abstracts away brittle selector logic with a configurable strategy that adapts to common login patterns.",
      "Once authenticated, the workflow serializes the browser state, including localStorage and cookies, to Flyto2's encrypted session store. Subsequent runs can replay the session without re-entering credentials, dramatically cutting execution time and reducing login-throttling risk on sites that flag repeated sign-ins.",
      "Sessions are scoped per environment and rotated automatically when expiry headers indicate staleness, so long-running pipelines stay logged in across days or weeks without operator intervention.",
    ],
    features: [
      "**Credential vault** stores usernames, passwords, and TOTP seeds with AES-256 encryption at rest and per-workspace access control.",
      "**2FA handling** supports TOTP authenticator codes, SMS relay via webhook, and email-based magic links extracted from IMAP inboxes.",
      "**Session replay** caches authenticated cookies and storage so follow-up jobs skip the login page entirely.",
      "**Selector resilience** falls back to ARIA labels, placeholder text, and visual matching when DOM IDs shift after a deploy.",
      "**Captcha awareness** detects challenge pages and routes them to a configured solver provider or queues them for manual approval.",
      "**Audit trail** records every login attempt with timestamp, outcome, and the IP that initiated the run for compliance review.",
    ],
    useCases: [
      "Maintain authenticated scrapes against partner portals that enforce SSO.",
      "Warm session pools for downstream e-commerce checkout automations.",
      "Authenticate test users for nightly QA browser regressions.",
      "Pull private dashboard data from analytics vendors lacking APIs.",
      "Refresh OAuth-bound third-party tokens that require browser-based consent.",
    ],
    howItWorks: [
      "Pick a credential profile from the vault or create one with username, password, and optional TOTP secret.",
      "Configure the target URL, login form selectors, and any custom wait conditions the site requires.",
      "Launch a headless Chromium instance through the Flyto2 runtime with stealth flags enabled.",
      "Submit credentials, then detect and resolve any second-factor challenge that appears.",
      "Verify a post-login indicator such as a profile element or dashboard URL pattern.",
      "Persist the cookie jar and storage snapshot to the session store, tagged with an expiry hint.",
      "Hand off the authenticated context to the next step in your workflow chain.",
    ],
    integrations: [
      "Chromium",
      "Playwright",
      "1Password",
      "Bitwarden",
      "Authy",
      "Okta",
      "Auth0",
      "IMAP",
    ],
    quickStart:
      "flyto template install auto-login-template\nflyto secret set sso.creds --username you@example.com --password '...' --totp-seed JBSWY3DPEHPK3PXP\nflyto run auto-login-template --target https://app.example.com --profile sso.creds",
    bestPractices: [
      "Store credentials only in the encrypted vault, never inline in workflow YAML or environment variables checked into git.",
      "Reuse session snapshots aggressively to avoid triggering anomaly detection on sites that score login frequency.",
      "Rotate TOTP seeds in lockstep with the source authenticator app and version your credential profiles.",
      "Add a post-login assertion that verifies a known DOM element so silent redirects to error pages fail loudly.",
    ],
    faqs: [
      {
        q: "Does it support SSO providers?",
        a: "Yes. The template detects SAML and OIDC redirects, follows them through the identity provider's login page, and completes the round trip back to the application. Common IdPs like Okta, Azure AD, and Auth0 work without customization.",
      },
      {
        q: "How are passwords protected?",
        a: "Credentials live in Flyto2's vault, encrypted with AES-256 using workspace-scoped keys. Secrets are decrypted only inside the isolated runner at execution time and are never written to logs, artifacts, or job metadata.",
      },
      {
        q: "Can I solve captchas automatically?",
        a: "The template detects reCAPTCHA, hCaptcha, and Cloudflare Turnstile challenges. You can wire in a third-party solver via webhook, or pause the run and notify a human reviewer through Slack to complete the challenge manually.",
      },
      {
        q: "What happens when a session expires?",
        a: "The runtime inspects cookie expiry headers and the presence of login redirects on the first navigation. If the session is stale, it transparently re-authenticates using the stored credentials before continuing the workflow.",
      },
    ],
  },

  // 2. Craigslist Listings Scraper
  {
    slug: "craigslist-listings-scraper",
    title: "Craigslist Listings Scraper",
    iconName: "ShoppingCart",
    category: "Marketplace Data",
    metaDescription:
      "Scrape Craigslist classifieds at scale with the Flyto2 template. Extract titles, prices, locations, images, and seller contacts across categories and metros.",
    lede:
      "Collect structured Craigslist data across hundreds of metros without writing a single parser. This template handles pagination, geo-routing, and the messy markup that has tripped scrapers for two decades.",
    whatItDoes: [
      "The workflow walks any Craigslist subcategory across selected metros, paginating through results until it hits a configurable depth or an empty result set. Each listing card is normalized into a flat record with title, asking price, posting timestamp, neighborhood, attributes, and the canonical posting URL.",
      "For deeper enrichment, the template optionally opens each listing detail page to extract body text, image galleries, map coordinates when available, and the obfuscated email reply address. Results are deduplicated by Craigslist's stable post ID so repeat runs only emit new or updated postings.",
      "Output streams directly into Flyto2's dataset store or your warehouse of choice, making it trivial to build trend dashboards, price-tracking alerts, or arbitrage signals on top of the raw feed.",
    ],
    features: [
      "**Metro routing** targets any Craigslist regional subdomain and rotates between them on a single run.",
      "**Category coverage** supports for-sale, housing, jobs, services, community, and gigs verticals out of the box.",
      "**Image extraction** pulls all gallery thumbnails and resolves them to full-resolution URLs.",
      "**Deduplication** keys on Craigslist's stable post ID so incremental runs surface only new inventory.",
      "**Price normalization** parses asking prices into numeric values with currency detection for cross-metro comparison.",
      "**Geocoding hooks** attach lat/long pairs when the poster opted into the embedded map widget.",
    ],
    useCases: [
      "Track used-car inventory across regional markets for resale arbitrage.",
      "Aggregate apartment listings for rental analytics dashboards.",
      "Mine gig postings to benchmark hourly rates in your trade.",
      "Watch for keyword matches in for-sale to source rare collectibles.",
      "Feed lead-gen funnels with seller contact data from services categories.",
    ],
    howItWorks: [
      "Specify a Craigslist category path such as cars+trucks, apts, or computers.",
      "List the metros you want covered using their Craigslist subdomain identifiers.",
      "Configure pagination depth and an optional posting-age cutoff in days.",
      "The runner fetches each results page through Flyto2's rotating residential proxies.",
      "Listings are parsed into structured records and deduplicated against prior runs.",
      "Optionally fan out to detail pages for body text, full images, and reply addresses.",
      "Records land in your chosen sink: dataset, webhook, S3, or BigQuery.",
    ],
    integrations: [
      "Craigslist",
      "S3",
      "BigQuery",
      "Postgres",
      "Webhooks",
      "Google Sheets",
      "Airtable",
      "Slack",
    ],
    quickStart:
      "flyto template install craigslist-listings-scraper\nflyto run craigslist-listings-scraper --metros sfbay,newyork,losangeles --category cta --max-pages 10",
    bestPractices: [
      "Throttle concurrency per metro so a single subdomain never sees more than a couple of requests per second from your runners.",
      "Run incremental jobs on a short cadence rather than huge backfills, since Craigslist rotates posting IDs aggressively.",
      "Persist raw HTML for at least one run cycle so you can replay parsing if Craigslist tweaks its markup.",
      "Respect local listing terms of service and applicable jurisdictional rules before redistributing scraped content.",
    ],
    faqs: [
      {
        q: "How fresh is the data?",
        a: "Results reflect Craigslist's live index at the moment of the run. Most categories surface new postings within minutes of submission, so scheduling the template every 15 to 30 minutes captures near-real-time inventory in active metros.",
      },
      {
        q: "Can I get seller contact info?",
        a: "The template captures the obfuscated reply-to address Craigslist generates per posting. That address forwards messages to the seller's real inbox without exposing it. Phone numbers in body text are extracted when present.",
      },
      {
        q: "Does it handle anti-bot blocks?",
        a: "Yes. Flyto2's residential proxy pool, fingerprint rotation, and adaptive request pacing handle Craigslist's rate limits in the vast majority of sessions. Persistently blocked metros can be assigned dedicated proxy sticky-sessions.",
      },
      {
        q: "What output formats are supported?",
        a: "Records can be emitted as JSON, NDJSON, or CSV. The template ships with built-in sinks for S3, BigQuery, Postgres, Google Sheets, Airtable, and arbitrary HTTP webhooks for downstream pipeline integration.",
      },
    ],
  },

  // 3. Domain Availability Checker
  {
    slug: "domain-availability-checker",
    title: "Domain Availability Checker",
    iconName: "Search",
    category: "Domain & DNS Tools",
    metaDescription:
      "Bulk-check domain availability across hundreds of TLDs with Flyto2's automation template. Combine WHOIS, RDAP, and DNS probes for accurate results.",
    lede:
      "Sweep thousands of candidate domain names across every TLD that matters, then surface only the ones genuinely free to register. The template combines multiple authoritative sources to avoid false positives.",
    whatItDoes: [
      "The workflow accepts a list of base names and a list of TLDs, then expands them into a Cartesian product of fully qualified domain candidates. Each candidate is checked against RDAP for registries that expose it, falling back to traditional WHOIS for legacy TLDs, and finally to a live DNS probe as a tiebreaker when registry data is ambiguous.",
      "Results are graded into clear availability tiers: definitively available, definitively registered, premium-listed, restricted, and unknown. Premium and aftermarket-listed domains carry their asking price when surfaced through registrar APIs that publish it.",
      "Because RDAP and WHOIS quotas are unpredictable, the template paces requests per TLD registry, retries soft failures with exponential backoff, and caches negative responses to avoid re-checking obviously taken names on repeat runs.",
    ],
    features: [
      "**RDAP first** queries modern structured registry endpoints before falling back to legacy WHOIS text parsing.",
      "**DNS verification** confirms NS and SOA records as a tiebreaker for ambiguous registry responses.",
      "**Bulk expansion** combinatorially generates candidates from name lists, prefixes, suffixes, and TLD sets.",
      "**Premium detection** flags domains listed for aftermarket sale with their asking price when published.",
      "**Quota management** paces queries per TLD to stay under registry rate limits across long-running sweeps.",
      "**Result caching** stores negative answers so subsequent runs skip names already known to be taken.",
    ],
    useCases: [
      "Brainstorm and validate brand names for a product launch.",
      "Monitor expiring domains in a niche for backorder opportunities.",
      "Audit a portfolio for domains accidentally allowed to lapse.",
      "Vet defensive registrations across ccTLDs before a market expansion.",
      "Generate candidate hostnames for staging or microsite deployments.",
    ],
    howItWorks: [
      "Provide a list of base names or upload a CSV of candidates.",
      "Choose the TLDs to test against, from .com to niche ccTLDs.",
      "The template expands the candidates into a queue of fully qualified domains.",
      "Each candidate is probed via RDAP, with WHOIS fallback when needed.",
      "DNS records are checked as a final tiebreaker for unclear registry responses.",
      "Premium and aftermarket listings are tagged with their offer price if exposed.",
      "Graded results stream to your chosen output along with the timestamp and source of truth.",
    ],
    integrations: [
      "RDAP",
      "WHOIS",
      "DNS",
      "Namecheap",
      "GoDaddy",
      "Cloudflare Registrar",
      "Slack",
      "CSV",
    ],
    quickStart:
      "flyto template install domain-availability-checker\nflyto run domain-availability-checker --names-file ./names.txt --tlds com,io,dev,ai --output ./available.csv",
    bestPractices: [
      "Always cross-check with the registrar's checkout flow before assuming availability, since registry data can lag actual reservations by minutes.",
      "Cap concurrency per TLD to avoid being throttled by smaller registries that share infrastructure across multiple suffixes.",
      "Schedule sweeps during off-peak hours for the relevant registry's timezone to reduce queue times.",
      "Persist a history of available-but-not-registered names so you can detect when competitors swoop on candidates you considered.",
    ],
    faqs: [
      {
        q: "How accurate are the results?",
        a: "By combining RDAP, WHOIS, and DNS probes the template typically achieves better than 99 percent accuracy versus a registrar checkout. The remaining gap is mostly premium domains gated by registry-specific policies that only surface at purchase time.",
      },
      {
        q: "Does it support new gTLDs?",
        a: "Yes. RDAP coverage is mandatory for all new gTLDs delegated since 2014, so the template handles them natively. Legacy ccTLDs that still rely on WHOIS get a parser tuned per registry to extract availability signals reliably.",
      },
      {
        q: "Can it auto-register names?",
        a: "Out of the box the template only checks availability. You can chain it into a follow-up step that calls a registrar API such as Namecheap, GoDaddy, or Cloudflare Registrar to register matching candidates programmatically.",
      },
      {
        q: "What about IDN domains?",
        a: "Internationalized names in non-ASCII scripts are accepted on input and converted to Punycode before querying registries. Results display both the Unicode form for humans and the ACE form for machines or downstream registrar APIs.",
      },
    ],
  },

  // 4. GitHub Repo Stats Dashboard
  {
    slug: "github-repo-stats-dashboard",
    title: "GitHub Repo Stats Dashboard",
    iconName: "Database",
    category: "DevTools & Analytics",
    metaDescription:
      "Build a live GitHub repository analytics dashboard with Flyto2. Track stars, forks, traffic, issues, PR velocity, and contributor activity across repos.",
    lede:
      "Centralize health metrics for every repository your team owns. The template pulls historical and live stats from the GitHub API, persists them, and renders a dashboard you can share or embed.",
    whatItDoes: [
      "The workflow authenticates against the GitHub API using a fine-scoped personal access token or a GitHub App installation, then iterates through configured repositories to snapshot stars, forks, watchers, open and closed issues, pull request counts, release cadence, and code-frequency aggregates.",
      "Traffic data, including 14-day clone counts and unique visitors, is captured separately because GitHub only exposes those metrics to admins. Snapshots are timestamped and appended to a time-series store, building up a longitudinal record that survives GitHub's own rolling-window retention.",
      "A bundled dashboard renders the time series into sparklines, trend deltas, and contributor leaderboards. Threshold-based alerts can fire when, say, open issues spike or PR review latency crosses a defined SLA.",
    ],
    features: [
      "**Multi-repo support** ingests entire orgs or curated repo lists with a single configuration block.",
      "**Time-series storage** preserves daily snapshots indefinitely, beyond GitHub's 14-day traffic retention.",
      "**Traffic metrics** capture clones, unique cloners, page views, and referrers when admin permission is granted.",
      "**PR analytics** compute review latency, merge frequency, and author velocity for engineering productivity views.",
      "**Issue triage** breaks open issues down by label, milestone, and age bucket for backlog hygiene.",
      "**Webhook alerts** trigger Slack or PagerDuty notifications when defined metric thresholds are crossed.",
    ],
    useCases: [
      "Report weekly engineering KPIs to leadership without manual scraping.",
      "Spot adoption spikes on open-source projects to schedule release notes.",
      "Catch backlog growth in critical libraries before it becomes a crisis.",
      "Benchmark contributor activity across squads or product lines.",
      "Track community health on developer-relations programs.",
    ],
    howItWorks: [
      "Provide a GitHub token or App credentials with repo and traffic scopes.",
      "Configure the list of repositories or organization slugs to monitor.",
      "The template paginates through the GitHub REST and GraphQL APIs, batching where possible.",
      "Each metric category is snapshotted and tagged with the run timestamp.",
      "Records are upserted into the time-series store, preserving the historical record.",
      "Aggregations compute deltas, moving averages, and threshold breaches.",
      "The dashboard renders the latest view and threshold alerts fire if configured.",
    ],
    integrations: [
      "GitHub",
      "GitHub Apps",
      "Slack",
      "PagerDuty",
      "Grafana",
      "BigQuery",
      "Postgres",
      "Discord",
    ],
    quickStart:
      "flyto template install github-repo-stats-dashboard\nflyto secret set github.token ghp_xxx\nflyto run github-repo-stats-dashboard --org your-org --include-traffic",
    bestPractices: [
      "Use a GitHub App rather than a personal token for org-wide deployments so credentials survive employee changes and carry granular permissions.",
      "Schedule traffic snapshots daily, since GitHub aggregates clones and views on a 24-hour boundary that resets on UTC midnight.",
      "Mind primary and secondary rate limits by enabling the conditional-request cache the template ships with.",
      "Archive raw snapshots before transforming so you can backfill new metrics by replaying historical data.",
    ],
    faqs: [
      {
        q: "Does it work for private repos?",
        a: "Yes. As long as the token or GitHub App installation has the repo scope, private repositories are first-class. The template never embeds source code in snapshots; only metadata and aggregate counts leave the GitHub API surface.",
      },
      {
        q: "How are rate limits handled?",
        a: "The template uses conditional ETag requests to avoid spending quota on unchanged endpoints, exponentially backs off on secondary limits, and prefers GraphQL for endpoints that expose batched queries to minimize per-resource API calls.",
      },
      {
        q: "Can I export to BigQuery?",
        a: "Yes. A bundled sink streams normalized metric rows into BigQuery tables partitioned by date, which makes them easy to join against Looker, Tableau, or Metabase dashboards your analytics team already runs.",
      },
      {
        q: "What about GitHub Enterprise?",
        a: "GitHub Enterprise Server and Enterprise Cloud are both supported. Point the template at your custom API base URL and provide the corresponding token; all REST and GraphQL queries route through the configured endpoint automatically.",
      },
    ],
  },

  // 5. Google Search Results Scraper
  {
    slug: "google-search-results-scraper",
    title: "Google Search Results Scraper",
    iconName: "Search",
    category: "SERP & Research",
    metaDescription:
      "Scrape Google SERPs at scale with structured organic, ads, and SERP feature extraction. Geo-target, device-target, and track keyword rankings over time.",
    lede:
      "Extract the full structure of Google search results, not just the top ten blue links. The template captures organic positions, ads, knowledge panels, featured snippets, and people-also-ask blocks in one pass.",
    whatItDoes: [
      "The workflow accepts a list of keywords, locales, and device profiles, then issues each query through a rotating proxy pool with realistic browser fingerprints. The raw SERP HTML is parsed into a normalized schema that separates organic results from paid ads, shopping carousels, video carousels, image packs, and other SERP features Google currently exposes.",
      "Each result carries its absolute position, vertical position within its block, the display URL, the parsed canonical URL, the rendered title and snippet, and any rich-result decorations such as ratings, dates, or sitelinks. Featured snippets and knowledge panels are extracted into their own structured records.",
      "Snapshots are timestamped so consecutive runs build a longitudinal ranking history. Combined with keyword cohorts, this lets you track share-of-voice movements, sudden ranking drops, or feature gains for any tracked domain.",
    ],
    features: [
      "**Geo targeting** specifies country, region, and city through Google's gl and uule parameters for localized SERPs.",
      "**Device profiles** render mobile, tablet, and desktop SERPs to capture the differences in feature layout.",
      "**SERP feature extraction** parses ads, shopping, video, image packs, knowledge panels, and people-also-ask blocks.",
      "**Historical tracking** appends every snapshot so ranking deltas and feature changes are queryable over time.",
      "**Domain rollups** aggregate impressions per tracked domain across cohorts of keywords for share-of-voice views.",
      "**Snapshot HTML** is archived alongside parsed results so you can re-parse on schema updates without re-querying.",
    ],
    useCases: [
      "Track keyword rankings for a portfolio of client domains.",
      "Audit competitor visibility across a target geography.",
      "Capture featured-snippet ownership trends for content strategy.",
      "Monitor brand SERPs for unauthorized ad placements.",
      "Feed a rank-tracking dashboard for SEO reporting cadences.",
    ],
    howItWorks: [
      "Provide the keyword list, target locales, and device profiles to cover.",
      "The runner issues each query through a residential or mobile proxy pool.",
      "Raw SERP HTML is captured and stored before parsing for resilience.",
      "Parsers extract organic, paid, and feature blocks into a unified schema.",
      "Each result is annotated with absolute and within-block position metadata.",
      "Snapshots are upserted into the time-series store keyed by keyword and locale.",
      "Optional rollup steps compute deltas and write summary rows for dashboards.",
    ],
    integrations: [
      "Google Search",
      "Looker Studio",
      "BigQuery",
      "Snowflake",
      "Slack",
      "Sheets",
      "Webhooks",
      "Postgres",
    ],
    quickStart:
      "flyto template install google-search-results-scraper\nflyto run google-search-results-scraper --keywords-file kw.txt --gl us --device mobile",
    bestPractices: [
      "Diversify your proxy pool by ASN and geography, since Google fingerprints common datacenter ranges aggressively and burns them out within hours.",
      "Pace queries per locale so that any one country's SERP doesn't spike with sudden volume that triggers captcha walls.",
      "Archive raw HTML for at least 30 days because Google rolls out SERP feature changes quietly and you may need to re-parse history.",
      "Always store the captured-at timestamp alongside every position record so ranking deltas remain auditable downstream.",
    ],
    faqs: [
      {
        q: "Does it handle captchas?",
        a: "Yes. The template detects Google's recaptcha and unusual traffic interstitials, then routes the request through a fresh proxy session and modified fingerprint. Persistent challenges can be offloaded to a configured solver provider for unattended runs.",
      },
      {
        q: "Can it scrape from specific countries?",
        a: "Yes. Google's gl, hl, and uule parameters are exposed directly, and the template pairs them with proxies physically located in the target country to ensure SERPs match what a local user would see, including local-pack and ad inventory.",
      },
      {
        q: "What about mobile vs desktop?",
        a: "Device profiles cover desktop, tablet, and several mobile fingerprints. Each runs with a matching User-Agent, viewport, and feature set so SERP layout, ad slot counts, and feature presence reflect what a real device would render.",
      },
      {
        q: "Is the output stable over time?",
        a: "Field names in the parsed schema are versioned. When Google introduces a new SERP block the template adds fields without renaming existing ones, so downstream pipelines that consume the data continue working through schema evolution.",
      },
    ],
  },

  // 6. LinkedIn Job Listings Scraper
  {
    slug: "linkedin-job-listings-scraper",
    title: "LinkedIn Job Listings Scraper",
    iconName: "Database",
    category: "Recruitment & Jobs",
    metaDescription:
      "Pull LinkedIn job postings into a structured dataset for recruiting analytics, market intelligence, and ATS sync with the Flyto2 automation template.",
    lede:
      "Turn LinkedIn's job search into a queryable dataset. The template harvests postings by role, company, geography, and seniority, then normalizes them for downstream recruiting and market-intel pipelines.",
    whatItDoes: [
      "The workflow drives LinkedIn's public jobs search interface using search filters that map directly to the parameters recruiters use in the UI: keyword, location, remote status, experience level, job type, and posted-within window. Result pages are paginated to the configured depth, with each job card normalized into a record carrying the job ID, title, company, location, posting age, and direct apply indicator.",
      "Each job detail page is then visited to enrich the record with the full description text, required skills extracted from the structured skill chips, salary information when LinkedIn surfaces it, and the apply URL whether internal or external. Company logo and slug are also captured for matching against a CRM or ATS.",
      "Deduplication keys on LinkedIn's stable job posting ID so repeat runs return only new or updated postings, enabling delta pipelines that feed candidate alerting or competitive-hiring dashboards without reprocessing the entire universe.",
    ],
    features: [
      "**Filter parity** mirrors every LinkedIn search filter, including remote, experience level, and posted-within windows.",
      "**Description extraction** captures the full job posting body cleanly, stripping LinkedIn's wrapper markup.",
      "**Skill parsing** pulls structured skill chips so postings can be tag-indexed without NLP downstream.",
      "**Salary capture** surfaces compensation ranges whenever LinkedIn renders them on the detail page.",
      "**Company enrichment** resolves the posting company to its LinkedIn slug for cross-referencing.",
      "**Delta runs** key on stable job IDs so scheduled jobs only emit new or changed postings.",
    ],
    useCases: [
      "Power a job-board aggregator with structured LinkedIn inventory.",
      "Track competitor hiring velocity by role and location.",
      "Benchmark salary ranges per skill across a target market.",
      "Source passive-candidate lists for niche technical roles.",
      "Feed a recruiting CRM with the latest postings each morning.",
    ],
    howItWorks: [
      "Configure the keyword, location, and filter set that mirrors a LinkedIn search.",
      "The runner authenticates with a maintained session pulled from the secret vault.",
      "Search result pages are paginated until depth or posted-within cutoff hits.",
      "Job cards are normalized into compact records with stable identifiers.",
      "Each card's detail page is opened to extract description, skills, and salary.",
      "Records are deduplicated against the prior run and tagged with first-seen dates.",
      "Output streams to your chosen sink for ATS, CRM, or analytics ingestion.",
    ],
    integrations: [
      "LinkedIn",
      "Greenhouse",
      "Lever",
      "Workday",
      "HubSpot",
      "Salesforce",
      "BigQuery",
      "Airtable",
    ],
    quickStart:
      "flyto template install linkedin-job-listings-scraper\nflyto run linkedin-job-listings-scraper --keywords 'site reliability' --location 'United States' --remote true",
    bestPractices: [
      "Use a long-lived authenticated session pulled from the vault rather than logging in on every run, which dramatically reduces friction with LinkedIn's anti-automation systems.",
      "Stagger runs across the day instead of one massive nightly sweep, since concentrated traffic from a single account is the strongest signal flagged.",
      "Honor LinkedIn's terms of service and applicable jurisdictional rules around employment data scraping before redistributing the dataset.",
      "Snapshot raw search-result and detail HTML so parser changes upstream can be reprocessed without re-fetching the source pages.",
    ],
    faqs: [
      {
        q: "Do I need a premium account?",
        a: "No. The template works against the public jobs search surface that LinkedIn exposes to any signed-in account, free or premium. Premium accounts unlock additional filter combinations such as applicant counts, which the template will capture when available.",
      },
      {
        q: "How are bans avoided?",
        a: "Session-based authentication, conservative request pacing, residential proxy rotation, and human-like navigation patterns combine to keep accounts in good standing. The template also detects soft warnings and pauses the run to avoid escalation.",
      },
      {
        q: "Is salary always captured?",
        a: "Salary is captured whenever LinkedIn renders it on the posting. Coverage varies by region: US postings frequently expose ranges due to local pay-transparency laws, while postings from other geographies are inconsistent. The field is null when absent.",
      },
      {
        q: "Can I push to my ATS directly?",
        a: "Yes. Bundled sinks for Greenhouse, Lever, and Workday transform records into the ATS-specific schema and call the appropriate ingestion endpoint. Custom ATS integrations can be added with a small mapping function and webhook.",
      },
    ],
  },

  // 7. News Headlines Aggregator
  {
    slug: "news-headlines-aggregator",
    title: "News Headlines Aggregator",
    iconName: "FileText",
    category: "News & Content",
    metaDescription:
      "Aggregate breaking headlines across hundreds of news outlets into one unified, deduplicated stream with the Flyto2 news scraping automation template.",
    lede:
      "Build a unified news firehose from any combination of mainstream outlets, niche blogs, and RSS feeds. The template normalizes, deduplicates, and clusters stories so duplicates of the same event collapse into one.",
    whatItDoes: [
      "The workflow ingests headlines from a curated set of sources using whichever access method each one supports best: RSS or Atom feeds where available, structured site APIs where they exist, and rendered HTML scraping as a fallback. Each headline is normalized into a record with title, summary, canonical URL, source name, publication timestamp, and detected language.",
      "A clustering step groups headlines that refer to the same underlying event using a combination of canonical URL deduplication, near-duplicate title hashing, and embedding-based similarity. The resulting clusters surface the spread of coverage on a story across outlets and let you spot when a single source has a scoop.",
      "Output is delivered as a sorted feed, with newest-first ordering and per-cluster metadata indicating the count of contributing sources. This drives newsletter generation, briefing emails, internal dashboards, or downstream NLP enrichment for sentiment and entity extraction.",
    ],
    features: [
      "**Multi-protocol ingestion** combines RSS, Atom, JSON feeds, and HTML scraping into one stream.",
      "**Story clustering** groups duplicate coverage across outlets so each event appears once with source count.",
      "**Language detection** tags each headline with its detected language for downstream routing or filtering.",
      "**Timezone normalization** rewrites publication timestamps to UTC for cross-source chronological ordering.",
      "**Source curation** lets you build per-topic source lists rather than relying on one general firehose.",
      "**Webhook delivery** pushes new headlines to Slack, Teams, or any HTTP endpoint within seconds of detection.",
    ],
    useCases: [
      "Power a morning briefing email with overnight headlines.",
      "Monitor brand mentions across business media in real time.",
      "Feed an NLP pipeline for trend or sentiment analysis.",
      "Build a niche topic aggregator for an internal newsletter.",
      "Track breaking news on a competitor across global outlets.",
    ],
    howItWorks: [
      "Provide a list of sources with each one's preferred access method.",
      "The runner polls feeds and scrapes pages on each source's recommended interval.",
      "Headlines are parsed and normalized into a uniform record schema.",
      "Canonical URLs are resolved through redirect chains to enable deduplication.",
      "Near-duplicate titles are hashed and embedding similarity is computed for clustering.",
      "Clusters are scored by source count, recency, and configurable topic weights.",
      "The ordered feed is pushed to your sink: webhook, dataset, or email digest.",
    ],
    integrations: [
      "RSS",
      "Atom",
      "Slack",
      "Discord",
      "Microsoft Teams",
      "Mailchimp",
      "Notion",
      "Postgres",
    ],
    quickStart:
      "flyto template install news-headlines-aggregator\nflyto run news-headlines-aggregator --sources-file ./sources.yaml --cluster-window 6h",
    bestPractices: [
      "Honor each source's robots directives and rate-limit headers, especially for paywalled outlets where overly aggressive polling will get your IP nullrouted within hours.",
      "Tune the cluster similarity threshold per topic, since political stories tend to share more title overlap than, say, tech product launches.",
      "Persist the resolved canonical URL alongside the original link so AMP, tracking, and syndication redirects don't fracture clusters.",
      "Rotate source lists periodically to add new outlets and prune dead feeds, since outlet RSS support has been steadily eroding over the past five years.",
    ],
    faqs: [
      {
        q: "What if a source has no RSS?",
        a: "The template falls back to HTML scraping with a per-source parser specification. You provide CSS or XPath selectors for the headline, summary, link, and timestamp fields, and the runner handles the polling, retries, and normalization to the unified schema.",
      },
      {
        q: "How does clustering work?",
        a: "Three signals combine: canonical URL match after redirect resolution, near-duplicate hashing on normalized titles, and cosine similarity on sentence embeddings. The combined score is thresholded into clusters, with a configurable cutoff per source profile.",
      },
      {
        q: "Can I filter by topic?",
        a: "Yes. Filters can apply at three layers: per source by inclusion or exclusion, per headline by keyword or regex, and per cluster by aggregate score. Topic models can also be plugged in as a final filter step before delivery to your sink.",
      },
      {
        q: "How fast are headlines delivered?",
        a: "RSS-based sources surface within the polling interval you configure, typically one to five minutes. HTML-scraped sources match their cadence to each site's update frequency to avoid wasted requests, so latency varies from one minute to one hour.",
      },
    ],
  },

  // 8. Page Load Speed Tester
  {
    slug: "page-load-speed-tester",
    title: "Page Load Speed Tester",
    iconName: "Bell",
    category: "Performance & Monitoring",
    metaDescription:
      "Run synthetic page-load tests with real Core Web Vitals, waterfall data, and regression alerts using the Flyto2 web performance automation template.",
    lede:
      "Catch performance regressions before users do. The template measures Core Web Vitals from multiple geographies and devices, then alerts when key metrics drift outside the baseline you defined.",
    whatItDoes: [
      "The workflow launches a real Chromium browser through Lighthouse and the Chrome DevTools Protocol to collect a full waterfall, request timing, and the Core Web Vitals trio: Largest Contentful Paint, Cumulative Layout Shift, and Interaction to Next Paint. Tests run from configurable geographies and device profiles to surface CDN, network, and rendering issues that vary by audience.",
      "Each run captures filmstrip thumbnails, the request inventory with byte sizes and timing, third-party script attribution, and a list of performance suggestions weighted by their estimated impact. Results are stored with the deploy SHA and commit metadata so regressions tie back to the specific change that introduced them.",
      "Baselines are computed as a rolling median over a configurable window. When a metric drifts beyond a percent or absolute threshold, the workflow emits an alert with the offending request waterfall attached so the on-call engineer has the diagnostic context they need immediately.",
    ],
    features: [
      "**Lighthouse-powered** runs the same audits Chrome devtools surfaces, with consistent scoring per category.",
      "**Multi-location testing** dispatches synthetic tests from configurable regions for global audience coverage.",
      "**Device emulation** profiles desktop, mobile-mid, and mobile-low so you see what real users experience.",
      "**Regression alerts** compare against a rolling baseline and fire Slack or PagerDuty notifications on drift.",
      "**Deploy correlation** ties each run to the deployed commit so regressions point at the responsible change.",
      "**Waterfall artifacts** archive HAR files for every run so investigations don't require reproducing the test.",
    ],
    useCases: [
      "Guard production performance against unintended regressions.",
      "Compare CDN configurations across geographies for a global launch.",
      "Benchmark competitor pages on the same routes you optimize.",
      "Validate third-party tag changes before they roll out to production.",
      "Track Core Web Vitals trends for an ongoing performance program.",
    ],
    howItWorks: [
      "Define the URLs, geographies, and device profiles you want to monitor.",
      "Schedule a cadence per route, typically 5 to 30 minutes for hot paths.",
      "Each run spins up a fresh Chromium with the requested emulation profile.",
      "Lighthouse executes its audit pipeline, gathering metrics and resource timing.",
      "Results are normalized, persisted, and compared against the rolling baseline.",
      "Alerts fire when thresholds are breached, attaching the waterfall for context.",
      "Dashboards aggregate trends by route, geography, and device for ongoing review.",
    ],
    integrations: [
      "Lighthouse",
      "Chrome DevTools Protocol",
      "Slack",
      "PagerDuty",
      "Datadog",
      "Grafana",
      "BigQuery",
      "GitHub",
    ],
    quickStart:
      "flyto template install page-load-speed-tester\nflyto run page-load-speed-tester --url https://your-site.com --device mobile --location us-east",
    bestPractices: [
      "Run from at least three geographies to distinguish network effects from server or rendering issues, since a regression in one region rarely implies a regression everywhere.",
      "Pin the Lighthouse version explicitly so audit scoring stays comparable across months as Lighthouse evolves its rubric.",
      "Set alert thresholds against your rolling baseline rather than absolute numbers, which avoids noisy alarms when a page legitimately gets richer.",
      "Always store the HAR alongside the summary metrics so debugging a regression doesn't require reproducing the run from scratch.",
    ],
    faqs: [
      {
        q: "Real users or synthetic?",
        a: "Synthetic. The template runs scheduled tests from controlled environments, which gives consistent baselines and is independent of traffic volume. For real-user metrics, layer in a RUM tool that captures the same Core Web Vitals from production sessions.",
      },
      {
        q: "Does it test logged-in pages?",
        a: "Yes. Combine this template with the Auto-Login Template to authenticate before measurement, then point the speed test at any URL requiring a session. The captured cookies are scoped to the test run and discarded afterward.",
      },
      {
        q: "How are baselines computed?",
        a: "By default, the template computes a 14-day rolling median per metric per route per location and device. The window is configurable. Alerts fire when the latest run deviates by either a percent threshold or an absolute delta from that baseline.",
      },
      {
        q: "Can it block bad deploys?",
        a: "Yes. Wire the template into CI as a required check. The runner returns a non-zero exit status if any tracked metric exceeds the configured threshold, blocking the deploy pipeline until the regression is investigated or explicitly waived.",
      },
    ],
  },

  // 9. Real Estate Listings Monitor
  {
    slug: "real-estate-listings-monitor",
    title: "Real Estate Listings Monitor",
    iconName: "Bell",
    category: "Real Estate",
    metaDescription:
      "Track real estate listings on Zillow, Redfin, Realtor, and MLS portals with the Flyto2 monitor template. Get alerts on new inventory and price changes.",
    lede:
      "Be the first to know when a property hits the market or its price drops. The template watches major real estate portals at sub-hourly cadence and alerts you the moment a tracked criterion fires.",
    whatItDoes: [
      "The workflow polls saved searches across Zillow, Redfin, Realtor.com, and MLS-backed regional portals, normalizing the wildly inconsistent schemas each one publishes into a unified record. Every listing carries the address, price, bed and bath count, square footage, lot size, year built, listing status, photo URLs, and the canonical listing URL on the source portal.",
      "Listings are diffed against the prior run so the template emits three discrete event streams: new inventory matching saved criteria, price changes on tracked listings, and status transitions such as pending, contingent, or sold. Each event includes the before-and-after snapshot for full audit history.",
      "Notifications can fan out to Slack, email, SMS, and webhook simultaneously, with rich payloads that embed the lead photo and a deep link to the listing. The dataset itself is queryable for trend analysis on neighborhood inventory, price distributions, and time-to-sale.",
    ],
    features: [
      "**Multi-portal coverage** unifies Zillow, Redfin, Realtor, and many MLS regional sites into one schema.",
      "**Saved search emulation** replays your portal-defined criteria so results match what you see in the UI.",
      "**Price change tracking** logs every list-price revision with timestamp and delta for trend analysis.",
      "**Status events** fire on transitions to pending, contingent, sold, withdrawn, and back-on-market.",
      "**Photo capture** archives lead images so listings remain reviewable even after delisting.",
      "**Geofence filtering** post-filters results against a polygon or radius for surgical neighborhood targeting.",
    ],
    useCases: [
      "Alert clients the moment a matching property lists in a competitive market.",
      "Track investment-grade inventory across multiple metros and price bands.",
      "Detect price drops on watched properties for negotiation timing.",
      "Compile time-on-market analytics for a target neighborhood.",
      "Monitor for tax-sale and short-sale inventory across counties.",
    ],
    howItWorks: [
      "Configure saved searches per portal with your criteria: price band, beds, geography.",
      "The runner polls each portal on the configured cadence, often 5 to 15 minutes.",
      "Result pages are paginated and normalized into the unified listing schema.",
      "Each listing is diffed against the prior snapshot to detect new, changed, or status events.",
      "Optional geofence and keyword filters refine the event stream before alerting.",
      "Alerts dispatch through your chosen channels with rich previews of the listing.",
      "All listings and events stream into the dataset for historical analytics.",
    ],
    integrations: [
      "Zillow",
      "Redfin",
      "Realtor.com",
      "MLS",
      "Slack",
      "Twilio",
      "Mailgun",
      "Webhooks",
    ],
    quickStart:
      "flyto template install real-estate-listings-monitor\nflyto run real-estate-listings-monitor --portal zillow --saved-search-url https://www.zillow.com/...",
    bestPractices: [
      "Respect each portal's terms of service and applicable real-estate data licensing, since MLS data carries specific usage restrictions that vary by region.",
      "Cap polling to no more than every five minutes per saved search, since faster cadences rarely yield fresher inventory and increase the risk of rate-limiting.",
      "Persist the full listing record on every change so you can reconstruct the price history even when portals scrub it.",
      "Use geofence post-filters rather than narrow portal-side polygons, because portals occasionally lose listings outside their geocoded boundary.",
    ],
    faqs: [
      {
        q: "Which portals are supported?",
        a: "Zillow, Redfin, Realtor.com, Trulia, and a growing list of MLS-backed regional portals are supported out of the box. Adding a new portal typically takes one parser file mapping the source schema into the unified listing record format.",
      },
      {
        q: "How quick are alerts?",
        a: "Latency from listing publication to alert delivery is typically under your configured polling interval plus a few seconds for parsing and dispatch. Most users run at 5 to 10 minute intervals, so end-to-end latency lands well under a quarter hour.",
      },
      {
        q: "Can I track off-market homes?",
        a: "Off-market data is portal-specific. Zillow exposes a partial off-market estimate that the template captures when present. True off-market inventory typically requires direct MLS access, which the template can integrate with when credentials are supplied.",
      },
      {
        q: "What about commercial listings?",
        a: "The template is tuned for residential schemas out of the box. Commercial portals like LoopNet and Crexi follow a different schema and field set; a separate commercial parser can be enabled by configuration when you need that coverage.",
      },
    ],
  },

  // 10. Restaurant Menu Scraper
  {
    slug: "restaurant-menu-scraper-2",
    title: "Restaurant Menu Scraper",
    iconName: "ShoppingCart",
    category: "Food & Hospitality",
    metaDescription:
      "Extract restaurant menus from Uber Eats, DoorDash, Grubhub, and direct sites into structured data with the Flyto2 menu scraping automation template.",
    lede:
      "Pull every dish, modifier, and price from major delivery platforms into a clean dataset. The template handles the divergent schemas of Uber Eats, DoorDash, Grubhub, and direct restaurant sites.",
    whatItDoes: [
      "The workflow accepts a list of restaurant identifiers, whether platform-specific IDs or direct site URLs, and harvests the complete menu structure from each source. Menus are parsed into a hierarchy of sections, items, modifier groups, and option choices, with prices captured for every selectable combination.",
      "Item records include the name, description, price, image URL, dietary tags, calorie counts when published, and the modifier groups attached to that item. Modifier groups carry their min and max selection constraints, individual choice prices, and any default selections so downstream consumers can model the full pricing surface accurately.",
      "Because delivery platforms vary prices and availability by location, the template can pin queries to specific delivery addresses to capture the real consumer-facing menu rather than a generic catalog. Output streams into a normalized schema regardless of the source platform.",
    ],
    features: [
      "**Multi-platform support** ingests Uber Eats, DoorDash, Grubhub, Postmates, and direct restaurant sites.",
      "**Modifier modeling** captures group constraints, choice prices, and default selections completely.",
      "**Address pinning** queries platform menus from specific delivery locations to surface location-aware pricing.",
      "**Dietary tags** preserve vegan, gluten-free, halal, and other tags exposed by the platform.",
      "**Image capture** archives item photos so downstream catalogs remain visually rich.",
      "**Price history** tracks dish-level price changes over time as platforms revise menus.",
    ],
    useCases: [
      "Benchmark competitor pricing across delivery platforms in your market.",
      "Build a unified menu catalog for a multi-location restaurant brand.",
      "Power a food-discovery search index with structured menu data.",
      "Audit menu parity across platforms a chain operates on.",
      "Feed AI nutrition tools with structured dish-level item descriptions.",
    ],
    howItWorks: [
      "Provide a list of restaurant URLs or platform-specific identifiers.",
      "Configure delivery addresses if location-aware pricing is required.",
      "The runner fetches each menu through the platform's mobile or web surface.",
      "Parsers normalize the raw menu into sections, items, and modifier groups.",
      "Image URLs are resolved to their full-resolution variants where available.",
      "Output is deduplicated against the prior snapshot to emit only changed items.",
      "The unified dataset lands in your chosen sink for downstream consumption.",
    ],
    integrations: [
      "Uber Eats",
      "DoorDash",
      "Grubhub",
      "Postmates",
      "Square",
      "Toast",
      "Airtable",
      "Postgres",
    ],
    quickStart:
      "flyto template install restaurant-menu-scraper\nflyto run restaurant-menu-scraper --platform doordash --restaurant-id 12345 --delivery-zip 10001",
    bestPractices: [
      "Always pin queries to a delivery address that matches your analysis market, since menu availability and even item-level pricing varies by location on every major platform.",
      "Re-snapshot menus at least weekly because price changes are common and item-level deletions happen quietly without status events on most platforms.",
      "Honor platform terms of service and applicable jurisdictional rules around food-pricing data before redistributing the dataset commercially.",
      "Store the raw menu payload alongside the normalized output so future schema enhancements can be backfilled without re-fetching.",
    ],
    faqs: [
      {
        q: "Does it capture modifiers fully?",
        a: "Yes. Modifier groups, their min and max constraints, individual choice prices, and default selections are all captured. Downstream consumers can compute the price of every possible item configuration without re-querying the source platform.",
      },
      {
        q: "Are prices location-aware?",
        a: "When you supply a delivery address, the template queries the platform as if you were ordering from that location, so the menu reflects local pricing, surcharges, and availability. Without an address, the platform's default catalog is captured.",
      },
      {
        q: "Can I scrape direct websites?",
        a: "Yes. Direct restaurant sites typically render menus through one of a small number of POS-vendor widgets like Toast or Square. The template auto-detects the vendor and applies the appropriate parser, with fallback to generic HTML extraction.",
      },
      {
        q: "How often should I scrape?",
        a: "Weekly is a good baseline for stable catalogs. For markets where pricing changes frequently or new items launch often, a daily cadence captures more change without becoming wasteful. Sub-daily polling is rarely worth the additional cost.",
      },
    ],
  },

  // 11. Send Telegram Alert
  {
    slug: "send-telegram-alert",
    title: "Send Telegram Alert",
    iconName: "Bell",
    category: "Notifications",
    metaDescription:
      "Send rich Telegram alerts to channels, groups, or direct chats from any Flyto2 workflow with templating, inline keyboards, and delivery confirmation.",
    lede:
      "Turn any automation event into a rich Telegram notification. The template handles bot tokens, channel routing, message templating, and inline keyboards so alerts land formatted and actionable.",
    whatItDoes: [
      "The workflow accepts a message body, optional inline buttons, and a routing target that can be a channel handle, a numeric chat ID, or a list of recipients. It uses the Telegram Bot API to deliver each message, retrying transient failures with exponential backoff and surfacing the message ID for downstream edits or deletions.",
      "Messages support the full Telegram formatting surface: bold, italic, monospace, code blocks, hyperlinks, mentions, and inline keyboards with up to eight rows of callback or URL buttons. A templating layer interpolates values from the workflow context so payloads carry rich, contextual data like asset names, threshold values, and timestamps.",
      "For long-running operations, the template can edit a single message in place to reflect progress rather than spamming a channel with a dozen status updates. Delivery confirmation and read receipts where available are surfaced back into the workflow context for downstream conditional logic.",
    ],
    features: [
      "**Channel routing** delivers to public channels, private groups, supergroups, and direct chats interchangeably.",
      "**Rich formatting** supports Markdown, HTML, and entities for mentions, code blocks, and styled links.",
      "**Inline keyboards** attach callback or URL buttons to drive interactive responses from recipients.",
      "**Message editing** updates an existing message in place for progress indicators on long workflows.",
      "**Attachment support** sends images, documents, audio, and video with captions and thumbnails.",
      "**Delivery confirmation** returns the Telegram message ID and timestamp for downstream tracking.",
    ],
    useCases: [
      "Notify on-call engineers when monitoring thresholds fire.",
      "Push trading signals from a strategy backend into a private channel.",
      "Send daily KPI digests to a leadership group with embedded charts.",
      "Trigger manual-approval flows with inline accept and reject buttons.",
      "Deliver scraped alerts like price drops or new listings instantly.",
    ],
    howItWorks: [
      "Register a bot with @BotFather and store the token in the Flyto2 vault.",
      "Add the bot to the target channel or group and grant post permissions.",
      "Configure the workflow to call this template with body, target, and options.",
      "The runner formats the payload according to the chosen parse mode.",
      "The Telegram Bot API receives the request through Flyto2's outbound proxy.",
      "On success, the message ID and timestamp return to the workflow context.",
      "Transient errors retry with exponential backoff; permanent errors surface clearly.",
    ],
    integrations: [
      "Telegram Bot API",
      "Markdown",
      "HTML",
      "Webhooks",
      "Prometheus",
      "Grafana",
      "Sentry",
      "Stripe",
    ],
    quickStart:
      "flyto template install telegram-alert-sender\nflyto secret set telegram.bot-token 1234:ABC...\nflyto run telegram-alert-sender --chat @your-channel --text 'Deploy complete'",
    bestPractices: [
      "Use HTML parse mode when message content includes user-supplied strings, since it has the most predictable escape rules and avoids Markdown parser quirks.",
      "Group related alerts into one message via editMessageText rather than firing many discrete messages, which keeps channels readable during noisy incidents.",
      "Rate-limit alerts on the workflow side because Telegram throttles bots to 30 messages per second across all chats, and 1 per second per individual chat.",
      "Always include a workflow run ID in the message footer so operators can trace alerts back to the originating execution for debugging.",
    ],
    faqs: [
      {
        q: "How do I create the bot?",
        a: "Open a chat with @BotFather on Telegram, run /newbot, supply a name and a unique handle. BotFather returns a bot token, which you store as a Flyto2 secret. The bot then needs to be added to whichever channel or group it will post into.",
      },
      {
        q: "Can it send to user DMs?",
        a: "Yes, but only after the user has first initiated a conversation with the bot. Telegram does not allow bots to message users unsolicited. Direct chats are addressed by the user's numeric Telegram ID, which the bot captures on the first message.",
      },
      {
        q: "Are inline buttons interactive?",
        a: "Yes. Callback-type buttons trigger a webhook on the bot when clicked, which can route back into a Flyto2 workflow for approval flows or quick actions. URL-type buttons simply open external links without a callback.",
      },
      {
        q: "What's the message size limit?",
        a: "Telegram caps text messages at 4096 characters and captions at 1024 characters. The template detects oversized payloads and automatically splits them across multiple messages, preserving formatting and adding a continuation marker between parts.",
      },
    ],
  },

  // 12. Stock Price Dashboard
  {
    slug: "stock-price-dashboard-scraper",
    title: "Stock Price Dashboard",
    iconName: "Database",
    category: "Finance & Market Data",
    metaDescription:
      "Build a real-time stock price dashboard with the Flyto2 template. Aggregate quotes, fundamentals, news, and alerts across multiple market data sources.",
    lede:
      "Consolidate live quotes, fundamentals, and news for any watchlist into a single auditable dashboard. The template fans out across multiple data providers and reconciles them into a unified view.",
    whatItDoes: [
      "The workflow polls market data providers for live or delayed quotes, depending on your entitlement, and combines them with intraday OHLC bars, fundamentals snapshots, and news headlines. Each ticker is normalized into a record carrying the last trade, bid, ask, day open, day high, day low, volume, and previous close.",
      "Fundamentals are refreshed on a slower cadence and include market cap, P/E, EPS, dividend yield, and the most recent earnings date and surprise. Headlines per ticker stream in from a configurable news source list and are deduplicated so a single corporate event doesn't flood the dashboard.",
      "Alerts fire on configurable conditions: percent change thresholds, technical signal crosses such as a 50-day moving average breach, or unusual volume relative to the 20-day average. Each alert carries the precise trigger and the latest quote so the recipient has context the moment they read it.",
    ],
    features: [
      "**Multi-provider quotes** failover across data vendors so a single outage doesn't blank the dashboard.",
      "**Fundamentals overlay** annotates the price view with market cap, P/E, dividend yield, and earnings dates.",
      "**News integration** ties recent headlines per ticker into the same view as price action.",
      "**Threshold alerts** fire on percent change, moving-average crosses, or unusual-volume conditions.",
      "**Watchlist management** lets you organize tickers into named lists for sector or portfolio views.",
      "**Historical store** preserves quotes and snapshots indefinitely for backtests or trend dashboards.",
    ],
    useCases: [
      "Power an internal trading-floor dashboard with consolidated quotes.",
      "Alert investment teams on unusual price or volume moves in real time.",
      "Run scheduled portfolio reports with per-ticker performance breakdowns.",
      "Feed a backtest engine with normalized historical OHLC bars.",
      "Build investor-relations dashboards comparing the company to peers.",
    ],
    howItWorks: [
      "Configure the watchlist and the polling cadence per provider.",
      "Store any vendor API keys in the secrets vault, scoped per workspace.",
      "The runner fans out parallel quote requests across configured vendors.",
      "Responses are normalized into a unified ticker record schema.",
      "Fundamentals and news refresh on their own slower cadences in parallel.",
      "Alert evaluators run against each new record to detect threshold breaches.",
      "The dashboard renders the latest values and emits alerts on the configured channels.",
    ],
    integrations: [
      "Polygon",
      "Alpha Vantage",
      "IEX Cloud",
      "Finnhub",
      "Tradier",
      "Slack",
      "Discord",
      "Grafana",
    ],
    quickStart:
      "flyto template install stock-price-dashboard\nflyto secret set polygon.api-key xxx\nflyto run stock-price-dashboard --tickers AAPL,MSFT,NVDA --interval 30s",
    bestPractices: [
      "Respect each data vendor's entitlement terms, since quote redistribution rules differ between consumer feeds and professional subscriptions in ways that matter legally.",
      "Use vendor failover rather than load balancing, because cross-source reconciliation requires a primary truth and a fallback rather than a mix that creates phantom ticks.",
      "Be conservative with alert thresholds; setting them too tight produces alert fatigue, and after-hours volatility on thin volume routinely fires noisy alarms.",
      "Persist raw quote payloads in addition to normalized records, which lets you audit any disputed alert against the original vendor message.",
    ],
    faqs: [
      {
        q: "Are quotes real-time?",
        a: "It depends on your vendor entitlement. Free tiers from most providers are 15-minute delayed. Paid real-time entitlements pass through unchanged. The template surfaces the as-of timestamp and the entitlement level so consumers know what they're looking at.",
      },
      {
        q: "What asset classes are supported?",
        a: "US and global equities, ETFs, mutual funds, and major crypto pairs are supported through the listed providers. Options, futures, and FX are accessible by configuring a vendor that publishes them; the unified schema accommodates multiple asset types.",
      },
      {
        q: "Can I run backtests on the data?",
        a: "Yes. Historical OHLC bars accumulate in the dataset store indefinitely, and a bundled exporter writes parquet files in a backtest-friendly schema. Most popular backtest frameworks can ingest these files without further transformation.",
      },
      {
        q: "What about after-hours quotes?",
        a: "Extended-hours quotes are captured when the provider supplies them, with a flag indicating session type: pre-market, regular, after-hours, or closed. Many alerts can be configured to suppress or de-weight events outside the regular session window.",
      },
    ],
  },

  // 13. Weather Forecast to Slack
  {
    slug: "weather-forecast-to-slack",
    title: "Weather Forecast to Slack",
    iconName: "Calendar",
    category: "Weather & Productivity",
    metaDescription:
      "Send daily weather forecasts to Slack channels or DMs with rich blocks, location targeting, and severe-weather alerts via the Flyto2 automation template.",
    lede:
      "Start every workday with a personalized weather brief in Slack. The template pulls forecasts for one or many locations, renders rich Slack blocks, and escalates when severe weather threatens.",
    whatItDoes: [
      "The workflow runs on a configurable schedule, fetching forecasts for each tracked location from a weather provider of your choice. It builds a Slack Block Kit payload that renders the current conditions, hourly outlook for the next 12 hours, and the daily highs and lows for the rest of the week, with emoji icons matching the forecast condition codes.",
      "Locations can be addressed by city name, postal code, or latitude and longitude pair, and each can be paired with a Slack channel or user destination so different teams or individuals receive relevant geographies. Time-of-day delivery is configurable per location to match each recipient's morning routine in their own timezone.",
      "When the provider flags a severe weather alert, the template escalates by posting an additional message tagged with @here or @channel and including the National Weather Service or equivalent warning details. Alerts deduplicate so a single multi-hour warning doesn't pulse the channel every run.",
    ],
    features: [
      "**Rich Slack blocks** render forecasts with emoji icons, dividers, and contextual sections cleanly.",
      "**Multi-location** targeting pairs each location with its own destination channel or user.",
      "**Severe weather alerts** escalate when the provider issues warnings, with deduplication on alert IDs.",
      "**Timezone-aware** scheduling delivers each forecast at the recipient's local morning time.",
      "**Provider flexibility** supports OpenWeather, AccuWeather, Tomorrow.io, and the NWS public API.",
      "**Block customization** lets you tweak the layout, units, and language per recipient profile.",
    ],
    useCases: [
      "Greet team channels with a morning weather brief in their local timezone.",
      "Warn field operations teams about incoming severe weather windows.",
      "Send personalized DMs to remote employees in disparate geographies.",
      "Trigger automatic remote-work declarations when storms threaten an office.",
      "Brief event organizers on conditions at upcoming outdoor venues.",
    ],
    howItWorks: [
      "Configure the locations, their destinations, and the per-recipient delivery time.",
      "Store the weather provider API key in the Flyto2 secrets vault.",
      "The scheduler triggers the workflow per location at the configured local hour.",
      "The runner fetches current conditions, hourly forecast, and daily highs and lows.",
      "A Block Kit payload is composed with the appropriate emoji and formatting.",
      "Slack receives the payload via the channel or user webhook target.",
      "Severe weather alerts evaluate after the main post and fire only on new advisory IDs.",
    ],
    integrations: [
      "OpenWeather",
      "AccuWeather",
      "Tomorrow.io",
      "National Weather Service",
      "Slack",
      "Cron",
      "Webhooks",
      "Discord",
    ],
    quickStart:
      "flyto template install weather-to-slack\nflyto secret set openweather.api-key xxx\nflyto run weather-to-slack --location 'Seattle, WA' --channel '#team-pnw' --time '07:30'",
    bestPractices: [
      "Choose unit systems per recipient rather than per workspace, since teams that span continents have legitimate divergent expectations of imperial versus metric.",
      "Send forecasts as scheduled messages rather than ad-hoc posts, so they appear at the right local time even when the runner is in a different region from the recipient.",
      "Suppress severe-weather escalations during the deep night unless the warning is truly life-safety, which keeps the alert volume tuned to actionable threats.",
      "Cache forecasts briefly when the same location feeds multiple recipients so one provider call serves many Slack posts.",
    ],
    faqs: [
      {
        q: "Which provider should I use?",
        a: "For US-only deployments, the National Weather Service public API is free, authoritative, and rate-friendly. For global coverage or richer hourly data, OpenWeather and Tomorrow.io are common picks. The template supports switching providers per location.",
      },
      {
        q: "Can it post to DMs?",
        a: "Yes. Slack user IDs are accepted as targets alongside channel names. The Slack app installed into your workspace needs the chat:write scope, and the recipient must have a Slack workspace presence under the bot's authorized installation.",
      },
      {
        q: "How are severe alerts handled?",
        a: "Severe weather advisories from the provider are deduplicated on the official alert ID so a multi-hour warning only triggers one Slack escalation. Continued alerts past the initial threshold can optionally re-fire on a cooldown you configure.",
      },
      {
        q: "What about non-Slack delivery?",
        a: "While the template is named for Slack, the underlying notification layer also supports Discord, Microsoft Teams, and arbitrary webhooks. The Block Kit payload is translated to the destination's native rich-message format where possible.",
      },
    ],
  },

  // 14. Webpage to PDF Converter
  {
    slug: "webpage-to-pdf-converter",
    title: "Webpage to PDF Converter",
    iconName: "FileText",
    category: "Document Generation",
    metaDescription:
      "Convert any web page to a high-fidelity PDF on Flyto2 Cloud with custom page size, headers, footers, page numbering, and watermark support built in.",
    lede:
      "Render any URL into a pixel-faithful PDF that opens cleanly in any viewer. The template controls page size, margins, headers, footers, watermarks, and the page-numbering details that printed documents demand.",
    whatItDoes: [
      "The workflow accepts a URL or batch of URLs and renders each one through a headless Chromium instance using its native print-to-PDF pipeline. The result is a true PDF, not a screenshot wrapped in PDF, with selectable text, vector graphics, and live hyperlinks preserved in the output document.",
      "Page layout is fully controllable: paper size from A4 to Tabloid to custom dimensions, portrait or landscape orientation, configurable margins on all sides, and CSS media queries respected for print stylesheets. Headers and footers accept HTML templates with placeholders for page number, total pages, title, date, and arbitrary user-supplied tokens.",
      "For authenticated content, the template chains with the Auto-Login Template to capture a session before rendering. For long pages, it can chunk output into multiple PDFs at logical break points to avoid producing files too large for downstream email or storage limits.",
    ],
    features: [
      "**Native print rendering** uses Chromium's print pipeline for vector output with selectable text.",
      "**Custom page layout** controls paper size, orientation, margins, and scale factor independently.",
      "**Header and footer templates** support HTML with placeholders for pagination and metadata.",
      "**Watermarks** overlay text or image marks on every page for confidentiality or branding.",
      "**Authenticated capture** chains with Auto-Login to render content behind a login wall.",
      "**Batch mode** processes URL lists concurrently with per-job customization profiles.",
    ],
    useCases: [
      "Archive marketing landing pages for compliance retention.",
      "Generate invoice or report PDFs from rendered HTML templates.",
      "Snapshot blog or wiki pages on a schedule for offline review.",
      "Produce print-ready PDFs from web-only research articles.",
      "Bundle internal dashboards into PDFs for executive distribution.",
    ],
    howItWorks: [
      "Provide one URL or a batch of URLs along with the desired layout settings.",
      "Optionally chain Auto-Login Template to capture an authenticated session.",
      "The runner launches a headless Chromium with the configured viewport and emulation.",
      "The page is loaded, network-idle is awaited, and print media queries activate.",
      "Chromium's print-to-PDF pipeline produces the document with vector output.",
      "Headers, footers, and watermarks are composited from the configured templates.",
      "The resulting PDF lands in your chosen sink: S3, Drive, Dropbox, or webhook.",
    ],
    integrations: [
      "Chromium",
      "Puppeteer",
      "S3",
      "Google Drive",
      "Dropbox",
      "OneDrive",
      "DocuSign",
      "Webhooks",
    ],
    quickStart:
      "flyto template install webpage-to-pdf-converter\nflyto run webpage-to-pdf-converter --url https://example.com/report --paper a4 --output ./report.pdf",
    bestPractices: [
      "Always wait for network idle and any custom render-complete signal before triggering print, because lazy-loaded images and fonts commonly aren't ready at DOMContentLoaded.",
      "Author dedicated print stylesheets for documents you produce regularly, since the default screen stylesheet is rarely optimal for paginated output.",
      "Embed fonts in the PDF rather than relying on system fonts when documents will be opened on machines you don't control.",
      "Compress output PDFs with the bundled optimizer for archival use, since Chromium's native output is unoptimized and routinely 2 to 5 times larger than necessary.",
    ],
    faqs: [
      {
        q: "Is the output selectable text?",
        a: "Yes. The template uses Chromium's print-to-PDF pipeline rather than a screenshot path, so text in the output is real text glyphs that can be selected, copied, and indexed by PDF tooling like Acrobat search, full-text indexers, or accessibility readers.",
      },
      {
        q: "How are hyperlinks preserved?",
        a: "Anchor tags in the rendered HTML are preserved as PDF link annotations pointing to their target URLs. Internal anchor links to in-page IDs are translated into intra-document links so navigation works correctly in the resulting PDF document.",
      },
      {
        q: "Can I add page numbers?",
        a: "Yes. The footer template accepts placeholders for current page, total pages, and date among others. Standard tokens like {pageNumber} of {totalPages} produce conventional pagination, and the layout is fully styled with HTML and inline CSS as needed.",
      },
      {
        q: "What about long single-page documents?",
        a: "Very long pages render fine but produce correspondingly large PDFs. The template can optionally split output at logical page-break points to produce a series of smaller documents, useful for long reports or for fitting email attachment size limits.",
      },
    ],
  },

  // 15. Website Screenshot Gallery
  {
    slug: "website-screenshot-gallery",
    title: "Website Screenshot Gallery",
    iconName: "FileText",
    category: "Visual Monitoring",
    metaDescription:
      "Capture scheduled website screenshots into a searchable gallery with visual diffing, multi-viewport coverage, and asset retention via Flyto2 automation.",
    lede:
      "Build a visual history of any set of pages. The template snapshots screenshots on a schedule, runs pixel diffs against the previous capture, and indexes everything into a browsable gallery.",
    whatItDoes: [
      "The workflow accepts a list of URLs and a cadence, capturing full-page screenshots through a headless Chromium with configurable viewport sizes. Each capture is stored along with the page metadata, the screenshot dimensions, the rendered DOM size, and the network waterfall to support visual debugging when something looks off.",
      "Between consecutive captures the template runs perceptual diffing rather than naive pixel comparison, which absorbs minor anti-aliasing drift but flags meaningful visual changes. A heat map overlay shows exactly where the page changed, making it trivial to spot a misplaced hero image, missing component, or regression on a marketing page.",
      "Captures are indexed into a browsable gallery with filters by URL, date, and viewport, plus a timeline view that lets you scrub through the visual history of any page. Webhook alerts can fire on significant visual change for proactive monitoring of high-value landing pages.",
    ],
    features: [
      "**Multi-viewport captures** snapshot desktop, tablet, and mobile sizes for each scheduled run.",
      "**Perceptual diffing** flags meaningful visual changes while ignoring noise like anti-aliasing drift.",
      "**Heat map overlays** visualize exactly which page regions changed between two snapshots.",
      "**Timeline browser** scrubs through the visual history of any tracked page chronologically.",
      "**Webhook alerts** fire on configurable visual-change thresholds for proactive monitoring.",
      "**Asset retention** preserves screenshots indefinitely with cold-storage tiers for older captures.",
    ],
    useCases: [
      "Monitor competitor landing pages for redesigns and pricing changes.",
      "Track visual regressions on production pages across deploys.",
      "Build a historical archive of brand-critical marketing pages.",
      "Audit ad creative rotations across high-traffic placements.",
      "Document news or media homepages for journalism research.",
    ],
    howItWorks: [
      "Configure the URLs, viewport sizes, and capture cadence.",
      "The scheduler dispatches captures at each interval per configured viewport.",
      "A fresh Chromium instance loads each page and awaits render-complete signals.",
      "Full-page screenshots are captured and stored alongside metadata and a HAR.",
      "Each capture is perceptually diffed against the previous snapshot in the same series.",
      "Significant changes are scored and emit webhook alerts when thresholds are exceeded.",
      "All captures are indexed for the gallery and timeline views.",
    ],
    integrations: [
      "Chromium",
      "Puppeteer",
      "S3",
      "Cloudflare R2",
      "Slack",
      "Webhooks",
      "Figma",
      "Notion",
    ],
    quickStart:
      "flyto template install website-screenshot-gallery\nflyto run website-screenshot-gallery --urls-file urls.txt --viewports desktop,mobile --interval 1h",
    bestPractices: [
      "Use perceptual diffing rather than raw pixel comparison, because subtle rendering noise on the same content otherwise triggers false alarms on every other capture.",
      "Snapshot at the viewport sizes your real audience uses rather than a fixed standard, since hero-image positioning behaves very differently across viewport breakpoints.",
      "Tier storage by age, moving captures older than a few weeks to cold storage, because gallery browsing is overwhelmingly biased toward recent history.",
      "Mask known dynamic regions like timestamps or carousels before diffing so the change score isn't dominated by intentional rotation rather than real regressions.",
    ],
    faqs: [
      {
        q: "How big are the captures?",
        a: "Full-page screenshots vary widely with page length, but a typical marketing landing page lands between 200 KB and 2 MB per viewport. Long content pages or media-heavy designs can exceed 10 MB. Captures compress well in WebP and cold-storage tiers.",
      },
      {
        q: "Does it handle authenticated pages?",
        a: "Yes. Chain it with the Auto-Login Template to capture an authenticated session before screenshotting. The captured session cookies are scoped to the run and are not retained alongside the resulting screenshots in the gallery for security reasons.",
      },
      {
        q: "Can I diff against a baseline?",
        a: "Yes. Beyond rolling diffs against the previous capture, you can pin any historical snapshot as a baseline for visual regression testing. Diffs against the baseline persist alongside diffs against neighbors, exposing both gradual drift and immediate regressions.",
      },
      {
        q: "What about animated content?",
        a: "Animations are paused before capture by injecting a stylesheet that sets animation-play-state to paused and disables transitions. This ensures the same frame is captured each time, eliminating noisy diffs from naturally moving content like sliders.",
      },
    ],
  },

  // 16. Website Uptime Monitor
  {
    slug: "website-uptime-monitor",
    title: "Website Uptime Monitor",
    iconName: "Bell",
    category: "Monitoring & SRE",
    metaDescription:
      "Monitor website uptime, latency, and SSL expiry from multiple regions with rich incident escalation via the Flyto2 uptime monitoring automation template.",
    lede:
      "Watch your services from outside your own infrastructure. The template runs synthetic checks from multiple regions, escalates real incidents intelligently, and produces the status-page data your customers expect.",
    whatItDoes: [
      "The workflow runs synthetic HTTP, HTTPS, TCP, and ICMP checks against configured targets from multiple geographic regions. Each probe captures the response status, the full latency breakdown by DNS, connect, TLS handshake, and time to first byte, and the response body fingerprint so content drift can be detected alongside availability outages.",
      "Failures are corroborated across at least two regions before declaring an incident, which suppresses false positives from a single probe's transient network issue. SSL certificate expiry is tracked separately with configurable warning windows so renewals never lapse silently. Page-content assertions can verify specific strings or selectors appear in the response.",
      "Incidents escalate through configurable on-call rotations using a tiered policy: an initial Slack post, then SMS or phone-call escalation through PagerDuty or Opsgenie if unacknowledged. Status-page data feeds out via a JSON endpoint or direct integration with Statuspage.io so end-users see the same source of truth your responders see.",
    ],
    features: [
      "**Multi-region probes** corroborate failures across regions before declaring an incident.",
      "**Latency breakdown** captures DNS, connect, TLS, and TTFB independently for diagnostic clarity.",
      "**SSL monitoring** tracks certificate expiry with configurable warning thresholds per target.",
      "**Content assertions** verify expected strings or DOM selectors appear in every response.",
      "**Escalation policies** route incidents through tiered Slack to PagerDuty to phone-call chains.",
      "**Status page export** publishes JSON or Statuspage.io-compatible feeds for customer-facing pages.",
    ],
    useCases: [
      "Run customer-facing status pages with credible third-party probing.",
      "Detect partial outages affecting one region while others remain healthy.",
      "Prevent SSL renewal lapses across a portfolio of properties.",
      "Spot content regressions where the site is up but serving an error template.",
      "Track SLA compliance against contractual uptime commitments.",
    ],
    howItWorks: [
      "Configure each target with its probe type, regions, and assertion rules.",
      "Set the polling interval per target, typically 30 to 60 seconds for hot endpoints.",
      "The runner dispatches probes from each configured region in parallel.",
      "Probes capture timing, status, and content fingerprints into structured records.",
      "Failures escalate only after corroboration across at least two regions.",
      "Incidents fire through the configured escalation policy with rich diagnostic context.",
      "Status-page data and historical SLA metrics export to the configured destinations.",
    ],
    integrations: [
      "PagerDuty",
      "Opsgenie",
      "Slack",
      "Statuspage.io",
      "Twilio",
      "Datadog",
      "Grafana",
      "Webhooks",
    ],
    quickStart:
      "flyto template install website-uptime-monitor\nflyto run website-uptime-monitor --target https://api.your-service.com --regions us-east,eu-west,ap-southeast --interval 30s",
    bestPractices: [
      "Always require cross-region corroboration before declaring an incident, since single-region false positives are common and erode trust in the alerting system when they go unfiltered.",
      "Pair availability checks with content assertions, since many real outages return HTTP 200 with an error template rather than a 5xx status code, which a status-only probe misses entirely.",
      "Set SSL expiry warnings at multiple thresholds, with the longest at 30 days, since shorter-only warnings get missed during the holiday season when renewals already pile up.",
      "Tune escalation timeouts to the responder's reality, which is rarely the 2-minute default, because tight escalation chains burn out on-call engineers without improving recovery time.",
    ],
    faqs: [
      {
        q: "How frequently can I probe?",
        a: "Down to every 10 seconds per region for paid tiers, though 30 to 60 seconds is the sweet spot for most production endpoints. Sub-second probing rarely catches more real incidents and significantly increases the noise floor from transient network blips.",
      },
      {
        q: "What about TLS internals?",
        a: "The probe captures the certificate chain, the expiry date of the leaf certificate, the cipher suite negotiated, and the TLS version used. Notifications fire on impending expiry, unexpected cipher downgrades, or chain-validation failures separately from availability.",
      },
      {
        q: "Can it test login flows?",
        a: "Yes. Chain this template with the Auto-Login Template to authenticate before probing protected endpoints. The synthetic check then exercises the authenticated path, which catches issues that probing the public landing page would miss entirely.",
      },
      {
        q: "How are flapping incidents handled?",
        a: "Cross-region corroboration plus a configurable flap-detection window suppresses oscillating up-and-down states. An incident only opens when the failure persists across the window, and only auto-closes after a confirmed recovery threshold is sustained equivalently.",
      },
    ],
  },

  // 17. YouTube Channel Stats Tracker
  {
    slug: "youtube-channel-stats-tracker",
    title: "YouTube Channel Stats Tracker",
    iconName: "Database",
    category: "Social Media Analytics",
    metaDescription:
      "Track YouTube channel and video metrics over time with the Flyto2 automation template. Capture views, subs, watch time, and engagement across channels.",
    lede:
      "Build a longitudinal record of channel and video performance that outlives YouTube's own reporting windows. The template captures public metrics on a schedule and surfaces trends across your portfolio.",
    whatItDoes: [
      "The workflow uses the YouTube Data API to snapshot per-channel statistics including subscriber count, total view count, video count, and channel-level aggregates, plus per-video metrics like views, likes, comments, and the published timestamp. Where the channel owner has granted access, YouTube Analytics API metrics like watch time, average view duration, and traffic sources are also captured.",
      "Snapshots are timestamped and appended rather than overwritten, so the dataset becomes a historical record of the channel's growth trajectory that survives YouTube's own 28-day Studio retention for some breakdowns. Trend computations include rolling subscriber deltas, view velocity per video, and engagement rate normalized by view count.",
      "For multi-channel tracking, a creator or agency view rolls up metrics across the portfolio with sortable leaderboards by growth, total views, or engagement rate. Alerts fire on configurable events: a new video reaching a view threshold, a viral spike in subscriber acquisition, or a sustained drop in engagement on a category of content.",
    ],
    features: [
      "**Channel-level stats** capture subs, total views, video count, and create date on every snapshot.",
      "**Per-video metrics** track views, likes, comments, and published timestamp for the channel's full library.",
      "**Analytics API integration** pulls watch time and audience retention where the channel owner authorizes.",
      "**Historical trend store** preserves snapshots indefinitely beyond YouTube Studio's native retention.",
      "**Portfolio rollups** aggregate metrics across many channels for agency or network dashboards.",
      "**Threshold alerts** fire on viral video events, subscriber spikes, or engagement dropoffs.",
    ],
    useCases: [
      "Track creator portfolio performance for a multi-channel network.",
      "Spot viral moments on a channel within minutes of takeoff.",
      "Benchmark a channel against competitors in the same vertical.",
      "Audit sponsorship campaign reach across multiple creator partners.",
      "Feed creator dashboards with historical metrics for retention analysis.",
    ],
    howItWorks: [
      "Provide a list of channel IDs or handles to track.",
      "Store the YouTube Data API key, and optionally an OAuth token for Analytics API access.",
      "The runner queries channel-level statistics on the configured cadence.",
      "Video lists are paginated and per-video stats snapshotted alongside.",
      "Analytics API endpoints fetch watch time and retention when authorized.",
      "Snapshots append to the time-series store with full provenance metadata.",
      "Trend evaluators and alert thresholds run against the latest snapshot per channel.",
    ],
    integrations: [
      "YouTube Data API",
      "YouTube Analytics API",
      "Slack",
      "Discord",
      "BigQuery",
      "Looker Studio",
      "Notion",
      "Airtable",
    ],
    quickStart:
      "flyto template install youtube-channel-stats-tracker\nflyto secret set youtube.api-key xxx\nflyto run youtube-channel-stats-tracker --channels UCxxxx,UCyyyy --interval 6h",
    bestPractices: [
      "Snapshot at least every six hours for channels with active growth, since YouTube's public counters are aggressively rounded for large numbers and consequently lag a few hours behind actual events.",
      "Use OAuth and the Analytics API when you have channel-owner consent, because watch-time and retention data are vastly more informative than the public view count alone.",
      "Cache video-list pages aggressively, since the video library on most channels changes slowly and reissuing the same pagination on every run wastes quota for no fresh signal.",
      "Stay under the daily quota by batching channel queries together rather than serializing them, since the YouTube Data API charges per request rather than per channel queried.",
    ],
    faqs: [
      {
        q: "How precise are the counters?",
        a: "Public counters are intentionally rounded by YouTube for channels above modest thresholds: subscriber counts above 1,000 round, and view counts get binned at high magnitudes. The template captures rounding artifacts honestly so trend analyses account for them.",
      },
      {
        q: "What about private analytics?",
        a: "Private analytics like watch time, retention curves, and traffic sources are accessible only via the YouTube Analytics API and require OAuth consent from the channel owner. When granted, the template captures the richer dataset alongside the public metrics.",
      },
      {
        q: "Can I track competitor channels?",
        a: "Yes, for the public metrics. Competitor channels can be tracked with just an API key and their channel ID. Private analytics remain unavailable without owner consent, but public counters and per-video engagement metrics are unrestricted on every channel.",
      },
      {
        q: "What's the quota cost?",
        a: "Each daily run on a typical 100-video channel consumes roughly 10 to 20 quota units depending on which endpoints you enable. The free tier provides 10,000 units per day, so most users tracking dozens of channels stay well under the daily ceiling.",
      },
    ],
  },

  // 18-21. Canonical aliases
  {
    slug: "google-search-scraper-2",
    title: "Google Search Results Scraper",
    canonicalSlug: "google-search-results-scraper",
    iconName: "Search",
    category: "SERP & Research",
    metaDescription: "",
    lede: "",
    whatItDoes: [],
    features: [],
    useCases: [],
    howItWorks: [],
    integrations: [],
    quickStart: "",
    bestPractices: [],
    faqs: [],
  },
  {
    slug: "news-headlines-aggregator-2",
    title: "News Headlines Aggregator",
    canonicalSlug: "news-headlines-aggregator",
    iconName: "FileText",
    category: "News & Content",
    metaDescription: "",
    lede: "",
    whatItDoes: [],
    features: [],
    useCases: [],
    howItWorks: [],
    integrations: [],
    quickStart: "",
    bestPractices: [],
    faqs: [],
  },
  {
    slug: "webpage-to-pdf-2",
    title: "Webpage to PDF Converter",
    canonicalSlug: "webpage-to-pdf-converter",
    iconName: "FileText",
    category: "Document Generation",
    metaDescription: "",
    lede: "",
    whatItDoes: [],
    features: [],
    useCases: [],
    howItWorks: [],
    integrations: [],
    quickStart: "",
    bestPractices: [],
    faqs: [],
  },
  {
    slug: "website-uptime-monitor-3",
    title: "Website Uptime Monitor",
    canonicalSlug: "website-uptime-monitor",
    iconName: "Bell",
    category: "Monitoring & SRE",
    metaDescription: "",
    lede: "",
    whatItDoes: [],
    features: [],
    useCases: [],
    howItWorks: [],
    integrations: [],
    quickStart: "",
    bestPractices: [],
    faqs: [],
  },
];
