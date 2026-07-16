# Agent instructions

This repo ships the public `flyto2.com` product surface.

Before changing behavior, read:

- `PROJECT.md`
- `ARCHITECTURE.md`
- `STATE.md`
- `DECISIONS.md`
- `/Users/chester/flytohub/CODEX_HANDOFF_FLYTO_AUDIT.md`

Rules:

- Do not write credentials, API keys, session tokens, or customer data into this
  repo.
- Preserve the SEO/AEO/GEO contract: `robots.txt`, `llms.txt`, `llms-full.txt`,
  canonical metadata, static content, and sitemap changes must be reviewed
  together.
- Use flyto-indexer search and impact, or repo search when the indexer is not
  available, for pre-change exploration before changing route, metadata,
  sitemap, robots, or AI-readable files so public-surface drift is checked in
  context.
- After public-surface changes, run the relevant verification loop:
  `npm run audit:geo`, `npm run typecheck`, and `npm run build`.
- Before release, run `npm run verify` when dependencies are available.
- Treat that as required post-change verification; document any skipped check in
  the handoff.
- Do not make unsupported security, benchmark, or competitor-replacement claims.
- Keep Flyto2 Cloud / Apps / Automation visible as a first-class product line,
  not a side page under security.
- Public security pages must keep consent, evidence, audit, and tenant-isolation
  language precise.
- Run `npm run typecheck` and `npm run build` before release changes when
  dependencies are available.

## Flyto2 Project Memory Contract

Every Flyto2 repository must keep this project-memory scaffold current:

- `AGENTS.md`: agent operating rules, repo-specific constraints, verification commands.
- `CLAUDE.md`: Claude-facing handoff rules when this repo is edited outside Codex.
- `PROJECT.md`: product purpose, owned surfaces, users, and non-goals.
- `ARCHITECTURE.md`: module boundaries, runtime shape, data flow, and integration points.
- `STATE.md`: current status, known risks, release/deploy state, and last verification.
- `ROADMAP.md`: near-term, later, and explicitly out-of-scope work.
- `tasks.md`: actionable checklist with owners/status when known.
- `DECISIONS.md`: durable architectural/product decisions with dates and rationale.
- `CHANGELOG.md`: user-visible or operator-visible changes.
- `docs/README.md`: index for durable docs in this repo.
- `workflows/*.md`: repeatable agent workflows for idea capture, planning, implementation, bugfix, refactor, investigation, and wrap-up.
- `handoffs/_registry.md`: index of handoffs; new handoffs use `YYYY-MM-DD-topic.md`.

When changing behavior, public copy, deployment, security posture, or frontend UX, update the relevant memory files in the same change. Do not leave stale brand, email, module count, route, or deployment information behind.

## Flyto2 Frontend Quality Gate

Any frontend, website, dashboard, extension webview, app screen, or generated UI in this repository must avoid these eight failures:

1. Ignoring accessibility: every interactive control needs keyboard access, visible focus, semantic HTML or ARIA, sufficient contrast, and useful alt/labels.
2. Missing responsive design: verify mobile, tablet, and desktop; no clipped text, overflow, hidden primary actions, or broken navigation.
3. Weak visual hierarchy: users must immediately see page purpose, primary action, status, and next step.
4. Template-looking UI: reuse Flyto2 design tokens and local components, but tailor layout and copy to the actual product surface.
5. Useless elements: remove decorative or placeholder UI that does not help the workflow, trust, navigation, or comprehension.
6. Unclear hierarchy: controls, cards, tables, panels, and modals must have clear grouping, spacing, headings, and state.
7. Unintuitive navigation: current location, back/forward paths, and cross-links to docs/blog/product pages must be obvious.
8. Hard-to-understand content: copy must be concrete, scannable, current, and consistent with Flyto2 terminology.

Frontend verification must include the relevant automated checks plus manual or screenshot review for responsive layout, accessibility states, navigation clarity, loading/empty/error states, and content readability. Public pages must preserve SEO basics: canonical URL, sitemap coverage, metadata, structured data when relevant, and no broken internal or external links.
