/**
 * After `next build` finishes, walk `out/en/` and copy English HTML files to
 * the corresponding bare paths (e.g. `out/en/cloud/index.html` → /cloud/).
 *
 * Why: GitHub Pages has no middleware. next-intl's `localePrefix: as-needed`
 * works in dev but the static export only generates locale-prefixed routes.
 * Without this pass, hitting bare /code or /cloud returns 404.
 *
 * Flyto2's public SEO is English-first, so bare paths should be the English
 * canonical content instead of browser-locale redirects.
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
  let copied = 0;
  for (const route of routes) {
    const sourceFile = path.join(enDir, route, 'index.html');
    if (!existsSync(sourceFile)) continue;
    const targetDir = route ? path.join(OUT, route) : OUT;
    const targetFile = path.join(targetDir, 'index.html');
    mkdirSync(targetDir, { recursive: true });
    copyFileSync(sourceFile, targetFile);
    copied++;
  }
  console.log(`postbuild-redirects: copied ${copied} English routes to bare canonical paths`);
}

main();
