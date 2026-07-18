# GitHub and GitLab Markdown Playbook

This is the Flyto2 standard for repository Markdown. It exists because README
files are product surfaces, not only maintenance notes. A strong README should
make a developer understand the project, trust it, and try one command in the
first screen.

Use this playbook for public Flyto2 repositories and for any private repository
that may later become public.

## What high-star repositories do well

The strongest open-source READMEs share the same pattern:

- **One clear sentence**: describe the project as a category and outcome, not a
  vague technology pile.
- **Immediate credibility**: badges for CI, package version, license, downloads,
  security, or community.
- **Fast proof**: a command, screenshot, output, demo, or "choose your path"
  table near the top.
- **Concrete capabilities**: use feature bullets with verbs and outcomes.
- **Contribution path**: link docs, community, roadmap, good first issues,
  security policy, and support.
- **Public routing**: README links point to stable docs, website, package
  registry, release, and security destinations.

Observed examples:

- Supabase opens with a category claim and then lists product capabilities with
  docs links.
- n8n combines a strong AI/workflow thesis, screenshot, capability bullets, and
  `npx` quick start.
- Playwright uses a "choose the path that fits your workflow" table so
  different users can self-select.
- Next.js uses credibility, docs, showcase, community, contribution, and
  security paths in a short file.
- GitLab Markdown supports task lists, tables, collapsible sections, diagrams,
  syntax highlighting, image descriptions, and cross-references, so docs should
  be structured for scanning rather than plain paragraphs.

## Repository file map

Every public Flyto2 repo should keep these files stable:

| File | Purpose | Rule |
| --- | --- | --- |
| `README.md` | Public front door | Must explain why the project is useful, how to try it, and where to go next. |
| `PROJECT.md` | Maintainer context | Product boundary, owner, status, release state, and non-goals. |
| `ARCHITECTURE.md` | System design | Runtime boundaries, dependencies, trust model, and data flow. |
| `STATE.md` | Current status | Active, beta, deprecated, legacy, or internal. |
| `ROADMAP.md` | Direction | Public near-term work, not private promises. |
| `CHANGELOG.md` | Release history | User-visible changes, migration notes, security fixes. |
| `CONTRIBUTING.md` | Contributor path | Setup, tests, PR process, style, and issue triage. |
| `SECURITY.md` | Security reporting | Always use `security@flyto2.com` and GitHub private vulnerability reporting where available. |
| `SUPPORT.md` | Support routes | Docs, discussions, contact, and expected response path. |
| `.github/ISSUE_TEMPLATE/*` | Triage quality | Collect reproduction, version, environment, expected/actual behavior. |
| `.github/PULL_REQUEST_TEMPLATE.md` | Review quality | Require summary, tests, screenshots if UI, docs impact, and risk notes. |
| `.github/CODEOWNERS` | Ownership | Route review to real owners. |
| `docs/` | Deep documentation | Keep README short; move deep references here. |
| `llms.txt` / `llms-full.txt` | AI discovery | Use only where the repo is a public citation surface. |

## README first-screen formula

Use this order unless the repository is deprecated:

1. Logo or compact project title.
2. One-sentence thesis.
3. Badges: CI, package, license, security, docs.
4. Product links: website, docs, package, examples, community.
5. One paragraph that says who it is for and what outcome it creates.
6. Quick start command or "choose your path" table.
7. Proof: output, screenshot, demo, or minimal example.

Template:

````md
<h1 align="center">Flyto2 [Product]</h1>

<p align="center">
  <b>[Category] for [audience] who need [outcome] without [pain].</b>
</p>

<p align="center">
  <a href="https://flyto2.com">Website</a> |
  <a href="https://docs.flyto2.com">Docs</a> |
  <a href="https://github.com/flytohub/flyto-core">Core</a>
</p>

## Try it in 30 seconds

```bash
[one install command]
[one run command]
```

## Why developers use it

- [Outcome, not internal implementation.]
- [Trust signal or compatibility.]
- [Concrete workflow.]
````

## Flyto2 wording rules

Use direct, outcome-based language:

- `one command`
- `replayable`
- `schema-validated`
- `MCP-native`
- `evidence-backed`
- `self-hostable`
- `no lock-in`
- `full audit trail`
- `runs locally`
- `production-ready` only when release evidence supports it

Avoid vague or unsupported words:

- `revolutionary`
- `world-class`
- `best`
- `next-generation` without proof
- `AI-powered` by itself
- inflated module counts that are not generated from source
- old one-word product names when the product is `Flyto2`
- old domains such as `flyto.io`; use `flyto2.com`

## Package and backlink surfaces

Legitimate backlinks should come from places where Flyto2 actually ships or is
documented:

- PyPI project pages, package descriptions, and project URLs.
- npm package pages for JavaScript SDKs and design tokens.
- GitHub repository topics and About links.
- GitLab mirrors only if maintained and marked as mirrors.
- Docker/GHCR package descriptions.
- Docs, blog, changelog, release notes, and security policy links.
- YouTube demos and public examples when they show the actual product.

Do not buy links, add fake badges, or claim adoption that cannot be verified.

## GitHub/GitLab Markdown conventions

- Keep headings semantic: one `#`, then ordered `##` sections.
- Use tables for choices and routing, not dense prose.
- Use fenced code blocks with language hints.
- Use relative links inside the repo so forks and mirrors work.
- Add alt text for images and screenshots.
- Prefer task lists for release readiness and migration checklists.
- Use collapsible details only for long optional output.
- Keep badges meaningful; remove broken badges.
- Keep security contact centralized at `security@flyto2.com`.

## Deprecated repository pattern

Deprecated repositories should not pretend to be active products. Use this
opening:

```md
# Flyto2 [Legacy Repo]

This repository is deprecated. It remains public for release history,
security routing, and migration references.

Active development moved to:

- [flyto-core](https://github.com/flytohub/flyto-core) for the open-source
  execution engine.
- [flyto-landing-page](https://github.com/flytohub/flyto-landing-page) for
  flyto2.com.
- [flyto-docs](https://github.com/flytohub/flyto-docs) for documentation.
```

## Review checklist

Before merging Markdown changes:

- Product name uses the full `Flyto2` spelling.
- Domain is `flyto2.com`, not old domains.
- Public contacts use `@flyto2.com`.
- README first screen includes a thesis, links, and a quick path.
- Commands were tested or explicitly marked as examples.
- Screenshots and counts are current.
- SEO/GEO files are updated if public route copy changed.
- `npm run verify` passes for this landing-page repository.

## Sources reviewed

- GitHub Docs: About repository README files:
  <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes>
- GitHub Docs: Community profile files:
  <https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories>
- GitHub Docs: Contributor guidelines:
  <https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors>
- GitLab Docs: GitLab Flavored Markdown:
  <https://docs.gitlab.com/user/markdown/>
- Supabase README:
  <https://github.com/supabase/supabase>
- n8n README:
  <https://github.com/n8n-io/n8n>
- Playwright README:
  <https://github.com/microsoft/playwright>
- Next.js README:
  <https://github.com/vercel/next.js>
