import { defaultLocale } from './locales';

export const FLYTO2_SITE_URL = 'https://flyto2.com';

export const FLYTO2_SEO_FACTS = {
  moduleCount: 451,
  catalogCategoryCount: 84,
  builtInRecipeCount: 41,
  browserModuleCount: 54,
  coreRuntimeSummary:
    '451 registry-backed modules across 84 catalog categories, 41 built-in recipes, MCP transports, evidence capture, and replayable YAML execution',
} as const;

export const FLYTO2_HOME_TITLE = 'Security War Room for Evidence-Backed CTEM';

export const FLYTO2_HOME_FULL_TITLE = `Flyto2 - ${FLYTO2_HOME_TITLE}`;

export const FLYTO2_HOME_DESCRIPTION =
  `Flyto2 integrates ASM, EASM, dark web, code security, pentest, red-team, and AI/MCP signals into one evidence-backed CTEM workflow powered by ${FLYTO2_SEO_FACTS.coreRuntimeSummary}.`;

export const FLYTO2_SEO_KEYWORDS = [
  'Flyto2',
  'security war room',
  'CTEM',
  'Continuous Threat Exposure Management',
  'attack surface management',
  'external attack surface management',
  'EASM',
  'dark web monitoring',
  'AI security',
  'MCP security',
  'code intelligence',
  'pentest validation',
  'red team simulation',
  'BYO security integrations',
  'MSSP platform',
  'self-hosted security',
  'open-core security platform',
  'evidence-backed security',
  '451 security automation modules',
] as const;

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
