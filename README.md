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

- Next.js 15 (App Router) with `output: 'export'` for static generation
- next-intl for 16-locale routing
- Tailwind v4 + Motion library + lucide-react
- Firebase Web SDK (client-only) for the Q&A forum
- Deployed to GitHub Pages on every push to `main` via
  `.github/workflows/deploy.yml`

## Local dev

```bash
cd next
npm install
npm run dev          # http://localhost:3000
npm run build        # static output in next/out/
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
