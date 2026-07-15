import { defaultLocale, locales, type Locale } from './locales';

export const FLYTO2_SITE_URL = 'https://flyto2.com';

export const HREFLANG_BY_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-Hant-TW',
  cn: 'zh-Hans-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  de: 'de-DE',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  pt: 'pt-BR',
  hi: 'hi-IN',
  id: 'id-ID',
  pl: 'pl-PL',
  th: 'th-TH',
  tr: 'tr-TR',
  vi: 'vi-VN',
} as const;

export const X_DEFAULT_HREFLANG = 'x-default';

export const FLYTO2_SEO_FACTS = {
  moduleCount: 451,
  catalogCategoryCount: 84,
  builtInRecipeCount: 41,
  browserModuleCount: 54,
  coreRuntimeSummary:
    '451 registry-backed modules across 84 catalog categories, 41 built-in recipes, MCP transports, evidence capture, and replayable YAML execution',
} as const;

export const FLYTO2_HOME_TITLE = 'Security War Room and Automation Platform for Evidence-Backed CTEM';

export const FLYTO2_HOME_FULL_TITLE = `Flyto2 - ${FLYTO2_HOME_TITLE}`;

export const FLYTO2_HOME_DESCRIPTION =
  `Flyto2 combines a security war room for evidence-backed CTEM with Cloud, Apps, and browser automation workflows powered by ${FLYTO2_SEO_FACTS.coreRuntimeSummary}.`;

export const FLYTO2_SEO_KEYWORDS = [
  'Flyto2',
  'security war room',
  'CTEM',
  'CTEM cybersecurity',
  'CTEM security',
  'Continuous Threat Exposure Management',
  'attack surface management',
  'attack surface management platform',
  'attack surface management software',
  'attack surface management tools',
  'attack surface management vendors',
  'attack surface management vs vulnerability management',
  'external attack surface management',
  'external attack surface management tools',
  'external attack surface management platform',
  'EASM',
  'continuous attack surface management',
  'continuous threat exposure management ctem framework',
  'dark web monitoring',
  'AI security',
  'MCP security',
  'security automation platform',
  'open source attack surface management',
  'open source security war room',
  'code intelligence',
  'pentest validation',
  'red team simulation',
  'BYO security integrations',
  'MSSP platform',
  'workflow automation',
  'no-code app automation',
  'browser automation',
  'self-hosted security',
  'open-core security platform',
  'evidence-backed security',
  '451 security automation modules',
] as const;

/**
 * Build canonical + hreflang metadata for a public page.
 *
 *   path:   trailing-slashless route under the locale, e.g. '' for home,
 *           'cloud', 'cloud/pricing'.
 *
 * Default English routes stay unprefixed. Non-English routes use the public
 * locale prefix, and every variant advertises the same complete hreflang set.
 */
export function isSupportedLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function normalizeSeoPath(path: string) {
  return path.replace(/^\/+|\/+$/g, '');
}

export function localizedPath(path: string, locale: string = defaultLocale) {
  const supportedLocale = isSupportedLocale(locale) ? locale : defaultLocale;
  const route = normalizeSeoPath(path);
  const suffix = route ? `/${route}/` : '/';
  return supportedLocale === defaultLocale ? suffix : `/${supportedLocale}${suffix}`;
}

export function localizedUrl(path: string, locale: string = defaultLocale) {
  return `${FLYTO2_SITE_URL}${localizedPath(path, locale)}`;
}

export function languageAlternates(path: string, absolute = false) {
  const urlFor = absolute ? localizedUrl : localizedPath;
  const languages = Object.fromEntries(
    locales.map((locale) => [HREFLANG_BY_LOCALE[locale], urlFor(path, locale)]),
  ) as Record<string, string>;

  languages[X_DEFAULT_HREFLANG] = urlFor(path, defaultLocale);
  return languages;
}

export function pageAlternates(path: string, locale: string = defaultLocale) {
  return {
    canonical: localizedPath(path, locale),
    languages: languageAlternates(path),
  };
}
