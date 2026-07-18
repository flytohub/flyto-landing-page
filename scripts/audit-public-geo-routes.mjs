import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const requiredRoutes = [
  'pricing',
  'security',
  'enterprise',
  'airgap',
  'open-source',
  'aikido-alternative',
  'n8n-alternative',
  'zapier-alternative',
  'make-alternative',
  'playwright-alternative',
  'langgraph-alternative',
  'compare',
  'api-docs',
  'trust',
  'community',
  'docs',
  'blog',
  'changelog',
];

const requiredStatic = [
  'public/robots.txt',
  'public/llms.txt',
  'public/llms-full.txt',
  'public/.well-known/security.txt',
];

const failures = [];

for (const route of requiredRoutes) {
  const page = path.join(root, 'app', '[locale]', route, 'page.tsx');
  if (!existsSync(page)) {
    failures.push(`missing source route: /${route}/`);
  }
}

for (const file of requiredStatic) {
  if (!existsSync(path.join(root, file))) {
    failures.push(`missing static GEO file: ${file}`);
  }
}

const sitemap = readFileSync(path.join(root, 'app', 'sitemap.ts'), 'utf8');
if (!sitemap.includes('requiredGeoRoutes')) {
  failures.push('sitemap.ts must include requiredGeoRoutes');
}
for (const token of ['locales.map', 'localizedUrl', 'languageAlternates', 'alternates']) {
  if (!sitemap.includes(token)) {
    failures.push(`sitemap.ts missing multilingual sitemap token: ${token}`);
  }
}

const seo = readFileSync(path.join(root, 'lib', 'seo.ts'), 'utf8');
for (const token of ['HREFLANG_BY_LOCALE', 'x-default', 'localizedPath', 'languageAlternates', 'languages']) {
  if (!seo.includes(token)) {
    failures.push(`lib/seo.ts missing hreflang token: ${token}`);
  }
}

const localeLayout = readFileSync(path.join(root, 'app', '[locale]', 'layout.tsx'), 'utf8');
if (localeLayout.includes("locale === 'en'") && localeLayout.includes('index: false')) {
  failures.push('locale layout must not noindex supported non-English routes');
}

const whitepapers = readFileSync(path.join(root, 'lib', 'whitepapers.ts'), 'utf8');
if (whitepapers.includes('readFileSync') || whitepapers.includes('node:fs')) {
  failures.push('lib/whitepapers.ts must bundle markdown content, not read files at Cloudflare Worker runtime');
}
for (const token of ['../content/whitepaper/audit.md', 'BODY_BY_SLUG']) {
  if (!whitepapers.includes(token)) {
    failures.push(`lib/whitepapers.ts missing bundled whitepaper token: ${token}`);
  }
}

const discussionsClient = readFileSync(path.join(root, 'components', 'forum', 'DiscussionsClient.tsx'), 'utf8');
for (const token of ['ssr: false', "import('./DiscussionsView')"]) {
  if (!discussionsClient.includes(token)) {
    failures.push(`DiscussionsClient must keep Firebase forum rendering client-only: ${token}`);
  }
}
for (const route of ['cloud/discussions', 'code/discussions']) {
  const pagePath = path.join(root, 'app', '[locale]', ...route.split('/'), 'page.tsx');
  const page = readFileSync(pagePath, 'utf8');
  if (page.includes('@/components/forum/DiscussionsView') || page.includes('<DiscussionsView')) {
    failures.push(`/${route}/ must not import DiscussionsView directly into Worker SSR`);
  }
  if (!page.includes('@/components/forum/DiscussionsClient') || !page.includes('<DiscussionsClient')) {
    failures.push(`/${route}/ must render the client-only DiscussionsClient wrapper`);
  }
  if (!page.includes('robots: { index: false, follow: true }')) {
    failures.push(`/${route}/ must keep discussions noindex/follow`);
  }
}

const llms = readFileSync(path.join(root, 'public', 'llms.txt'), 'utf8');
const full = readFileSync(path.join(root, 'public', 'llms-full.txt'), 'utf8');
for (const route of requiredRoutes) {
  const url = `https://flyto2.com/${route}/`;
  if (!llms.includes(url)) {
    failures.push(`llms.txt missing ${url}`);
  }
  if (!full.includes(`/${route}/`) && !full.includes(url)) {
    failures.push(`llms-full.txt missing /${route}/`);
  }
}

const robots = readFileSync(path.join(root, 'public', 'robots.txt'), 'utf8');
for (const ua of ['OAI-SearchBot', 'ChatGPT-User', 'Claude-User', 'PerplexityBot', 'Googlebot', 'Bingbot']) {
  if (!robots.includes(`User-agent: ${ua}`)) {
    failures.push(`robots.txt missing explicit UA policy for ${ua}`);
  }
}

if (failures.length) {
  console.error('public GEO route audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`public GEO route audit passed: ${requiredRoutes.length} routes`);
