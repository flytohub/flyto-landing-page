# Flyto Code — White Paper

**Version 0.1 · April 2026**

A full-spectrum application security platform with a code-intelligence layer
and a closed-loop verification engine. Built to collapse the static-scan,
dynamic-test, and code-understanding stacks into a single console.

---

## 1. Executive Summary

Application security is fragmented. Dependency scanners, SAST, DAST, secret
detection, IaC checks, and runtime protection each ship as separate tools
with their own console, pricing, and signal-to-noise profile. Tools that
understand code typically ignore risk; tools that report risk typically
don't verify, test, or fix what they surface.

**Flyto Code** is the single surface that does both, anchored by three
differentiators:

1. **Full coverage** — SCA, SAST, DAST, secrets, IaC, license, container,
   CSPM, runtime, endpoint — every category an application-security team
   typically buys, on one console.
2. **Code intelligence** — the same scanner that finds CVEs also produces
   architecture maps, API graphs, health scoring, and call graphs. One
   parse, two products.
3. **Closed-loop verification** — findings aren't dead ends. The platform
   generates a YAML pentest workflow for each security-relevant finding,
   runs it against staging in a real browser, and feeds the result
   (`exploitable` / `sanitized` / `unreachable`) back into the war room.
   Developers see evidence, not just alerts.

The target user is a CTO or security lead at an engineering-led company
(10-500 developers) who currently juggles three-plus tools and still
can't answer *"is this actually exploitable?"*.

---

## 2. The Problem

### 2.1 Existing categories and their gaps

| Category | What it does | What it misses |
|---|---|---|
| Code intelligence | Search, refactor, context | Security posture |
| Application security (SaaS) | SCA, SAST, secrets, license | Verification, context, aesthetics |
| DAST | Dynamic testing | Live code integration |
| Runtime protection | Real-time monitoring | Development-time linkage |
| Compliance | SOC 2 / ISO automation | Technical scanning |

Each of these is a partial view. An engineering org running all five ends
up with five separate dashboards, five separate auth integrations, five
separate ownership models, and no single question answered end-to-end.

### 2.2 The closed-loop gap

The most important gap is between *finding* and *proof*. A SAST tool says
"possible SQL injection at `handler.go:142`." The engineer then has to:

1. Decide if it's reachable from user input.
2. Build a request that might exploit it.
3. Run that request against staging.
4. Read the response.
5. Decide: exploit, false positive, or already mitigated?

Every step is manual. On busy teams it doesn't happen; findings accumulate
in a backlog that correlates with neither real risk nor remediation speed.

Flyto Code automates all five steps. That is the product's moat.

### 2.3 The data-processing gap

A secondary but persistent gap is the dashboard itself. Most security
consoles are "lists of findings with counts above each list." The
computation, aggregation, and trending live client-side or not at all.
As a consequence:

- Scores drift between pages (the same repo shows 70/100 here, B on that
  page, 640 somewhere else).
- Dashboards can't be shared because they don't render without a live
  session and a populated cache.
- Exec-facing roll-ups (grade distribution, top-5 at-risk, critical count)
  are recomputed on every render.

Flyto Code's architecture forbids this. All aggregation lives in the
engine; the frontend is a pure renderer. Scores and grades are unified by
a single Bitsight-style mapping shared across services.

---

## 3. The Flyto Code Solution

Flyto Code is the frontend of a closed-loop security platform. It consumes
four backend services and surfaces them as a single war room.

### 3.1 The war room

The primary UX is a three-column workspace:

```
┌──────────┬───────────────────────────────┬───────────────┐
│ Section  │  Main view                    │  Studio / AI  │
│ nav      │  (dashboard, repo, domain,    │  (outputs,    │
│          │   issues, pentest, settings)  │   reports)    │
└──────────┴───────────────────────────────┴───────────────┘
```

Left: nine colour-coded sections (Architecture / Security / Resources /
Cloud / Applications / CI-CD / Testing / Documents / Analytics), each
grouping 2-4 views. Centre: the selected view. Right: AI outputs
and generated artefacts.

Dark mode only. Icons only from `lucide-react`. No emoji. The aesthetic
target is a tactical console, not a status page.

### 3.2 The closed-loop verify flow

The defining interaction. From any scan finding:

```
[Finding shown in war room]
   │
   ▼  user clicks "Verify"
┌─────────────────────────────────────────┐
│ 1. Frontend POSTs to flyto-engine       │
│ 2. Engine looks up the real alert       │
│    (404 if it doesn't exist — no        │
│     phantom verifications)              │
│ 3. Engine dispatches to flyto-cloud,    │
│    which asks flyto-ai to generate a    │
│    YAML pentest workflow                │
│ 4. flyto-core executes the workflow     │
│    against the user's staging URL       │
│    using a real headless browser        │
│ 5. Live view streams JPEG frames back   │
│    to the modal via WebSocket           │
│ 6. Terminal verdict (exploitable /      │
│    sanitized / unreachable) persists    │
│    to DB and renders in the war room    │
└─────────────────────────────────────────┘
```

Every step is traceable. The YAML is visible. The evidence URL is
retained. The user never sees "possible SQL injection" without also
seeing "here's the request that proved it" or "here's why it didn't."

### 3.3 Zero-button onboarding

A CTO does not want to press buttons to get a dashboard. When a repo is
connected, the engine auto-enqueues the first scan server-side. No
frontend fallback, no manual trigger. If the user hits the scan button
during a queued or running scan, the API is idempotent and returns the
existing scan — the UI stays locked with a real progress indicator until
the server reports `complete` or `failed`.

The same applies to pentest projects. Adding a domain auto-triggers all
eleven discovery passes (DNS, subdomains, HTTP headers, DNS security,
ports, API verify, PageSpeed, SSL, tech stack, WHOIS, WAF) as an
independent parallel fan-out. Each step has its own timeout so a slow
Lighthouse run can't starve WHOIS.

---

## 4. Architecture

Four services, each with a single, narrow job.

```
┌──────────────────────────────────────────────────────────────┐
│                flyto-code    React 19 + Vite 8                │
│                (this repo — the war room frontend)            │
└──────────────────────────┬───────────────────────────────────┘
                           │ REST + WebSocket
┌──────────────────────────▼───────────────────────────────────┐
│                flyto-engine    Go 1.26 + PostgreSQL          │
│   Auth · Orgs · Scans · CVE · Discovery · Orchestrator       │
│   Source of truth for data. Owns aggregation, scoring,       │
│   lifecycle, and the closed-loop verify endpoint.            │
└──────┬──────────────────────────────────────┬───────────────┘
       │ spawn (subprocess)                   │ dispatch (HTTPS)
┌──────▼─────────────┐           ┌───────────▼─────────────────┐
│  flyto-indexer     │           │  flyto-cloud worker         │
│  Python + stdlib   │           │  (Playwright + Chrome)       │
│                    │           │                              │
│  SCA, SAST, taint, │           │  Executes flyto-ai-generated │
│  secrets, license, │           │  pentest YAML. Streams live  │
│  architecture,     │           │  frames. Reports verdicts    │
│  health scoring,   │           │  back to engine.             │
│  MCP server        │           │                              │
└────────────────────┘           └──────────────────────────────┘
```

### 4.1 flyto-engine (Go)

The authoritative backend. Single-source for every persisted fact:
users, orgs, repos, scans, findings, CVEs, discovery assets, workflow
executions. Every read and write goes through four domain interfaces
(`ResourceStore`, `WorkspaceStore`, `CodeStore`, `PlatformStore`) so
abstractions don't leak across bounded contexts.

Dashboard aggregations (avg score, grade distribution, critical/high
counts, top-5 risks, pagespeed averages, domain issue counts) are
computed here and returned as the `aggregated` field on the relevant
endpoints. The frontend never runs a `reduce()` or a mean.

The orchestrator service owns the closed-loop lifecycle: verify
dispatch, poll, status update, verdict persistence, and evidence URL
retention. Exponential backoff with jitter protects the cloud API
during recovery; panics in one discovery step cannot take out the
others.

### 4.2 flyto-indexer (Python)

A zero-external-dependency Python package that scans a checkout on disk
and emits a JSON profile. Doubles as an MCP server for AI tools (five
smart tools: `search`, `impact`, `audit`, `task`, `structure`). Eight
ecosystems supported (npm, pypi, Go, Rust, Maven/Gradle, PHP, Ruby,
Docker, plus `composer.lock`, `Cargo.lock`, Swift, Dart, .NET, Elixir).

Design rule: stdlib only. Features that need external APIs (CVE
databases, GitHub, embedding models) belong in flyto-engine, not here.
This keeps the scanner runnable offline, inside CI, inside an air-gapped
enterprise pipeline, with no transitive supply-chain surface.

### 4.3 flyto-ai + flyto-core (PyPI packages)

`flyto-ai` is the workflow generator. Given a finding shape
(`{category, source_file, source_line, sink_file, sink_line, severity}`)
it emits a YAML pentest workflow. `flyto-core` is the execution engine
that interprets the YAML — a Playwright browser automation DSL plus
deterministic verification primitives.

Deployment topology: both ship as PyPI packages and install into the
existing `flyto-cloud` Cloud Run service. The closed loop does not
require a new service — it adds two routes to an existing worker.

### 4.4 flyto-code (this repo)

React 19 + Vite 8. Strict TypeScript. Mantine v8 + Tailwind v4 (dark
only). Design tokens come from `@flyto/design-tokens`, shared with
flyto-cloud and flyto-cortex. Icons from `lucide-react` — no emoji.

Routing: Firebase Auth → `/projects` list → `/projects/{orgId}` war
room. GitHub OAuth token flows through Firebase; GitLab via authorization
code + PKCE (no implicit flow, no client secret on the client).

All cross-folder imports use path aliases (`@compounds/*`, `@hooks/*`,
`@lib/*`, `@layouts/*`). Same-folder imports use relative paths.

---

## 5. Why This Loop Is The Moat

Any individual capability on the application-security map is reproducible:
runtime protection, container scanning, reachability analysis — none of
these is a defensible primitive on its own. The defensible thing is what
sits between them: the loop that takes a static finding all the way to
verified exploitability and back.

The loop requires three capabilities and one cultural commitment:

| Capability | Where it lives |
|---|---|
| Static understanding of code (taint, call graph, API map) | flyto-indexer |
| Generation of a valid dynamic test from a static finding | flyto-ai |
| Real-browser execution with evidence capture | flyto-core + Playwright |
| An org-scoped data layer that owns the lifecycle | flyto-engine |

The cultural commitment: refuse to ship a finding without a path to
proof. That means no hardcoded default-category fallbacks, no "Run
discovery first" dead ends without a button, no scan triggers that
race each other. Every screen is either showing evidence or staging
the action that will produce evidence.

The commitment is harder to replicate than the capabilities. Most of
the industry rewards "number of findings surfaced"; the loop rewards
"number of findings resolved with proof." Different scoreboard, different
product shape.

---

## 6. Design Principles

### 6.1 Backend owns data processing

The frontend does not reduce, sum, average, sort for aggregation, or
compute grade distributions. Every number visible in the UI comes from
a server response. Violations of this rule have historically caused
drift (e.g. backend said F, frontend showed display score 610 in what
visually reads as C-grade territory); the codebase now has unit tests
(`TestGradeForBitsightBands`, `TestAggregateRepoHealth`) that lock the
invariant.

### 6.2 Unified scoring

Raw health scores are 0-100, computed by flyto-indexer's weighted
dimensions (security 40, complexity 25, docs 20, dead code 15, plus
secrets/taint/CVE penalties). Display scores are 250-900, floored to
10 (Bitsight convention). Grades map from *display* score:

- A ≥ 740 (raw ≥ 75)
- B ≥ 640 (raw ≥ 60)
- C ≥ 500 (raw ≥ 38)
- D ≥ 380 (raw ≥ 20)
- F < 380

Both `gradeFor(raw)` (engine) and `gradeFor(raw)` (frontend `types.ts`)
implement the same table. The engine always overwrites the indexer's
own grade field after CVE penalty is applied.

### 6.3 Server-enforced lifecycle

The user presses buttons. The server decides when those buttons do
something. Three examples:

- `POST /repos/{id}/scans` returns the existing scan (200 OK) if one
  is queued or running. It only creates a new scan (201) when the last
  scan is terminal.
- `handleConnectRepo` enqueues the first scan itself, not the frontend.
  Server owns the "on connect, start scanning" rule — the frontend is
  free to crash, retry, double-click, go offline, reload; the lifecycle
  holds.
- Pentest project creation triggers discovery. Discovery runs all 12
  passes in a parallel fan-out with per-step timeouts. Panics are
  isolated; no step can starve another.

### 6.4 i18n as a shipped product, not a side-car

Seventeen languages, ~12,800 keys each. Translations live in
`flyto-i18n/locales/` (source) and build into `flyto-i18n/dist/` (CDN
artifact). The frontend loads them dynamically via a manifest — zero
hardcoded locale lists, zero webpack-time imports. Adding a new
language is a JSON file + a manifest bump.

Missing-key warnings are emitted once per process in dev builds, never
in production.

### 6.5 Accessibility of failure

Every empty state in a scan-dependent tab carries an actionable
button, not a static error message. The WHOIS/WAF/SSL/tech-stack tabs
render a `DiscoveryEmptyState` with a **Run Discovery** button if the
project was created before those scanners existed, or if a previous
discovery pass timed out before reaching them.

### 6.6 Live updates, not polling

The engine runs an in-memory event hub (`liveevent.Hub`) with a
workspace-scoped subscription API. flyto-code opens exactly one SSE
connection per org session at `GET /api/v1/code/orgs/{id}/events` and
routes incoming events into React Query cache invalidations. No tab
in the UI sets a `refetchInterval` — the button that was spinning
stops when the server says it's done, not when a timer fires.

Event taxonomy:

- `scan.queued` / `scan.running` / `scan.complete` / `scan.failed`
- `discovery.started` / `discovery.step` / `discovery.complete` (one
  `step` per scanner: DNS, subdomains, SSL, WHOIS, WAF, …)
- `verify.dispatched` / `verify.terminal`

The frontend hook (`useOrgEvents`) is mounted once at `WorkspacePage`
root and is deliberately non-authoritative: it never reads or mutates
application state directly, only tells React Query that a cached
query is stale. If the connection drops, the library retries with
exponential backoff; when it reopens, the attached `fetch` callback
pulls a fresh Firebase ID token so sessions that span an hour don't
silently die.

### 6.7 Honest estimation over false precision

The AI Fix Plan (section 7) buckets remediation work by calendar week,
not by day or hour. An LLM can credibly say "this is a week-1 fix
before the others"; it cannot credibly say "this takes 3.5 days". The
product encodes that reality — week is the smallest unit of time on
the roadmap, and the server recomputes per-bucket and total effort
totals from the per-item integers so the visible math always holds.

---

## 7. AI Fix Plan

Findings without a plan are a backlog no one clears. Every repo in
the war room has a **Fix Plan** panel below the scan profile that
takes the current set of open findings and produces a week-bucketed
remediation roadmap:

```
Week 1 — Stop the bleeding         12h
  ⚠ CVE-2024-… in express@4.17      4h  ← critical path
  ⚠ Hardcoded secret in config.ts   2h
  ⚠ SQL injection at handler.go:142 6h
Week 2 — Harden defaults           8h
  △ Complex login() function        4h
  △ Dead-letter handler removal     4h
Week 3 — Cleanup                   6h
  · Missing LICENSE header          2h
  · README coverage                 4h
```

### 7.1 Generation flow

- **Input** — every `cve` / `sast` / `secret` / `complexity` /
  `dead_code` / `license` finding currently open for the repo, capped
  at 50 so the prompt fits comfortably inside the context window.
- **Prompt** — a tight template (no prose narration) that asks for a
  JSON document matching a fixed schema; related findings should
  group (same-package CVE bumps → one task), CRITICAL/HIGH prefers
  week 1, `effort_hours` is one of {2, 4, 8, 16}.
- **Output** — strict JSON. Code fences stripped defensively. Server
  recomputes the per-bucket and total hour sums — don't trust the
  LLM's own arithmetic.
- **Persistence** — the plan writes to `code_scan_results` under
  category `fix_plan` so a page reload doesn't re-spend LLM tokens.
  Re-generation cooldown is 30 minutes unless the user clicks
  **Regenerate** (force bypass).

### 7.2 Output rendering

One card per week, critical-path items get a red left-edge and show
their rationale on hover, total effort shown at the top. A one-click
**Export MD** copies a Markdown version to the clipboard for pasting
into Linear / Jira / Notion. No Gantt view — calendar weeks are the
right resolution; per-day timing is false precision.

### 7.3 What it isn't

- Not a ticket tracker. The plan is advisory; tickets live in Linear
  / Jira / GitHub Issues and carry dates, owners, SLAs.
- Not AutoFix. Opening a PR with the bump is Phase 2 (tracked in the
  roadmap); the plan's job is to tell you what to fix first and how
  those choices hang together.
- Not per-week effort budgeting. An engineer deciding what fits in a
  week has context the LLM doesn't (holidays, parallel features,
  incident response). The plan is a ranked backlog with bucket hints,
  not a commitment.

---

## 8. Feature Coverage

The full feature matrix is tracked in
[`docs/PRODUCT_ROADMAP.md`](./PRODUCT_ROADMAP.md). Summary:

| Category | Status |
|---|---|
| SCA (dependency scanning, 8 ecosystems) | Shipped |
| Secrets detection (18 patterns + git history) | Shipped |
| SAST (taint analysis, quality checks) | Shipped |
| License scanning + policy | Shipped |
| SBOM export | Shipped |
| Architecture maps + API classification | Shipped |
| Project health scoring (A-F, Bitsight-style) | Shipped |
| Closed-loop verify (staging pentest) | Shipped |
| Attack surface discovery (DNS, SSL, tech, WHOIS, WAF, PageSpeed) | Shipped |
| CVE checking (OSV API, partial-result awareness) | Shipped |
| Live updates (org-scoped SSE, zero polling) | Shipped |
| AI Fix Plan (week-bucketed remediation roadmap) | Shipped |
| Domain type auto-detection (URL prefix + tech stack) | Shipped |
| Container scanning | Planned (Phase 5) |
| IaC scanning | Planned (Phase 5) |
| CSPM (AWS/GCP/Azure) | Planned (Phase 5) |
| Runtime protection | Planned (Phase 4) |
| CI Gate + AutoFix PRs | Planned (Phase 2) |
| Compliance reports (SOC2 / ISO27001 / PCI) | Planned (Phase 6) |

---

## 9. Cloud Integration

Flyto Code pushes generated pentest workflows into Flyto Automation
(the `flyto-cloud` service) for scheduled execution. The sync is
flyto-code-authoritative: every scan regenerates the desired set of
`(folder, template)` rows and diffs them against the cloud state.
There is no webhook back into flyto-code; users editing a pushed
template in the cloud UI have forked it and the sync flags them as
diverged rather than overwriting.

Full contract in [`docs/cloud-integration.md`](./cloud-integration.md).

Binding design doc (engine side): [`flyto-engine/docs/flyto-code-sync.md`](../../flyto-engine/docs/flyto-code-sync.md).

---

## 10. Roadmap at a Glance

Seven phases. Phase 1 is current. Detailed tracker in
[`docs/PRODUCT_ROADMAP.md`](./PRODUCT_ROADMAP.md).

| Phase | Theme | Representative capability |
|---|---|---|
| 1 | Foundation | War room, OAuth, CTO dashboard, closed-loop verify |
| 2 | CI/CD integration | GitHub Actions, PR decoration, CI gate, AutoFix |
| 3 | DAST & Pentest at scale | Scheduled workflows, authenticated DAST, PDF reports |
| 4 | Runtime protection | Node / Python middleware, real-time attack dashboard |
| 5 | Cloud & infrastructure | CSPM, container scanning, IaC, ASM |
| 6 | Compliance & enterprise | SOC2 / ISO27001 / PCI reports, SSO/SAML, SLA |
| 7 | Endpoint | `flyto-guard` CLI, malware package database |

## 12. Trust Model & Scan Upload

Flyto Code is designed around **progressive trust**: users start with
zero trust (offline local scanning) and gradually share more data as
they gain confidence in the platform. At no level does the server see
source code — only analysis summaries, function names, and dependency
graphs.

Four trust levels: L0 (offline), L1 (upload summary), L2 (upload symbol
graph), L3 (CI automation). Full specification in
[`flyto-engine/docs/trust-model.md`](../../flyto-engine/docs/trust-model.md).

Most application-security platforms require a GitHub OAuth token (read
access to all repos) on day one. Flyto asks for nothing — users
`pip install flyto-indexer`, scan locally, and decide what to share.

---

## 13. Related Documents

| Doc | Purpose |
|---|---|
| [`docs/PRODUCT_ROADMAP.md`](./PRODUCT_ROADMAP.md) | Feature matrix, phase tracker, pricing sketch |
| [`docs/cloud-integration.md`](./cloud-integration.md) | Template sync contract with flyto-cloud |
| [`CLAUDE.md`](../CLAUDE.md) | AI-agent context (tech stack, paths, conventions) |
| [`flyto-engine/docs/trust-model.md`](../../flyto-engine/docs/trust-model.md) | Progressive trust model, 4 levels, data disclosure |
| [`flyto-engine/docs/scan-upload.md`](../../flyto-engine/docs/scan-upload.md) | Scan upload API, 3 modes, CI examples |
| [`flyto-indexer/integrations/flyto-engine.md`](../../flyto-indexer/integrations/flyto-engine.md) | Client-side export command, usage guide |
| [`flyto-engine/docs/flyto-code-sync.md`](../../flyto-engine/docs/flyto-code-sync.md) | Engine-side binding doc (source of truth) |
| [`flyto-engine/CLAUDE.md`](../../flyto-engine/CLAUDE.md) | Engine architecture and conventions |
| [`flyto-indexer/CLAUDE.md`](../../flyto-indexer/CLAUDE.md) | Scanner design, MCP tools, zero-dependency rule |

---

## 13. Glossary

- **War room** — the three-column workspace that is Flyto Code's
  primary UX.
- **Closed-loop verification** — the scan → generate-test → execute →
  verdict → display cycle that distinguishes Flyto Code from listing
  tools.
- **Bitsight-style scoring** — 250-900 display score with A-F grade
  bands, floored to 10 to avoid false precision.
- **Discovery** — the 12-pass attack-surface scan triggered on pentest
  project creation (DNS, subdomains, HTTP, DNS security, ports, API
  verify, PageSpeed, SSL, tech stack, WHOIS, WAF, IP intel).
- **Pentest-as-code** — YAML workflows, interpreted by flyto-core,
  version-controlled and peer-reviewable.
- **Server-enforced lifecycle** — the principle that user-visible
  state transitions (scan running, discovery in-flight, verify
  dispatched) are authoritative on the engine side, not the browser.
- **Fix Plan** — an AI-generated, week-bucketed remediation roadmap
  for a repo's open findings, cached server-side, exportable as
  Markdown. Not a Gantt and not a ticket tracker.
- **Live events** — the `scan.*` / `discovery.*` / `verify.*`
  publications on the org-scoped SSE stream that drive React Query
  invalidations so the UI never polls.
- **Event hub** — `liveevent.Hub` in the engine, a string-keyed pub/sub
  shared by workspace (cortex) and org (code) subscribers.
