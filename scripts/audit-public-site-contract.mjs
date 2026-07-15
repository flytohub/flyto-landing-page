import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const productRoutes = [
  'pricing',
  'security',
  'enterprise',
  'airgap',
  'open-source',
  'aikido-alternative',
  'compare',
  'api-docs',
  'trust',
  'docs',
  'blog',
  'changelog',
];

const criticalPublicFiles = [
  'public/robots.txt',
  'public/llms.txt',
  'public/llms-full.txt',
  'app/sitemap.ts',
];

const expectedCrawlerPolicies = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Googlebot',
  'Bingbot',
  'Applebot',
  'Bytespider',
  'CCBot',
  'Meta-ExternalAgent',
  'FacebookBot',
];

const launchSurfaceContracts = {
  'lib/public-route-pages.ts': [
    'https://github.com/flytohub/flyto-warroom',
    'https://hub.docker.com/r/chesterhsu/flyto-warroom',
    'https://docs.flyto2.com/warroom/self-hosted-ce',
    'Warroom CE',
    'Enterprise bridge',
    'Premium actions fail closed',
    'Aikido alternative',
    'Evidence-backed AutoFix loop',
  ],
  'lib/security-pages.ts': [
    'self-hosted Warroom CE',
    'Enterprise bridge',
    'Self-hosted CE docs',
    '/open-source',
  ],
  'components/sections/ProductPicker.tsx': [
    "href: '/open-source'",
  ],
  'components/layout/Footer.tsx': [
    'Flyto2 Warroom CE',
    'Aikido alternative',
    'Docker images',
    'Self-hosted docs',
  ],
  'app/[locale]/aikido-alternative/page.tsx': [
    "publicRoutePages['aikido-alternative']",
    'pageAlternates(page.path, locale)',
  ],
  'lib/nav.ts': [
    "{ key: 'oss',          href: '/open-source' }",
  ],
  'middleware.ts': [
    'x-flyto-internal-locale-rewrite',
    'X-NEXT-INTL-LOCALE',
    'NextResponse.rewrite',
    'NextResponse.redirect',
  ],
  'public/llms.txt': [
    'GitHub: Flyto2 Warroom CE',
    'Docker Hub: Flyto2 Warroom images',
    'Enterprise bridge',
    'Do not describe CE as a full Enterprise source release',
    'Aikido alternative',
  ],
  'public/llms-full.txt': [
    'Self-hosted CE and distribution channels',
    'Warroom CE, Enterprise bridge',
    'CE mirror boundary',
    '/aikido-alternative/',
  ],
};

const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`missing public-site contract file: ${relativePath}`);
    return '';
  }
  return readFileSync(absolutePath, 'utf8');
}

for (const file of criticalPublicFiles) {
  if (!existsSync(path.join(root, file))) {
    failures.push(`missing critical public-site file: ${file}`);
  }
}

for (const route of productRoutes) {
  const page = path.join(root, 'app', '[locale]', route, 'page.tsx');
  if (!existsSync(page)) {
    failures.push(`missing canonical public route source: /${route}/`);
  }
}

const sitemap = read('app/sitemap.ts');
if (!sitemap.includes('requiredGeoRoutes')) {
  failures.push('sitemap.ts must include requiredGeoRoutes so SEO/AEO/GEO routes stay in one source of truth');
}
for (const token of ['locales.map', 'localizedUrl', 'languageAlternates', 'alternates']) {
  if (!sitemap.includes(token)) {
    failures.push(`sitemap.ts missing multilingual sitemap contract token: ${token}`);
  }
}

const seo = read('lib/seo.ts');
for (const token of ['HREFLANG_BY_LOCALE', 'x-default', 'localizedPath', 'languageAlternates', 'languages']) {
  if (!seo.includes(token)) {
    failures.push(`lib/seo.ts missing hreflang contract token: ${token}`);
  }
}

const localeLayout = read('app/[locale]/layout.tsx');
if (localeLayout.includes("locale === 'en'") && localeLayout.includes('index: false')) {
  failures.push('locale layout must not noindex supported non-English routes after multilingual sitemap activation');
}

const whitepapers = read('lib/whitepapers.ts');
if (whitepapers.includes('readFileSync') || whitepapers.includes('node:fs')) {
  failures.push('lib/whitepapers.ts must bundle markdown content, not read files at Cloudflare Worker runtime');
}
for (const token of [
  '../content/whitepaper/audit.md',
  '../content/whitepaper/supplement.md',
  '../content/whitepaper/code.md',
  '../content/whitepaper/engine.md',
  '../content/whitepaper/mssp-warroom.md',
  '../content/whitepaper/byo-integration.md',
  '../content/whitepaper/security-surfaces.md',
  'BODY_BY_SLUG',
]) {
  if (!whitepapers.includes(token)) {
    failures.push(`lib/whitepapers.ts missing bundled whitepaper token: ${token}`);
  }
}

const nextConfig = read('next.config.mjs');
for (const token of ['asset/source', 'whitepaperContentDir', './content/whitepaper']) {
  if (!nextConfig.includes(token)) {
    failures.push(`next.config.mjs missing markdown bundling token: ${token}`);
  }
}

const discussionsClient = read('components/forum/DiscussionsClient.tsx');
for (const token of ['ssr: false', "import('./DiscussionsView')"]) {
  if (!discussionsClient.includes(token)) {
    failures.push(`DiscussionsClient must keep Firebase forum rendering client-only: ${token}`);
  }
}
for (const route of ['cloud/discussions', 'code/discussions']) {
  const pagePath = `app/[locale]/${route}/page.tsx`;
  const page = read(pagePath);
  if (page.includes('@/components/forum/DiscussionsView') || page.includes('<DiscussionsView')) {
    failures.push(`${pagePath} must not import DiscussionsView directly into Worker SSR`);
  }
  if (!page.includes('@/components/forum/DiscussionsClient') || !page.includes('<DiscussionsClient')) {
    failures.push(`${pagePath} must render the client-only DiscussionsClient wrapper`);
  }
  if (!page.includes('robots: { index: false, follow: true }')) {
    failures.push(`${pagePath} must keep discussions noindex/follow`);
  }
}

const robots = read('public/robots.txt');
for (const ua of expectedCrawlerPolicies) {
  if (!robots.includes(`User-agent: ${ua}`)) {
    failures.push(`robots.txt missing explicit crawler policy for ${ua}`);
  }
}
if (!robots.includes('Sitemap: https://flyto2.com/sitemap.xml')) {
  failures.push('robots.txt missing canonical sitemap pointer');
}

const llms = read('public/llms.txt');
const llmsFull = read('public/llms-full.txt');
const middleware = read('middleware.ts');
const homePage = read('app/[locale]/page.tsx');
for (const route of productRoutes) {
  const url = `https://flyto2.com/${route}/`;
  if (!llms.includes(url)) {
    failures.push(`llms.txt missing citation-ready URL ${url}`);
  }
  if (!llmsFull.includes(`/${route}/`) && !llmsFull.includes(url)) {
    failures.push(`llms-full.txt missing public route /${route}/`);
  }
}

for (const url of [
  'https://flyto2.com/',
  'https://flyto2.com/robots.txt',
  'https://flyto2.com/sitemap.xml',
  'https://flyto2.com/llms.txt',
  'https://flyto2.com/llms-full.txt',
]) {
  if (!llms.includes(url) && !llmsFull.includes(url)) {
    failures.push(`AI-readable files missing critical URL ${url}`);
  }
}

if (!middleware.includes('api(?:/|$)')) {
  failures.push('middleware matcher must exclude only /api or /api/*, not public routes like /api-docs/');
}
if (middleware.includes('(?!api|')) {
  failures.push('middleware matcher excludes every api* path and will 404 /api-docs/');
}

for (const token of ['openGraph', 'twitter', 'summary_large_image']) {
  if (!homePage.includes(token)) {
    failures.push(`homepage metadata missing ${token}`);
  }
}

for (const [file, tokens] of Object.entries(launchSurfaceContracts)) {
  const content = read(file);
  for (const token of tokens) {
    if (!content.includes(token)) {
      failures.push(`${file} missing launch-surface contract token: ${token}`);
    }
  }
}

if (failures.length) {
  console.error('public-site contract audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`public-site contract audit passed: ${productRoutes.length} canonical routes, ${expectedCrawlerPolicies.length} crawler policies, and ${Object.keys(launchSurfaceContracts).length} launch-surface contracts`);
