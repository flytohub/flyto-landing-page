# Bring Your Own Stack: The Integration MSSP Model

**Flyto2 Warroom · BYO Integration Thesis**

We don't replace what you have. We integrate it.

Most security platforms sell you a wall: rip out your scanners, drop your
threat feed, re-buy your external rating under one logo, and pay again for
algorithms you already pay for. That is the wrong economic model, and it is
the wrong technical model. Flyto2 Warroom is built on the opposite premise.
An MSSP's job is not to re-run an algorithm you already bought — it is to
**integrate every signal you already own, supplement what you lack, and close
the loop** from discovery through pentest, evidence collection, and red-team
simulation, all in one war-room.

![Bring-your-own integration in action — the recon→pentest→red-team bridge promoting your existing assets into evidence](/whitepaper/shots/pentest.jpeg)

---

## 1. The Economic Thesis

Security spend is already fragmented across tools you have purchased
deliberately: an external attack-surface or security-rating product, a
darkweb / breach-intelligence feed, a container scanner, a SAST/SCA stack,
a cloud-identity posture tool. Each one produces real signal. Each one also
produces a *partial* picture, in its own console, on its own pricing, with
its own scoring that never talks to the others.

The conventional platform answer is consolidation-by-replacement: buy ours,
turn yours off. The problem is that you don't actually want to throw away a
data source you trust — you want it correlated with everything else. The value
that is missing is **not another scanner**. It is the *join*: the correlation
and scoring across all sources, and the closed loop that carries a finding all
the way to a verified, exploited-and-evidenced conclusion.

So that is what we charge for.

> **Pricing principle.** We charge for **integration and the closed loop**, not
> for re-running an algorithm you already bought. If you already pay for a
> darkweb feed, bring it — we ingest it, we don't resell it back to you. If you
> already pay for an external rating, bring it — we correlate it into one
> unified score, we don't bill you a second time to recompute it. The fee is
> for the war-room that makes nine surfaces worth more together than apart.

This is the structural reason the nine Warroom surfaces — external attack
surface, code intelligence + code red-team, MCP security, container/runtime +
cloud identity, darkweb/threat-intel, footprint/attribution, asset map,
pentest, and red-team simulation — are each independently usable yet far more
valuable converged. Each closes its own loop; the platform closes the loop
*across* them.

---

## 2. The Entry Flow

The first thing a user does on entry is not "start a scan." It is **integrate
everything you already have.** The onboarding flow is a deliberate sequence:

| Step | Action | What it grounds |
|------|--------|-----------------|
| 1 | **Integrate your assets and tools** | Connect source control, registries, cloud, and existing scanners |
| 2 | **Ingest external data and feeds** | Pull in the threat-intel, darkweb, and rating data you already pay for |
| 3 | **Supplement what you lack** | Flyto2 fills the gaps with its own discovery and modules |
| 4 | **Run correlation + scoring** | One unified score over the combined picture |
| 5 | **Drive the closed loop** | Pentest → evidence collection → red-team simulation |

Steps 1–3 build the *picture*. Steps 4–5 are the *value* — the correlation and
the loop that no single one of your existing tools can run on its own, because
no single one of them has all the data.

---

## 3. Step 1 — Integrate Every Asset and Tool You Already Own

Integration is grounded in real connectors, not promises. See
[warroom/integrations](/warroom/integrations) for the connector reference;
this section walks the operational shape.

**Source control (GitHub / GitLab).** GitHub connects via OAuth App
authorization (`repo`, `read:org`) or, for centralized control, an
**org-proxy**: an org admin authorizes Flyto2 once for the whole organization,
individual developers do not re-authorize, and repo access is scoped to the
repositories selected during the GitHub App installation. GitLab connects via
OAuth 2.0 with PKCE (`read_api`, `read_repository`, `read_user`) against both
GitLab.com and self-managed instances. Once connected, repositories feed the
code-intelligence surface and PRs are decorated with check runs, summary
comments, and line-level annotations.

**Container scanners.** Bring your container pipeline. Trivy-based scanning
ingests Docker-image OS-package CVEs, normalizes them into the standard
finding format, and routes them into the container/runtime surface where they
contribute to the Code Security score. A Dockerfile in the repo or a configured
image reference is enough to start.

**CI/CD.** Three trigger types cover any pipeline shape — **webhook**
(push / PR), **upload** (CI runs flyto-indexer locally and posts results),
and **API** (on-demand from any system). A CI gate evaluates results against
policy and can fail the build. This is integration into *your* workflow, not a
parallel one.

---

## 4. Step 2 — Ingest External Data and Feeds You Already Pay For

This is the heart of "bring your own." Concretely:

**Bring your own threat-intel / darkweb.** Flyto2 ingests external threat
intelligence from multiple sources — Shodan InternetDB (IP/port intel, known
CVEs), URLhaus (malicious URL hosting), Feodo Tracker (C2 indicators),
ThreatFox (IOCs), and HIBP (breach exposure for domain emails). Indicators are
fetched on schedule, matched against your active domains, and converted into
findings that flow into the discovery pipeline and recompute the relevant
sub-vectors. If you already run a darkweb or breach feed of your own, the same
ingestion path applies: the feed becomes another correlated source against your
asset map, not a separate dashboard you have to check by hand. Operationally,
"bring your own darkweb" means your indicators land in the *same* correlation
engine as everything else and contribute to the *same* unified score.

**Bring your own external-rating tool.** An external security-rating or
attack-surface product is, operationally, a stream of scored exposures about
domains and IPs you own. Ingested into the war-room, that stream is correlated
against the footprint/attribution and asset surfaces — so a rating signal can
be tied back to a *specific* discovered host, cross-checked against your own
attack-surface findings, and folded into one number rather than living as a
second, disconnected score. You stop paying us to recompute a rating you
already bought; you start paying for the correlation that makes it actionable.

**MCP-native ingestion.** The flyto-indexer MCP server lets AI agents (Claude
Code, Cursor, and other MCP clients) query code intelligence — code search,
dependency graph, vulnerability context, taint analysis — directly inside the
development workflow, so the integration reaches all the way into the IDE.

---

## 5. Step 3 — Supplement What You Lack

No customer arrives with all nine surfaces covered. Wherever you have a gap,
Flyto2's own deterministic modules and discovery fill it: external
attack-surface discovery where you have no rating tool, code red-team where you
only had SAST, MCP-security and cloud-identity coverage where you had none.
Supplementation is additive — it never overwrites a source you trust; it only
extends the combined picture so the correlation in Step 4 runs over a *complete*
input set.

---

## 6. Step 4 — Run Correlation and Scoring on the Combined Picture

Once your data, your feeds, and our supplements are in one place, the war-room
runs the algorithms you were actually missing: cross-surface correlation and a
single unified score. A finding is no longer "a CVE in a scanner" — it is a CVE
on a host that your asset map confirms you own, that your darkweb feed shows is
exposed, that your rating flagged, all resolving to one prioritized,
exploitable-today conclusion. This is the join no single source could compute,
because no single source held all the inputs.

---

## 7. Step 5 — Drive Through Pentest → Evidence → Red-Team

The same deterministic engine that powers Flyto2's automation line —
[flyto-core](/warroom/flyto-code)'s modules, YAML recipes, and evidence/replay —
is the execution layer that drives the loop: pentest steps run as recipes,
evidence is captured and replayable, and validated paths feed red-team
simulation. Automation is the **how**; the war-room is the **what and why**.
The closed loop ends in a verified, evidenced result, not a backlog of
unverified alerts.

---

## 8. Operating the Integration: operations / admin

Integration is only trustworthy if you can see its health and govern its
scope. The operations / admin surface provides exactly that:

- **Integration health.** Connector status and feed freshness are surfaced so
  a stale GitHub App installation, a disabled webhook (auto-disabled after
  repeated delivery failures, with admin notified), or a lagging threat feed is
  visible rather than silent.
- **Scope and events.** Event scoping lets you see and constrain which
  organizations, repositories, and surfaces an integration touches — the same
  org-proxy installation scoping that governs repo access at connect time
  carries through to runtime.
- **API keys.** Keys are scoped to an organization and can be restricted to
  specific endpoint groups, created and managed in the Warroom UI under
  Settings → API Keys, and used as `X-API-Key` for upload, CI-gate, and direct
  API ingestion. Rate limits are enforced per key.

Governance is part of the product, because in an MSSP model your sources are
*your* sources — you must be able to audit what was ingested, from where, and
under what scope.

---

## 9. Why This Is What an MSSP Actually Means

An MSSP is not a reseller of nine point tools. It is the party that takes
everything an organization already owns, supplements the gaps, runs the
correlation and scoring across the combined picture, and carries findings
through to evidenced, red-teamed conclusions — in one operational war-room.
That is the integration thesis, and it is the reason the loop is worth more
than the sum of its surfaces.

You keep your stack. We integrate it, supplement it, score it, and close the
loop on it.

---

## Related Reading

- [warroom/byo-integration](/warroom/byo-integration) — BYO integration model in the product docs
- [warroom/integrations](/warroom/integrations) — connector reference (GitHub OAuth / org-proxy, GitLab PKCE, Trivy, threat feeds, CI/CD, MCP)
- [warroom/closed-loop](/warroom/closed-loop) — how each surface closes its loop
- [warroom/scoring-methodology](/warroom/scoring-methodology) — the unified score and sub-vectors
- [warroom/flyto-code](/warroom/flyto-code) — the engine and recipes behind the loop
