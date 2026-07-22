# Components

This directory contains shared presentation components for the public Flyto2
site.

Keep components reusable and route-neutral. Product claims, canonical links,
localized text, and SEO metadata should come from `lib/`, `content/`, or
`messages/` instead of being hardcoded inside component bodies.

Ownership is split by workflow:

- `layout/` owns global navigation, locale selection, mobile navigation, and
  footer discovery.
- `sections/` owns reusable product storytelling and structured page sections.
- `forum/` owns the Firebase-backed public discussion experience and its
  configured/unconfigured states.
- `ui/` owns low-level controls and visual primitives.

See the generated [component source reference](../docs/reference/source-components-01.md)
for every component, helper, interface, and type.
