import type { MetadataRoute } from 'next';
import { whitepaperSlugs } from '@/lib/whitepapers';
import { templates } from '@/lib/templates';
import { requiredGeoRoutes } from '@/lib/public-route-pages';
import { productIntentPages } from '@/lib/product-intent-pages';
import { defaultLocale, locales, type Locale } from '@/lib/locales';
import { isEnglishOnlyRoute } from '@/lib/route-localization';
import { languageAlternates, localizedUrl } from '@/lib/seo';

export const dynamic = 'force-static';

const STATIC_ROUTES = [
  '',
  'ai-security',
  'airgap',
  'api-docs',
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
    new Set([
      ...STATIC_ROUTES,
      ...requiredGeoRoutes,
      // /flow/n8n-alternative/ 308s to /n8n-alternative/. Search Console gave the
      // top-level page 290 impressions to this one's 10 over 90 days, despite it
      // having no internal links at all — so the tidy answer (fold it under the
      // product line, like the other intent pages) would have retired the only
      // version Google is showing. A redirecting URL must not be in the sitemap.
      ...productIntentPages
        .filter((page) => page.path !== 'flow/n8n-alternative')
        .map((page) => page.path),
      ...whitepaperRoutes,
      ...templateRoutes,
    ]),
  ).sort();
  return routes.flatMap((route) => {
    const routeLocales = isEnglishOnlyRoute(route) ? [defaultLocale] : locales;
    return routeLocales.map((locale) => buildEntry(route, locale));
  });
}
