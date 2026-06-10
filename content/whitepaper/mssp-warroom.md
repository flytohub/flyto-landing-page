---
title: "The MSSP War-Room: Nine Surfaces, One Closed Loop"
description: "How Flyto2's 戰情室 converges nine independently-usable, individually-closed-loop security surfaces into a single 250-900 unified score and one operational picture — and why the MSSP/BYO integration model, not breadth, is the differentiator."
---

# The MSSP War-Room: Nine Surfaces, One Closed Loop

![Flyto2 MSSP war-room dashboard — unified posture score, cross-dimensional integration and the Asset City overview](/whitepaper/shots/dashboard-warroom.jpeg)

A dashboard shows lists of findings with counts above each list. A
**war-room** (戰情室) does something different: it joins independent
signals on one screen so an operator can decide and act. NORAD, a
Bloomberg terminal, a SOC wall — they aggregate many feeds not for
breadth's sake but so the join between feeds becomes the product. A
war-room with one dimension is a dashboard. A war-room without
integration is a dashboard graveyard.

Flyto2's security line — **flyto-code** (the React war-room frontend)
backed by **flyto-engine** (the Go authoritative backend) — is built on
one bet: every security question is answered better when you can join
across dimensions. *Is this CVE reachable? Is it exposed to the
internet? Is a developer editing that exact file right now? Should this
PR be blocked?* No single-pillar tool can answer those, because each
sees only one side. This paper defines the war-room, walks the nine
surfaces, and explains why they are worth more together than apart — and
why the way we sell them, the MSSP/BYO integration model, is the real
differentiator.

---

## The MSSP / BYO thesis — what we actually charge for

We don't replace what you already own. We integrate it.

If you already pay for an external-security rating, a darkweb feed, or a
code scanner, you don't re-buy a platform. You **bring your data, we
ingest it**; whatever you lack, **we supplement**; then **we run the
correlation and scoring algorithms on the combined picture** — all the
way through pentest → evidence collection → red-team simulation, unified
in one war-room. The first thing a user does on entry is integrate every
asset and tool they already have, then ingest external data, then run
the algorithms. **One big closed loop.** We charge for the integration
and the closed loop — not for re-running an algorithm a customer already
paid for. That is what being an MSSP actually means, and it is the
structural reason the nine surfaces are worth more together than apart.

This is reflected in the product's deployment modes. The unified score
runs **external-only** (you brought domains, no repos), **internal-only**
(you brought repos, no domains), or **combined** (both). Either customer
type sees a complete, standalone product — never a half-empty dashboard
waiting for the other dimension. Only in **combined** mode does the
cross-dimensional join light up, and that join is the part nobody else
can sell you, because nobody else has both halves on one substrate.

For the operator's walkthrough see the
[war-room MSSP overview](https://docs.flyto2.com/warroom/overview) and
the step-by-step [BYO integration guide](https://docs.flyto2.com/warroom/integrations).

---

## Nine surfaces, each independently usable and individually closed-loop

The war-room converges nine surfaces. Two properties hold for every one
of them: each **stands alone** (you can buy and run it without the other
eight), and each **closes its own loop** (it doesn't dead-end at a
finding — it carries that finding toward proof or remediation).

Each surface below is grounded in the platform-loop registry — its real
API routes, React Query keys, live-event topics, and YAML recipes — so
nothing here is aspirational.

### 1. External attack surface / exposure (CTEM)

Continuous discovery of your internet-facing perimeter, scored as
Continuous Threat Exposure Management. Discovery runs a multi-pass
fan-out per domain and subdomain (DNS, subdomains, TLS, headers, ports,
WHOIS, WAF, tech stack, email security, sensitive files) with per-step
timeouts so a slow Lighthouse pass can't starve WHOIS.

- **API**: `/external-posture`, `/findings`, `/attack-paths`,
  `/mitigations`, `/vendors`, `/attack-surface`
- **Query keys**: `external-posture`, `findings`, `attack-paths`,
  `mitigations`, `vendors`
- **Events**: `discovery.changes`, `discovery.complete`,
  `footprint.run.finalized`
- **Recipes**: `ctem-finding-loop.yaml`,
  `domain-scan-evidence-refresh.yaml`

The loop closes when a discovered exposure becomes a prioritized
mitigation with an SLA clock, not just a row in a list.

### 2. Code intelligence + code red-team

The same parse that finds CVEs also produces architecture maps, API
graphs, call graphs, taint flows, and health scoring — one parse, two
products. Findings then drive **AutoFix** (Tier 1 deterministic
transforms, Tier 2 AI-proposed patches via PR) and **closed-loop
verify**, which generates a YAML pentest workflow per security-relevant
finding and runs it against staging in a real browser.

- **API**: `/issues`, `/pentests`, `/arch-map`, `/autofix/findings`,
  `/autofix/runs`, `/findings/${fingerprint}/verify`
- **Query keys**: `issues`, `pentests`, `arch-map`, `autofix-findings`
- **Events**: `scan.complete`, `verify.terminal`,
  `campaign_execution.updated`
- **Recipes**: `footprint-to-pentest-target.yaml`,
  `pentest-campaign-dryrun.yaml`

Findings promote through confidence levels — L0 (scanner-detected) → L1
(corroborated by import graph / taint reachability) → L2 (confirmed
exploitable by a live probe), or get excluded as unreachable. See
[closed-loop verify](https://docs.flyto2.com/warroom/closed-loop).

### 3. MCP security

The same Model Context Protocol surface that powers AI-IDE integration
becomes an attack surface to govern: tool registries, runtime events,
and policy simulation for MCP servers exposed in your environment.

- **API**: `/mcp`, `/runtime-events`
- **Query keys**: `mcp-overview`, `runtime-events`
- **Events**: `activity.logged`
- **Recipes**: `runtime-mcp-policy-simulate.yaml`

### 4. Container / runtime + cloud identity

Container posture and image findings join with runtime events and cloud
identity posture, so a vulnerable image is scored in the context of
where it runs and what it can assume.

- **API**: `/container-posture`, `/container-findings`, `/cloud`,
  `/runtime-events`
- **Query keys**: `container-posture`, `container-findings`,
  `cloud-posture`
- **Events**: `scan.complete`, `activity.logged`
- **Recipes**: `containers-vuln-loop.yaml`

### 5. Darkweb / threat intel

Threat-actor and malware-family context (mapped to MITRE ATT&CK),
ransomware incidents, leaked-credential exposure, IoC lookup, a sensor
map, and brand-protection monitoring — ingested as another feed you can
bring or we supplement.

- **API**: `/threat-intel`, `/leak-exposure`, `/ioc`, `/sensor-map`
- **Query keys**: `leak-exposure`, `threat-actors`, `ioc-lookup`,
  `sensor-map`, `brand-manager-attack-surface`
- **Events**: `footprint.run.finalized`
- **Recipes**: `darkweb-to-footprint-seed.yaml`,
  `darkweb-sensor-brand-loop.yaml`

The loop closes by seeding footprint and exposure — a leaked credential
becomes a discovery seed, not an inert alert.

### 6. Footprint / attribution

Graph-based attribution that ties scattered assets, domains, and
identities back to an owner — the connective tissue between darkweb
seeds and the asset map.

- **API**: `/footprint/graph`, `/dashboard`, `/pulse`
- **Query keys**: `footprint-graph`, `pulse`
- **Events**: `footprint.run.finalized`, `scan.complete`
- **Recipes**: `footprint-full-loop.yaml`, `overview-pulse-smoke.yaml`

### 7. Asset map

The canonical inventory of repos, domains, and discovered assets, each
carrying its own evidence trail so every node on the map is traceable to
the scan that found it.

- **API**: `/repos`, `/attack-surface`, `/asset-map`
- **Query keys**: `repos`, `attack-surface`, `asset-map-kernel`,
  `asset-evidence`
- **Events**: `discovery.complete`, `pipeline.progress`
- **Recipes**: `asset-map-smoke.yaml`,
  `domain-scan-evidence-refresh.yaml`

### 8. Pentest

Pentest projects target discovered assets and verify findings against a
configured staging URL with acknowledged consent. Adding a domain
auto-triggers the discovery fan-out; the click to run a dynamic probe is
the consent gate — it is never auto-fired.

- **API**: `/pentests`, `/findings/${fingerprint}/verify`
- **Query keys**: `pentests`
- **Events**: `verify.terminal`, `campaign_execution.updated`
- **Recipes**: `footprint-to-pentest-target.yaml`

### 9. Red-team simulation

A budget-aware 5-phase campaign — **Baseline → Probe → Verify → Recheck
→ Report** — that actively probes the attack surface, attempts
exploitation, and confirms whether vulnerabilities are real, with
evidence captured at every phase. See the
[red-team pipeline](https://docs.flyto2.com/warroom/red-team).

- **API**: `/pentests`, `/findings/${fingerprint}/verify`
- **Events**: `campaign_execution.updated`, `verify.terminal`
- **Recipes**: `pentest-campaign-dryrun.yaml`

---

## One unified score, one operational picture

Nine surfaces would be nine dashboards if their outputs didn't converge.
They converge on a single number.

The unified score runs on a **250-900 display band** with **A-F letter
grades** (Bitsight-style, floored to avoid false precision), computed
from a 0-100 raw score. It penalizes what matters — exploitable,
internet-facing, unpatched, reachable — and discounts what doesn't —
unreachable code, excluded false positives, internal-only libraries.

- **API**: `/score`, `/score-events`, `/compliance`, `/audit`
- **Query keys**: `computed-score`, `unified-score-history`,
  `org-compliance`
- **Events**: `scan.complete`, `discovery.complete`
- **Recipes**: `score-refresh-loop.yaml`, `compliance-export.yaml`

Two engineering invariants make the score trustworthy. First, **all
aggregation lives in the engine** — the frontend never runs a `reduce()`
or computes a mean, so the same repo can't read 70 here, B there, and
640 somewhere else. Second, **weight redistribution handles missing
categories**: when a customer brought only domains, attack-surface
weight redistributes to the active categories instead of dragging the
score down for a dimension they never bought. Cross-dimensional
modifiers are gated off entirely unless the counterpart dimension is
present. See the
[scoring methodology](https://docs.flyto2.com/warroom/scoring-methodology)
and [score events](https://docs.flyto2.com/warroom/score-events).

---

## Why the war-room beats nine tools: cross-dimensional correlation

Any single capability on this map is reproducible. Runtime protection,
container scanning, reachability analysis, darkweb feeds — none is a
defensible primitive on its own. The defensible thing sits *between*
them: the join.

A single-pillar tool surfaces a finding as `severity + title +
file:line + status`. The war-room surfaces the same finding as:

> SQL injection in `api/handlers_pipeline.go:472` — reachable through a
> public API route · taint flow (sqli) · open PR #128 (draft) touches
> this file · AutoFix Tier 2 ready · pentest verified exploitable ·
> blast radius 75

Same row of data; several times the decision quality. That join is
computed once in `flyto-engine/internal/correlate` — packaging
`open_prs_touching`, `taint_adjacency`, `autofix_eligible`,
`pentest_verdict`, and a deterministic `blast_radius` (0-100) — and
exposed through an `?enrich=true` convention on the list endpoints plus a
top-level **Pulse** feed that ranks the whole org's findings by composite
blast radius. The combined mode answers the question no single-pillar
competitor can: *your code CVE is reachable AND exposed to the internet
AND has an open PR touching it.* See
[closed-loop](https://docs.flyto2.com/warroom/closed-loop) and
[pulse](https://docs.flyto2.com/warroom/pulse).

---

## The automation engine is the execution layer beneath the war-room

The war-room is the *what and why*. The automation engine is the *how*.

Flyto2's two product lines ride the same execution substrate.
**flyto-core** — 412+ deterministic modules, MCP-native over stdio and
streamable-http, with evidence capture, replay, YAML recipes, and
human-in-the-loop control — is the established automation funnel
(a Zapier/n8n/Make alternative). It is *also* the literal execution
layer that runs the war-room.

When closed-loop verify generates a pentest workflow, that workflow is a
**YAML recipe** interpreted by flyto-core's deterministic modules, driven
through a real headless browser, with every step traced and every
artifact retained as **evidence**. The same replay primitive that lets an
automation engineer re-run a failed step from any point lets a security
analyst replay an exploitation attempt and inspect exactly what proved
the verdict. The recipes named against each surface above —
`ctem-finding-loop.yaml`, `containers-vuln-loop.yaml`,
`pentest-campaign-dryrun.yaml`, `score-refresh-loop.yaml` — are real
recipes executed by the same engine, which is why scans, evidence
collection, and red-team simulation share one deterministic, replayable,
auditable runtime.

This is the structural payoff of the MSSP/BYO model. Because every
surface's loop is a recipe over a shared engine, *bringing* a customer's
existing tool is just adding an ingest step, and *supplementing* what
they lack is just adding a module — not a bespoke connector project, but
the substrate doing what it already does for automation, pointed at
security.

---

## Summary

Nine surfaces — external attack surface/exposure, code intelligence +
code red-team, MCP security, container/runtime + cloud identity,
darkweb, footprint/attribution, asset map, pentest, and red-team
simulation. Each stands alone and closes its own loop. Together, under
one engine, they produce a single 250-900 unified score and one
operational picture, with cross-dimensional correlation as the part no
single-pillar tool can replicate. We charge for the integration and the
closed loop — bring your data, we supplement the gaps, we run the
algorithms on the combined picture, all the way through pentest,
evidence, and red-team. That is what an MSSP is.

**Read next:** the
[war-room MSSP overview](https://docs.flyto2.com/warroom/overview) ·
the [BYO integration guide](https://docs.flyto2.com/warroom/integrations) ·
[closed-loop verify](https://docs.flyto2.com/warroom/closed-loop) ·
[scoring methodology](https://docs.flyto2.com/warroom/scoring-methodology).
