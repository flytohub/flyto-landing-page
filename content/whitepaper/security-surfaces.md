# Nine Security Surfaces in Depth

**Version 0.1 · June 2026**

The Flyto2 security war room (戰情室) converges nine security surfaces into a
single operational picture and a single unified score. Each surface is
**independently usable** and **individually closed-loop** — you can run any one
of them on its own — but the structural value is that they share one execution
substrate, one evidence model, and one scoring lens, so they are worth more
together than apart.

This is also where the MSSP / BYO (bring-your-own) thesis lives. We don't
replace the security tools you already own. For each surface, you bring the
data and tools you already pay for, we ingest them, we supplement what you
lack, and then we run the correlation and scoring algorithms on the combined
picture — all the way through pentest, evidence collection, and red-team
simulation. We charge for the integration and the closed loop, not for
re-running an algorithm you already paid for.

The same deterministic engine that powers Flyto2's automation funnel
(flyto-core: 452 deterministic modules, MCP-native over stdio and
streamable-http, YAML recipes, evidence and replay, human-in-the-loop) is the
execution layer underneath every surface below. Automation is the *how*; the
war room is the *what and why*.

![Nine converged security surfaces folding into one unified 250–900 score — the scoring breakdown view](/whitepaper/shots/scoring.jpeg)

> Honest empty-state note: nothing in this paper reports a scan result. Every
> surface ships with a truthful "not yet scanned / insufficient data" state.
> Numbers appear only after *your* data is ingested and *your* scans run. We
> never fabricate findings, counts, or scores to fill a panel.

---

## 1. External Attack Surface / Exposure

**What it sees alone.** Continuous Threat Exposure Management (CTEM) over your
internet-facing footprint. The `/attack-surface` view enumerates discovered
domains, subdomains, hosts, ports, certificates, and tech stack;
`/external-posture` grades exposure (TLS, DNS security, headers, WAF presence);
and `/attack-paths` chains exposed assets into reachable routes an attacker
could walk. Discovery scanners run the multi-pass sweep (DNS, subdomains, HTTP,
DNS security, ports, API verify, SSL, tech stack, WHOIS, WAF) against a target.

**BYO ingest.** Bring your existing EASM or security-rating feed, your domain
inventory, or a CSV of known assets. We ingest them as confirmed assets rather
than re-discovering from zero, and reconcile them against what discovery finds.

**How it closes the loop.** Exposed assets aren't a static list — confirmed,
internet-facing exposures become candidate attack-path links and feed pentest
target selection, so "exposed" is verified against "exploitable," not assumed.

**Unified scoring.** Exposure is a first-class scoring vector
(internet-facing, unpatched, reachable items penalized; internal-only
discounted). See [Attack Surface & Exposure](/warroom/surfaces/attack-surface).

---

## 2. Code Intelligence + Code Red-Team

**What it sees alone.** flyto-indexer parses your repositories into an
architecture map (`/arch-map`), API graph, call graph, and health scoring —
the same parse that produces security findings. `/issues` is the unified
finding ledger (SCA, SAST, secrets, IaC, license). `/pentests` drives
verification, and `/autofix` proposes remediation tied to a specific finding.

**BYO ingest.** Bring your existing SAST/SCA/secret-scanner output. We ingest
findings into the same ledger rather than asking you to abandon a scanner you
trust, then deduplicate and re-rank them against reachability evidence.

**How it closes the loop.** A finding starts at L0 (scanner-detected) and is
promoted only by evidence — static reachability (import graph, taint flow,
function-level CVE reachability) to L1, dynamic confirmation to L2. Code
red-team turns a confirmed-reachable finding into an exploitation attempt.

**Unified scoring.** Code is the largest scoring vector, weighted by
confidence level so exploitable beats theoretical. See
[Code Intelligence & Red-Team](/warroom/surfaces/code-intelligence) and the
[closed-loop](/warroom/closed-loop) doc.

---

## 3. MCP Security

**What it sees alone.** As an MCP-native platform, Flyto2 treats Model Context
Protocol servers as first-class attack surface. The `/mcp` view inventories
MCP servers, their exposed tools, and their auth posture; runtime-events
capture what those tools actually do at execution time; and policy simulation
lets you dry-run a tool-invocation policy before enforcing it.

**BYO ingest.** Bring your MCP server registry and tool manifests. We ingest
declared tools and bind/auth configuration and compare declared intent against
observed runtime behavior.

**How it closes the loop.** Policy simulation answers "would this call be
allowed?" without executing it; runtime-events answer "what was actually
called?" The gap between the two is the finding, and it feeds back into policy.

**Unified scoring.** MCP exposure (unauthenticated bind, over-broad tool
grants) contributes to the operational-diligence and exposure vectors. See
[MCP Security](/warroom/surfaces/mcp-security).

---

## 4. Container / Runtime + Cloud Identity

**What it sees alone.** `/container-posture` evaluates image and runtime
configuration (privileged containers, exposed sockets, drift from baseline).
`/cloud` covers cloud posture and the identity graph — roles, trust
relationships, and over-privileged principals that turn one foothold into
lateral movement.

**BYO ingest.** Bring your CSPM/CNAPP export, your cloud asset inventory, or
IAM role dumps. We ingest them as the authoritative posture snapshot and layer
correlation on top rather than re-scanning the account from scratch.

**How it closes the loop.** Runtime posture and identity are joined to
exposure and attack paths — an over-privileged identity attached to an
internet-facing workload is a path, not two unrelated findings.

**Unified scoring.** Runtime and identity findings feed the container/cloud
sub-vectors and amplify attack-path scoring. See
[Container, Runtime & Cloud Identity](/warroom/surfaces/runtime-cloud).

---

## 5. Darkweb / Threat Intel

**What it sees alone.** `/threat-intel` aggregates external threat signal;
`/leak-exposure` surfaces credential and data leaks tied to your domains and
brands; `/ioc` is the indicator ledger; and `/sensor-map` shows where signal
is being collected. Together they back brand-protection monitoring.

**BYO ingest.** Bring your existing darkweb feed, leak-monitoring
subscription, or IOC lists. We ingest your feed as-is — this is the canonical
BYO case — and correlate it against your own asset and identity graph instead
of charging you to re-run a feed you already pay for.

**How it closes the loop.** A leaked credential is matched to a real identity
or asset; an IOC is matched to observed runtime/MCP events; brand-abuse
signals are matched to discovered look-alike domains.

**Unified scoring.** Confirmed exposure (matched leak, active IOC) penalizes
the score; unmatched noise does not. See
[Darkweb & Threat Intel](/warroom/surfaces/darkweb-threat-intel).

---

## 6. Footprint / Attribution

**What it sees alone.** The footprint graph (`/footprint/graph`) builds the
attribution picture — which domains, IPs, organizations, and infrastructure
actually belong to you, and with what confidence. Attribution is treated as
evidence-bearing, not a guess: ownership is asserted only when corroborated.

**BYO ingest.** Bring your known-good asset list, ASN allocations, or
registrar exports. We ingest them as high-confidence ownership anchors that
seed and constrain graph expansion.

**How it closes the loop.** A footprint run terminates in a finalized,
evidence-backed graph — the `footprint.run.finalized` event marks the moment
the attribution picture is settled and downstream surfaces (asset map,
exposure, pentest) may consume it as ground truth.

**Unified scoring.** Attribution confidence gates whether an exposure is
*yours* before it can penalize *your* score, preventing borrowed-infrastructure
false positives. See [Footprint & Attribution](/warroom/surfaces/footprint).

---

## 7. Asset Map

**What it sees alone.** `/asset-map` is the canonical inventory — the single
reconciled view of every domain, host, repo, container, cloud resource, and
identity the platform knows about, built by the asset-map-kernel from the
finalized footprint and discovery output.

**BYO ingest.** Bring your CMDB, spreadsheet, or asset API. We merge it into
the kernel's reconciled model with ownership gating, so imported assets are
deduplicated against discovered ones rather than double-counted.

**How it closes the loop.** Ownership gating is the closure mechanism: an asset
must clear an ownership/attribution gate before it is treated as in-scope for
scanning, scoring, or pentest. The first thing a user does on entry is
integrate every asset they already have — this surface is that integration
step.

**Unified scoring.** The asset map defines the denominator for every other
surface; coverage gaps are surfaced honestly rather than hidden. See
[Asset Map](/warroom/surfaces/asset-map).

---

## 8. Pentest

**What it sees alone.** `/pentests` turns findings and exposed assets into
executable verification. A footprint-to-pentest-target recipe selects targets
from the finalized attribution graph, and each pentest produces evidence —
request/response captures, replayable steps, and a verdict
(`exploitable` / `sanitized` / `unreachable`).

**BYO ingest.** Bring prior pentest reports or a target scope. We ingest scope
and known findings so the engine verifies rather than re-discovers, and we
capture evidence in the same replayable format regardless of origin.

**How it closes the loop.** Pentest is the verification stage of the whole
machine: it promotes a finding to L2 (confirmed exploitable) with evidence, or
it demotes it. The deterministic engine and YAML recipes that run automation
are literally what executes the pentest and records the evidence.

**Unified scoring.** A confirmed-exploitable pentest result is the heaviest
penalty in the model, because it is the strongest evidence. See
[Pentest](/warroom/surfaces/pentest).

---

## 9. Red-Team Simulation

**What it sees alone.** Red-team campaigns chain confirmed findings, exposed
assets, attack paths, and identities into a simulated adversary run. A
`campaign_execution` drives multi-step scenarios via red-team recipes, with
each step producing evidence so the narrative is reconstructable, not asserted.

**BYO ingest.** Bring your own playbooks, MITRE ATT&CK mappings, or prior
red-team scope. We ingest them as campaign templates and execute them on the
same substrate that runs automation and pentest.

**How it closes the loop.** A campaign tests whether independently-confirmed
findings actually compose into an end-to-end intrusion — closing the loop from
exposure all the way to demonstrated impact, with evidence at each hop.

**Unified scoring.** A successful simulated path validates (or invalidates) the
attack-path scoring assumptions, feeding back as the highest-confidence signal
of real-world risk. See [Red-Team Simulation](/warroom/surfaces/red-team) and
the [red-team](/warroom/red-team) doc.

---

## How the Nine Become One

Each surface stands on its own, but the platform's job is the join. Footprint
and the asset map establish *what is yours*; exposure, code, MCP, runtime, and
darkweb establish *what is wrong*; pentest and red-team establish *what is
actually exploitable*. The unified score
([scoring methodology](/warroom/scoring-methodology),
[score events](/warroom/score-events)) is a single number computed from these
sub-vectors, weighted by evidence level — exploitable and reachable beat
theoretical, confirmed-yours beats borrowed, matched beats noise.

That join is the product. Bringing your own tools into the loop
([integrations](/warroom/integrations),
[closed-loop verify](/warroom/closed-loop)) is the MSSP model: integrate every
asset and tool you already have, ingest external data, run the algorithms on
the combined picture, and drive it through pentest, evidence collection, and
red-team — one big closed loop, in one war room.

For the broader product context, see the war-room
[overview](/warroom/overview), [getting started](/warroom/getting-started),
and [product tour](/warroom/product-tour). The same engine powers the
automation funnel described in the platform
[audit whitepaper](/whitepaper/audit) — the war room is built *on* it, not
beside it.
