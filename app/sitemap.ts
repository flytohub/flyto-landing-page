import type { MetadataRoute } from 'next';
import { whitepaperSlugs } from '@/lib/whitepapers';
import { templates } from '@/lib/templates';
import { requiredGeoRoutes } from '@/lib/public-route-pages';
import { locales, type Locale } from '@/lib/locales';
import { languageAlternates, localizedUrl } from '@/lib/seo';

export const dynamic = 'force-static';

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
  'compare',
  'community',
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

function buildEntry(route: string, locale: Locale): MetadataRoute.Sitemap[number] {
  return {
    url: localizedUrl(route, locale),
    alternates: {
      languages: languageAlternates(route, true),
    },
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
  return routes.flatMap((route) => locales.map((locale) => buildEntry(route, locale)));
}
