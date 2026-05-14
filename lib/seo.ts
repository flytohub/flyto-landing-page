import { locales, defaultLocale, type Locale } from './locales';

/**
 * Build `alternates.languages` + canonical for a given page path so Google
 * can index every locale of the same page correctly.
 *
 *   path: trailing-slashless route under the locale, e.g. '' for home,
 *         'cloud', 'cloud/pricing'.
 */
export function pageAlternates(path: string) {
  const suffix = path ? `/${path}/` : '/';
  const languages = Object.fromEntries(
    locales.map((locale) => [
      locale,
      locale === defaultLocale ? suffix : `/${locale}${suffix}`,
    ]),
  ) as Record<Locale, string>;

  return {
    canonical: suffix,
    languages: {
      ...languages,
      'x-default': suffix,
    },
  };
}
