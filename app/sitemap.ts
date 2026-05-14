import type { MetadataRoute } from 'next';
import { locales, defaultLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-static';

const BASE = 'https://flyto2.com';

const routes = [
  '',
  'cloud',
  'cloud/pricing',
  'cloud/download',
  'cloud/templates',
  'cloud/discussions',
  'code',
  'code/discussions',
];

function localePath(locale: Locale, route: string) {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const path = route ? `/${route}` : '';
  return `${BASE}${prefix}${path}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: localePath(defaultLocale, route),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, localePath(locale, route)]),
      ),
    },
  }));
}
