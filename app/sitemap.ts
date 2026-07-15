import type { MetadataRoute } from 'next';
import { whitepaperSlugs } from '@/lib/whitepapers';
import { templates } from '@/lib/templates';
import { requiredGeoRoutes } from '@/lib/public-route-pages';

export const dynamic = 'force-static';

const BASE = 'https://flyto2.com';

const STATIC_ROUTES = [
  '',
  'ai-security',
  'airgap',
  'api-docs',
  'attack-surface-management',
  'bitsight-alternative',
  'blog',
  'changelog',
  'cloud',
  'cloud/changelog',
  'cloud/download',
  'cloud/integrations',
  'cloud/pricing',
  'cloud/recipes',
  'cloud/templates',
  'cloud/use-cases',
  'code',
  'code/integrations',
  'code/platform',
  'code/pricing',
  'code/security',
  'code/use-cases',
  'compare',
  'contact',
  'ctem',
  'dark-web-monitoring',
  'docs',
  'enterprise',
  'external-attack-surface-management',
  'mssp-platform',
  'open-source',
  'privacy',
  'pricing',
  'security',
  'terms',
  'trust',
  'whitepaper',
];

const STOREFRONT_ROUTES = new Set([
  '',
  'pricing',
  'security',
  'enterprise',
  'airgap',
  'open-source',
  'compare',
  'api-docs',
  'trust',
  'docs',
  'blog',
  'ctem',
  'attack-surface-management',
  'external-attack-surface-management',
  'dark-web-monitoring',
  'mssp-platform',
  'ai-security',
  'bitsight-alternative',
]);

const DISCOVERY_ROUTES = new Set([
  'cloud/integrations',
  'cloud/recipes',
  'cloud/templates',
  'code/integrations',
  'code/platform',
  'whitepaper',
]);

const LEGAL_ROUTES = new Set(['privacy', 'terms']);

function pageUrl(route: string): string {
  const path = route ? `/${route}/` : '/';
  return `${BASE}${path}`;
}

function routePriority(route: string): number {
  if (route === '') return 1.0;
  if (STOREFRONT_ROUTES.has(route)) return 0.9;
  if (DISCOVERY_ROUTES.has(route)) return 0.8;
  if (route.startsWith('whitepaper/') || route.startsWith('cloud/templates/')) return 0.65;
  if (LEGAL_ROUTES.has(route)) return 0.45;
  return route.includes('/') ? 0.6 : 0.7;
}

function routeChangeFrequency(route: string): MetadataRoute.Sitemap[number]['changeFrequency'] {
  if (route === 'blog' || route === 'changelog' || route.startsWith('whitepaper/')) return 'weekly';
  if (route.startsWith('cloud/templates/')) return 'weekly';
  if (LEGAL_ROUTES.has(route)) return 'monthly';
  return 'weekly';
}

function buildEntry(route: string, now: Date): MetadataRoute.Sitemap[number] {
  return {
    url: pageUrl(route),
    lastModified: now,
    changeFrequency: routeChangeFrequency(route),
    priority: routePriority(route),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const whitepaperRoutes = whitepaperSlugs().map((slug) => `whitepaper/${slug}`);
  const templateRoutes = templates
    .filter((tpl) => !tpl.canonicalSlug)
    .map((tpl) => `cloud/templates/${tpl.slug}`);

  const routes = Array.from(
    new Set([...STATIC_ROUTES, ...requiredGeoRoutes, ...whitepaperRoutes, ...templateRoutes]),
  ).sort();
  const now = new Date();

  return routes.map((route) => buildEntry(route, now));
}
