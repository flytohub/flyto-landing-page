# Messages

This directory stores localized public-site messages.

All visible navigation, calls to action, route labels, and repeated UI text
should be represented here or in the shared route/content registries. Avoid
adding one-off English text directly inside pages or components when the text is
visible to visitors.

`messages/en.json` is the key baseline. `npm run i18n:check` requires every
other catalogue to contain exactly the same leaf keys. Locale identifiers,
hreflang, OpenGraph locale values, and shared keyword clusters come from the
committed `.seo/i18n-seo-manifest.json` contract. See the generated
[SEO and locale reference](../docs/reference/seo-surfaces.md).
