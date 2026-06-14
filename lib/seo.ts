import { defaultLocale } from './locales';

/**
 * Build English-first canonical metadata for a public page.
 *
 *   path:   trailing-slashless route under the locale, e.g. '' for home,
 *           'cloud', 'cloud/pricing'.
 *
 * Flyto2 is intentionally English-first for public SEO in this phase. The
 * locale routes remain reachable for existing users, but they are no longer
 * advertised as hreflang alternates and non-English pages canonicalize here.
 */
export function pageAlternates(path: string, locale: string = defaultLocale) {
  const suffix = path ? `/${path}/` : '/';
  void locale;
  return {
    canonical: suffix,
  };
}
