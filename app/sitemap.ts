import type { MetadataRoute } from 'next';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { whitepaperSlugs } from '@/lib/whitepapers';
import { templates } from '@/lib/templates';

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

function routeUrl(route: string) {
  const path = route ? `/${route}` : '';
  return `${BASE}${path}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = discoverStaticRoutes(PAGES_ROOT);
  const whitepaperRoutes = whitepaperSlugs().map((slug) => `whitepaper/${slug}`);
  // Templates: include only primary slugs. Alias entries (canonicalSlug) 308
  // redirect to their primary, so listing them would create duplicate sitemap
  // entries pointing at the same content.
  const templateRoutes = templates
    .filter((tpl) => !tpl.canonicalSlug)
    .map((tpl) => `cloud/templates/${tpl.slug}`);

  const routes = [
    ...staticRoutes,
    ...whitepaperRoutes,
    ...templateRoutes,
  ].sort();
  const now = new Date();

  return routes.map((route) => ({
    url: routeUrl(route),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route.includes('/') ? 0.6 : 0.7,
  }));
}
