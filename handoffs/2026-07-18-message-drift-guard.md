# 2026-07-18 Message Drift Guard Handoff

## Scope

Fixed the landing i18n drift CI failure caused by a stale dependency on a
removed `flyto-i18n` script.

## Changes

- Added `scripts/check-message-drift.mjs` to compare every `messages/*.json`
  file against `messages/en.json`.
- Added `npm run i18n:check` and wired it into `npm run test`, so local verify
  catches message key drift before push.
- Updated `.github/workflows/i18n-drift.yml` to run the local checker directly.
- Filled previously missing `code.platform.*` and security navigation keys
  across non-English message files with English fallback strings.

## Verification

- `npm run i18n:check`
- `npm run test`
- `npm run verify`

## Notes

`flyto-i18n` still owns the shared SEO manifest source. Landing message
catalogue shape is now guarded in the consumer repo, where the files live.
The new fallback strings should be replaced by native translations in a later
`flyto-i18n` localization pass.
