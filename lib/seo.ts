import { locales, defaultLocale, type Locale } from './locales';

/**
 * Build `alternates.languages` + self-referencing canonical for a given
 * page path so Google indexes each locale as its own canonical entry
 * (instead of treating every locale as a duplicate of /en/).
 *
 *   path:   trailing-slashless route under the locale, e.g. '' for home,
 *           'cloud', 'cloud/pricing'.
 *   locale: current request locale. The canonical points at THIS locale's
 *           URL, not at /en/. Required for correct hreflang semantics —
 *           a non-self canonical defeats the hreflang cluster.
 */
export function pageAlternates(path: string, locale: string = defaultLocale) {
  const safeLocale: Locale = (locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : defaultLocale;
  const suffix = path ? `/${path}/` : '/';
  const urlFor = (loc: Locale) =>
    loc === defaultLocale ? suffix : `/${loc}${suffix}`;

  const languages = Object.fromEntries(
    locales.map((loc) => [loc, urlFor(loc)]),
  ) as Record<Locale, string>;

  return {
    canonical: urlFor(safeLocale),
    languages: {
      ...languages,
      'x-default': urlFor(defaultLocale),
    },
  };
}
