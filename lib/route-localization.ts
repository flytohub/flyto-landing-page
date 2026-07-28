export const ENGLISH_ONLY_ROUTE_PREFIXES = [
  'ai-security',
  'aikido-alternative',
  'airgap',
  'api-docs',
  'attack-surface-management',
  'bitsight-alternative',
  'blog',
  'changelog',
  'community',
  'compare',
  'ctem',
  'dark-web-monitoring',
  'docs',
  'enterprise',
  'external-attack-surface-management',
  'flow',
  'langgraph-alternative',
  'make-alternative',
  'mssp-platform',
  'n8n-alternative',
  'open-source',
  'playwright-alternative',
  'pricing',
  'security',
  'support',
  'trust',
  'warroom',
  'whitepaper',
  'zapier-alternative',
] as const;

export function normalizeLocalizationRoute(path: string) {
  return path.replace(/^\/+|\/+$/g, '');
}

export function isEnglishOnlyRoute(path: string) {
  const route = normalizeLocalizationRoute(path);
  return ENGLISH_ONLY_ROUTE_PREFIXES.some(
    (prefix) => route === prefix || route.startsWith(`${prefix}/`),
  );
}
