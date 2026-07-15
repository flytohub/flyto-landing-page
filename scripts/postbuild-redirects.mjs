/**
 * After `next build` finishes, walk `out/en/` and copy English HTML files to
 * the corresponding bare paths (e.g. `out/en/cloud/index.html` → /cloud/).
 *
 * Why: GitHub Pages has no middleware. next-intl's `localePrefix: as-needed`
 * works in dev but the static export only generates locale-prefixed routes.
 * Without this pass, hitting bare /code or /cloud returns 404.
 *
 * Flyto2's public SEO uses bare English paths as x-default. Localized routes
 * keep their locale prefixes and are advertised through sitemap/hreflang
 * alternates.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';

const OUT = 'out';
const DEFAULT_LOCALE = 'en';

function walkLocaleRoutes(dir, base = '') {
  const entries = readdirSync(dir, { withFileTypes: true });
  const routes = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('_')) continue; // _next etc
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    routes.push(rel);
    routes.push(...walkLocaleRoutes(full, rel));
  }
  return routes;
}

function main() {
  const enDir = path.join(OUT, DEFAULT_LOCALE);
  if (!existsSync(enDir)) {
    console.error(`postbuild-redirects: ${enDir} not found — was the build successful?`);
    process.exit(1);
  }

  const routes = ['', ...walkLocaleRoutes(enDir)];
  const routeFiles = ['index.html', 'index.txt'];
  let copiedRoutes = 0;
  let copiedFiles = 0;
  for (const route of routes) {
    let routeCopied = false;
    const targetDir = route ? path.join(OUT, route) : OUT;
    for (const fileName of routeFiles) {
      const sourceFile = path.join(enDir, route, fileName);
      if (!existsSync(sourceFile)) continue;
      mkdirSync(targetDir, { recursive: true });
      copyFileSync(sourceFile, path.join(targetDir, fileName));
      copiedFiles++;
      routeCopied = true;
    }
    if (routeCopied) copiedRoutes++;
  }
  console.log(
    `postbuild-redirects: copied ${copiedFiles} English route files for ${copiedRoutes} bare canonical paths`
  );
}

main();
