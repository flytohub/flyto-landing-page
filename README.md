<h1 align="center">Flyto Landing Page</h1>

<p align="center">
  <b>The marketing site served at <a href="https://flyto2.com">flyto2.com</a>.</b>
</p>

---

## What lives here

The public marketing site for the Flyto Platform — hero page, product
pages, pricing, blog entry points, demo CTAs. Kept separate from the
product repos so marketing copy iterations don't force a product deploy.

## Stack

- Static-first (Astro / Next SSG — see `package.json` for the actual framework)
- Tailwind + shared design tokens from
  [`@flyto/design-tokens`](https://github.com/flytohub/flyto-design-tokens)
- Deployed on every push to `main`

## Local dev

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static output in dist/ (or .next/out)
```

## Content workflow

- Copy + screenshots land here via PR.
- Long-form content (case studies, engineering posts) lives in
  [flyto-blog](https://github.com/flytohub/flyto-blog) and is linked from
  the landing page rather than duplicated.
- Feature flags / A-B tests are coordinated through
  [`docs/experiments.md`](./docs/experiments.md) when present.

## Related

- [flyto2.com](https://flyto2.com) — what this repo ships
- [flyto-blog](https://github.com/flytohub/flyto-blog) — articles linked from the hero
- [flyto-docs](https://github.com/flytohub/flyto-docs) — product documentation
