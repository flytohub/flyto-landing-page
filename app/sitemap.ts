import type { MetadataRoute } from 'next';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { locales, defaultLocale, type Locale } from '@/lib/locales';
import { whitepaperSlugs } from '@/lib/whitepapers';

export const dynamic = 'force-static';

const BASE = 'https://flyto2.com';
const PAGES_ROOT = path.join(process.cwd(), 'app', '[locale]');

/**
 * Walk app/[locale]/ at build time and collect every directory that contains
 * a page.tsx. Skips dynamic segments like [slug] — those are listed explicitly
 * below alongside their slug source.
 */
function discoverStaticRoutes(dir: string, base = ''): string[] {
  const out: string[] = [];
  let hasPage = false;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;
    if (entry.isFile() && name === 'page.tsx') {
      hasPage = true;
      continue;
    }
    if (!entry.isDirectory()) continue;
    if (name.startsWith('[')) continue; // dynamic — handled below
    if (name.startsWith('_') || name.startsWith('.')) continue;
    const sub = path.join(dir, name);
    const subBase = base ? `${base}/${name}` : name;
    out.push(...discoverStaticRoutes(sub, subBase));
  }
  if (hasPage) out.push(base);
  return out;
}

function localePath(locale: Locale, route: string) {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const path = route ? `/${route}` : '';
  return `${BASE}${prefix}${path}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = discoverStaticRoutes(PAGES_ROOT);
  const dynamicRoutes = whitepaperSlugs().map((slug) => `whitepaper/${slug}`);
  const routes = [...staticRoutes, ...dynamicRoutes].sort();
  const now = new Date();

  // Emit one <url> entry per (locale × route) combo. Each entry carries
  // the full hreflang cluster (+ x-default) so Google sees the full
  // alternates regardless of which entry it crawled first.
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: localePath(locale, route),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : route.includes('/') ? 0.6 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((loc) => [loc, localePath(loc, route)]),
          ),
          'x-default': localePath(defaultLocale, route),
        },
      },
    })),
  );
}
