# ChatGPT app public trust surfaces

## Scope

This change closes the public landing requirements owned by `flyto2.com` for
the Flyto2 ChatGPT app submission. It does not create reviewer credentials,
submit the app, or choose the OpenAI-issued domain-verification token.

## Implemented

- Added `/support/` for Cloud, ChatGPT app, MCP routing, connected runner,
  Warroom, account, billing, privacy, and security support.
- Wired Support into footer navigation, sitemap source, English-only route
  policy, SEO/AEO/GEO audits, and AI-readable indexes.
- Replaced inaccurate offline-only privacy copy with the connected-service
  data boundary and explicit retention periods.
- Added `/.well-known/openai-apps-challenge`. It returns the exact trimmed
  `OPENAI_APPS_CHALLENGE_TOKEN` as `text/plain` with `Cache-Control: no-store`;
  without the secret it returns HTTP 404 and an empty body.
- Regenerated the source-backed documentation reference.

## Validation

- `npm run verify` passed, including documentation, locale drift, 19 GEO
  routes, 19 public-site routes, TypeScript, production build, SEO audit,
  average SEO score 96, and SEO management score 100.
- Production build emitted the dynamic OpenAI challenge route and the Support
  route.
- Local runtime verification proved an exact token body and the fail-closed
  404 path.
- Browser review passed at 1440 × 1000 and 390 × 844 with no horizontal
  overflow or console errors on Support and Privacy.

## External activation

When OpenAI supplies the real challenge token, set it as the protected
`OPENAI_APPS_CHALLENGE_TOKEN` runtime variable for the production landing
deployment. Do not commit the value. After deployment, compare the response
body byte-for-byte before completing domain verification.
