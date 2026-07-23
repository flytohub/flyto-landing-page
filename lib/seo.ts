import { defaultLocale, locales, type Locale } from './locales';
import { isEnglishOnlyRoute } from './route-localization';
import i18nSeoContract from '../.seo/i18n-seo-manifest.json';

type SeoLocale = {
  hreflang: string;
  og_locale: string;
};

type SeoContract = {
  defaultLocale: string;
  xDefaultLocale: string;
  locales: Record<string, SeoLocale>;
  surface: {
    origin: string;
    keywordClusters: Array<{
      primary: string;
      longTail: string[];
    }>;
  };
};

const seoContract = i18nSeoContract as SeoContract;

export const FLYTO2_SITE_URL = seoContract.surface.origin;

export const MANIFEST_LOCALE_BY_PUBLIC_LOCALE: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-TW',
  cn: 'zh-CN',
  ja: 'ja',
  ko: 'ko',
  de: 'de',
  es: 'es',
  fr: 'fr',
  it: 'it',
  pt: 'pt-BR',
  hi: 'hi',
  id: 'id',
  pl: 'pl',
  th: 'th',
  tr: 'tr',
  vi: 'vi',
} as const;

export const HREFLANG_BY_LOCALE = Object.fromEntries(
  locales.map((locale) => {
    const manifestLocale = MANIFEST_LOCALE_BY_PUBLIC_LOCALE[locale];
    return [locale, seoContract.locales[manifestLocale]?.hreflang ?? manifestLocale];
  }),
) as Record<Locale, string>;

export const OG_LOCALE_BY_LOCALE = Object.fromEntries(
  locales.map((locale) => {
    const manifestLocale = MANIFEST_LOCALE_BY_PUBLIC_LOCALE[locale];
    return [locale, seoContract.locales[manifestLocale]?.og_locale ?? 'en_US'];
  }),
) as Record<Locale, string>;

export const X_DEFAULT_HREFLANG = 'x-default';

export const FLYTO2_SEO_FACTS = {
  moduleCount: 452,
  catalogCategoryCount: 84,
  builtInRecipeCount: 41,
  browserModuleCount: 54,
  coreRuntimeSummary:
    '452 registry-backed modules across 84 catalog categories, 41 built-in recipes, MCP transports, evidence capture, and replayable YAML execution',
} as const;

export const FLYTO2_HOME_TITLE = 'AI Automation and Security Operations Platforms';

export const FLYTO2_HOME_FULL_TITLE = `Flyto2 - ${FLYTO2_HOME_TITLE}`;

export const FLYTO2_HOME_DESCRIPTION =
  'Flyto2 builds source-available execution platforms for AI workflow automation, visual MCP tools, browser workflows, CTEM, security validation, and evidence-backed operations.';

const manifestKeywordTerms = seoContract.surface.keywordClusters.flatMap((cluster) => [
  cluster.primary,
  ...cluster.longTail,
]);

export const FLYTO2_SEO_KEYWORDS = Array.from(new Set([
  'Flyto2',
  'AI workflow automation',
  'AI workflow automation tools',
  'AI workflow automation platform',
  'AI workflow automation software',
  'open source AI workflow automation',
  'open source AI agent framework',
  'open source AI agent framework Python',
  'MCP server automation',
  'MCP automation tools',
  'agentic AI workflow automation',
  'no-code AI workflow automation',
  'self-hosted workflow automation',
  'n8n alternative',
  'Zapier alternative',
  'Make alternative',
  'Playwright alternative',
  'LangGraph alternative',
  'no-code browser automation',
  'AI agent workflow automation',
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
  'source-available attack surface management',
  'source-available security war room',
  'code intelligence',
  'pentest validation',
  'red team simulation',
  'BYO security integrations',
  'MSSP platform',
  'workflow automation',
  'no-code app automation',
  'browser automation',
  'self-hosted security',
  'source-available security platform',
  'evidence-backed security',
  '452 security automation modules',
  ...manifestKeywordTerms,
]));

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
  if (isEnglishOnlyRoute(path)) {
    const englishUrl = urlFor(path, defaultLocale);
    return {
      [HREFLANG_BY_LOCALE[defaultLocale]]: englishUrl,
      [X_DEFAULT_HREFLANG]: englishUrl,
    };
  }

  const languages = Object.fromEntries(
    locales.map((locale) => [HREFLANG_BY_LOCALE[locale], urlFor(path, locale)]),
  ) as Record<string, string>;

  languages[X_DEFAULT_HREFLANG] = urlFor(path, defaultLocale);
  return languages;
}

export function pageAlternates(path: string, locale: string = defaultLocale) {
  const canonicalLocale = isEnglishOnlyRoute(path) ? defaultLocale : locale;
  return {
    canonical: localizedPath(path, canonicalLocale),
    languages: languageAlternates(path),
  };
}
