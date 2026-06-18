import type { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/lib/locales';
import { whitepaperSlugs } from '@/lib/whitepapers';
import { templates } from '@/lib/templates';

export const dynamic = 'force-static';

const BASE = 'https://flyto2.com';

const STATIC_ROUTES = [
  '',
  'ai-security',
  'attack-surface-management',
  'bitsight-alternative',
  'cloud',
  'cloud/changelog',
  'cloud/discussions',
  'cloud/download',
  'cloud/integrations',
  'cloud/pricing',
  'cloud/recipes',
  'cloud/templates',
  'cloud/use-cases',
  'code',
  'code/discussions',
  'code/integrations',
  'code/platform',
  'code/pricing',
  'code/security',
  'code/use-cases',
  'contact',
  'ctem',
  'dark-web-monitoring',
  'external-attack-surface-management',
  'mssp-platform',
  'privacy',
  'terms',
  'whitepaper',
];

function localeUrl(locale: string, route: string): string {
  const path = route ? `/${route}/` : '/';
  return locale === defaultLocale
    ? `${BASE}${path}`
    : `${BASE}/${locale}${path}`;
}

function buildEntry(route: string, now: Date): MetadataRoute.Sitemap[number] {
  const langs: Record<string, string> = {};
  for (const loc of locales) {
    langs[loc] = localeUrl(loc, route);
  }
  langs['x-default'] = localeUrl(defaultLocale, route);

  return {
    url: localeUrl(defaultLocale, route),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route.includes('/') ? 0.6 : 0.7,
    alternates: { languages: langs },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const whitepaperRoutes = whitepaperSlugs().map((slug) => `whitepaper/${slug}`);
  const templateRoutes = templates
    .filter((tpl) => !tpl.canonicalSlug)
    .map((tpl) => `cloud/templates/${tpl.slug}`);

  const routes = [...STATIC_ROUTES, ...whitepaperRoutes, ...templateRoutes].sort();
  const now = new Date();

  return routes.map((route) => buildEntry(route, now));
}
