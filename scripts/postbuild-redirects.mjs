/**
 * After `next build` finishes, walk `out/en/` and emit redirect HTML files
 * at the corresponding bare paths (e.g. `out/cloud/index.html` → /en/cloud/).
 *
 * Why: GitHub Pages has no middleware. next-intl's `localePrefix: as-needed`
 * works in dev but the static export only generates locale-prefixed routes.
 * Without these redirects, hitting bare /code or /cloud returns 404.
 *
 * The generated HTML auto-detects the browser locale (en/zh/ja) so users
 * land on the locale that matches their browser.
 */

import { readdirSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const OUT = 'out';
const DEFAULT_LOCALE = 'en';
const LOCALES = ['en', 'zh', 'ja'];

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

function buildRedirectHtml(route) {
  // route is like 'cloud' or 'cloud/discussions'
  const defaultTarget = `/${DEFAULT_LOCALE}/${route}/`;
  const supportedJson = JSON.stringify(LOCALES);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<link rel="canonical" href="https://flyto2.com${defaultTarget}">
<script>
(function () {
  var supported = ${supportedJson};
  var nav = (navigator.language || '${DEFAULT_LOCALE}').toLowerCase();
  var pick = '${DEFAULT_LOCALE}';
  if (/^zh/.test(nav)) pick = 'zh';
  else if (/^ja/.test(nav)) pick = 'ja';
  if (supported.indexOf(pick) < 0) pick = '${DEFAULT_LOCALE}';
  location.replace('/' + pick + '/${route}/');
})();
</script>
<meta http-equiv="refresh" content="0; url=${defaultTarget}">
</head>
<body>
<p>Redirecting to <a href="${defaultTarget}">${defaultTarget}</a>…</p>
</body>
</html>
`;
}

function main() {
  const enDir = path.join(OUT, DEFAULT_LOCALE);
  if (!existsSync(enDir)) {
    console.error(`postbuild-redirects: ${enDir} not found — was the build successful?`);
    process.exit(1);
  }

  const routes = walkLocaleRoutes(enDir);
  let written = 0;
  for (const route of routes) {
    const targetDir = path.join(OUT, route);
    const targetFile = path.join(targetDir, 'index.html');
    // Don't overwrite if a real bare page already exists (e.g. public/<route>/index.html).
    if (existsSync(targetFile)) continue;
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(targetFile, buildRedirectHtml(route));
    written++;
  }
  console.log(`postbuild-redirects: wrote ${written} bare-path redirects across ${routes.length} routes`);
}

main();
