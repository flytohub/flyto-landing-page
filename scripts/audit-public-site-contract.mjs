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
  'n8n-alternative',
  'zapier-alternative',
  'make-alternative',
  'playwright-alternative',
  'langgraph-alternative',
  'compare',
  'api-docs',
  'trust',
  'community',
  'support',
  'docs',
  'blog',
  'changelog',
];

const criticalPublicFiles = [
  'public/robots.txt',
  'public/llms.txt',
  'public/llms-full.txt',
  'app/sitemap.ts',
  'lib/route-localization.ts',
  'lib/product-intent-pages.ts',
  'app/.well-known/openai-apps-challenge/route.ts',
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
    'https://hub.docker.com/r/chesterhsu/flyto-warroom',
    'https://docs.flyto2.com/warroom/self-hosted-ce',
    'The Warroom application source repository is not public',
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
    "href: '/flow'",
    "href: '/warroom'",
  ],
  'components/sections/Hero.tsx': [
    'grid-rows-[70%_30%]',
    'sm:grid-cols-2 sm:grid-rows-1',
  ],
  'components/sections/VideoDemo.tsx': [
    "'@type': 'VideoObject'",
    'x3NCA01xKSc',
    'dFchXNdpHMI',
    "duration: 'PT47S'",
    "duration: 'PT52S'",
    'www.youtube-nocookie.com/embed',
    'https://www.youtube.com/@Flyto2',
  ],
  'app/[locale]/page.tsx': [
    "import { VideoDemo }",
    '<VideoDemo />',
    'Flyto2 Flow Community Edition Docker image',
  ],
  'components/layout/Footer.tsx': [
    'Flyto2 Flow',
    'Flyto2 Warroom',
    'Visual MCP builder',
    'Docker images',
    'Flow docs',
    'Warroom docs',
    "localized('/support')",
  ],
  'app/.well-known/openai-apps-challenge/route.ts': [
    'OPENAI_APPS_CHALLENGE_TOKEN',
    'text/plain; charset=utf-8',
    'Cache-Control',
    'no-store',
  ],
  'app/[locale]/privacy/page.tsx': [
    'OAuth authorization transactions and codes: up to 5 minutes',
    'ChatGPT access tokens: up to 15 minutes',
    'Security and audit logs: normally up to 12 months',
    'Backups containing deleted data are overwritten within 90 days',
  ],
  'lib/public-route-metadata.ts': [
    'pageAlternates(page.path, locale)',
    'openGraph',
    'twitter',
  ],
  'app/[locale]/aikido-alternative/page.tsx': [
    "publicRoutePages['aikido-alternative']",
    'publicRouteMetadata(page, locale)',
  ],
  'lib/nav.ts': [
    "label: 'Flow overview', href: '/flow'",
    "label: 'Warroom overview', href: '/warroom'",
    'https://docs.flyto2.com/flow/',
    'https://blog.flyto2.com/security/',
  ],
  'lib/product-intent-pages.ts': [
    "path: 'flow'",
    "path: 'flow/mcp-builder'",
    "path: 'flow/browser-automation'",
    "path: 'flow/n8n-alternative'",
    "path: 'warroom'",
    "path: 'warroom/ctem'",
    "path: 'warroom/security-validation'",
    "path: 'warroom/attack-surface-management'",
    'The Flow application source repository is not public',
    'The Warroom application source repository is not public',
    'Flow Community Edition',
    'docker.io/flyto2/flow:0.1.1',
    'https://hub.docker.com/r/flyto2/flow',
    'https://docs.flyto2.com/flow/community-edition-docker',
  ],
  'components/sections/ProductIntentPage.tsx': [
    'page.quickStart',
    'softwareVersion',
    'downloadUrl',
    'Docker quick start',
  ],
  'middleware.ts': [
    'x-flyto-internal-locale-rewrite',
    'openAiAppsChallengePath',
    'X-NEXT-INTL-LOCALE',
    'NextResponse.rewrite',
    'NextResponse.redirect',
  ],
  'public/llms.txt': [
    'Flyto2 Flow CE',
    'https://docs.flyto2.com/flow/community-edition-docker',
    'https://hub.docker.com/r/flyto2/flow',
    'Docker Hub: Flyto2 Warroom images',
    'The Flyto2 Flow application source repository is not public',
    'The Flyto2 Warroom application source repository is not public',
    'Enterprise bridge',
    'Do not describe CE as a full Enterprise source release',
    'Aikido alternative',
  ],
  'public/llms-full.txt': [
    'Canonical Flow CE links',
    'https://docs.flyto2.com/flow/community-edition-docker',
    'https://hub.docker.com/r/flyto2/flow',
    'The Flow application source repository is not public',
    'The Warroom application source repository is not public',
    'Self-hosted CE and distribution channels',
    'Warroom CE, Enterprise bridge',
    '/aikido-alternative/',
  ],
};

const keywordSurfaceContracts = {
  'lib/seo.ts': [
    'attack surface management platform',
    'attack surface management vendors',
    'attack surface management vs vulnerability management',
    'external attack surface management platform',
    'continuous threat exposure management ctem framework',
    'source-available attack surface management',
    'security automation platform',
  ],
  'lib/public-route-pages.ts': [
    'attack surface management software',
    'external attack surface management tools',
    'attack surface management vs vulnerability management',
    'attack surface management API',
    'CTEM framework',
    'EASM tools',
  ],
  'lib/security-pages.ts': [
    'attack surface management software',
    'attack surface management vendors',
    'external attack surface management platform',
    'continuous threat exposure management programs',
    'beyond vulnerability management',
  ],
  'public/llms.txt': [
    'Search-intent keyword clusters',
    'attack surface management tools',
    'external attack surface management platform',
    'CTEM vs vulnerability management',
    'security automation platform',
    'attack surface management API',
  ],
  'public/llms-full.txt': [
    'Search-intent and long-tail keyword clusters',
    'attack surface management software',
    'external attack surface management tools',
    'continuous threat exposure management CTEM framework',
    'attack surface management vs vulnerability management',
    'CTEM workflow API',
  ],
  'app/[locale]/page.tsx': [
    'attack surface management software',
    'external attack surface management platform',
    'source-available attack surface management',
    'security automation platform',
  ],
};

const failures = [];

const releaseContract = {
  next: '16.3.2',
  typescript: '7.0.2',
  legacyTypescriptAlias: 'npm:typescript@6.0.3',
  handoff: 'handoffs/2026-08-27-grouped-dependency-source-migration.md',
  workflowCommands: [
    'npm run verify',
    'npm run build:cf',
    'flyto-index verify . --full-scan --strict --json',
  ],
};

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
for (const token of ['routeLocales.map', 'localizedUrl', 'languageAlternates', 'alternates', 'isEnglishOnlyRoute']) {
  if (!sitemap.includes(token)) {
    failures.push(`sitemap.ts missing multilingual sitemap contract token: ${token}`);
  }
}

const seo = read('lib/seo.ts');
for (const token of ['HREFLANG_BY_LOCALE', 'x-default', 'localizedPath', 'languageAlternates', 'languages', 'isEnglishOnlyRoute']) {
  if (!seo.includes(token)) {
    failures.push(`lib/seo.ts missing hreflang contract token: ${token}`);
  }
}

const routeLocalization = read('lib/route-localization.ts');
for (const route of [...productRoutes, 'ai-security', 'attack-surface-management', 'bitsight-alternative', 'ctem', 'dark-web-monitoring', 'external-attack-surface-management', 'mssp-platform', 'whitepaper']) {
  if (!routeLocalization.includes(`'${route}'`)) {
    failures.push(`English-only route missing localization policy: /${route}/`);
  }
}

const localeLayout = read('app/[locale]/layout.tsx');
if (localeLayout.includes("locale === 'en'") && localeLayout.includes('index: false')) {
  failures.push('locale layout must not noindex supported non-English routes after multilingual sitemap activation');
}

const whitepapers = read('lib/whitepapers.ts');
for (const token of ['WHITEPAPER_BODY_BY_SLUG', 'BODY_BY_SLUG']) {
  if (!whitepapers.includes(token)) {
    failures.push(`lib/whitepapers.ts missing bundled whitepaper token: ${token}`);
  }
}

const whitepaperGenerator = read('scripts/generate-whitepaper-content.mjs');
for (const token of ["'content', 'whitepaper'", 'whitepaper-content.generated.ts', 'canonicalFiles', '--check']) {
  if (!whitepaperGenerator.includes(token)) {
    failures.push(`whitepaper content generator missing token: ${token}`);
  }
}

const nextConfig = read('next.config.mjs');
for (const token of ['skipTrailingSlashRedirect: true']) {
  if (!nextConfig.includes(token)) {
    failures.push(`next.config.mjs missing routing token: ${token}`);
  }
}

const packageJson = JSON.parse(read('package.json'));
const packageLock = JSON.parse(read('package-lock.json'));
const rootLockPackage = packageLock.packages?.[''] ?? {};
const lockedNext = packageLock.packages?.['node_modules/next'];
const lockedTypescript = packageLock.packages?.['node_modules/typescript'];
const lockedLegacyTypescript = packageLock.packages?.['node_modules/typescript-legacy-docs'];

for (const [label, actual, expected] of [
  ['package.json next dependency', packageJson.dependencies?.next, releaseContract.next],
  ['package.json primary TypeScript dependency', packageJson.devDependencies?.typescript, releaseContract.typescript],
  ['package.json legacy TypeScript docs alias', packageJson.devDependencies?.['typescript-legacy-docs'], releaseContract.legacyTypescriptAlias],
  ['package-lock root next dependency', rootLockPackage.dependencies?.next, releaseContract.next],
  ['package-lock root primary TypeScript dependency', rootLockPackage.devDependencies?.typescript, releaseContract.typescript],
  ['package-lock root legacy TypeScript docs alias', rootLockPackage.devDependencies?.['typescript-legacy-docs'], releaseContract.legacyTypescriptAlias],
  ['package-lock Next.js resolution', lockedNext?.version, releaseContract.next],
  ['package-lock primary TypeScript resolution', lockedTypescript?.version, releaseContract.typescript],
  ['package-lock legacy TypeScript docs resolution', lockedLegacyTypescript?.version, '6.0.3'],
]) {
  if (actual !== expected) failures.push(`${label} must be exactly ${expected}; received ${actual ?? 'missing'}`);
}

const workflow = read('.github/workflows/ci.yml');
const workflowRunCommands = [...workflow.matchAll(/^\s*run:\s*(.+?)\s*$/gm)].map((match) => match[1]);
for (const command of releaseContract.workflowCommands) {
  const count = workflowRunCommands.filter((candidate) => candidate === command).length;
  if (count !== 1) failures.push(`ci.yml must run exactly once: ${command}; received ${count}`);
}
for (const redundantCommand of ['npm run audit:geo', 'npm run lint', 'npm test', 'npm run build', 'npm run docs:check']) {
  if (workflowRunCommands.includes(redundantCommand)) {
    failures.push(`ci.yml must not repeat check already included in npm run verify: ${redundantCommand}`);
  }
}

const releaseDocumentation = {
  'README.md': read('README.md'),
  'CHANGELOG.md': read('CHANGELOG.md'),
  'STATE.md': read('STATE.md'),
  [releaseContract.handoff]: read(releaseContract.handoff),
  'handoffs/_registry.md': read('handoffs/_registry.md'),
};
for (const file of ['README.md', 'CHANGELOG.md', 'STATE.md', releaseContract.handoff]) {
  const content = releaseDocumentation[file];
  for (const token of ['Next.js 16.3.2', 'TypeScript 7.0.2']) {
    if (!content.includes(token)) failures.push(`${file} missing release-contract token: ${token}`);
  }
}
for (const file of ['README.md', 'CHANGELOG.md', 'STATE.md', releaseContract.handoff]) {
  const content = releaseDocumentation[file];
  if (!content.includes('TypeScript 6.0.3') || !content.includes('typescript-legacy-docs')) {
    failures.push(`${file} must name TypeScript 6.0.3 only with the typescript-legacy-docs alias`);
  }
  if (/primary TypeScript 6\.0\.3|TypeScript 6\.0\.3 (?:is|as) the primary/i.test(content)) {
    failures.push(`${file} must not claim TypeScript 6.0.3 is primary`);
  }
}
if (!releaseDocumentation['handoffs/_registry.md'].includes(path.basename(releaseContract.handoff))) {
  failures.push(`handoffs/_registry.md must register ${path.basename(releaseContract.handoff)}`);
}
const buildCfScript = packageJson.scripts?.['build:cf'] ?? '';
for (const token of ['opennextjs-cloudflare build', 'opennextjs-cloudflare populateCache local']) {
  if (!buildCfScript.includes(token)) {
    failures.push(`package.json build:cf missing Cloudflare cache build token: ${token}`);
  }
}

const openNextConfig = read('open-next.config.ts');
for (const token of [
  'defineCloudflareConfig',
  'static-assets-incremental-cache',
  'staticAssetsIncrementalCache',
]) {
  if (!openNextConfig.includes(token)) {
    failures.push(`open-next.config.ts missing Cloudflare static assets cache token: ${token}`);
  }
}
if (/incrementalCache:\s*['"]dummy['"]/.test(openNextConfig)) {
  failures.push('open-next.config.ts must not use dummy incrementalCache for the public SEO surface');
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
const openaiChallenge = read('app/.well-known/openai-apps-challenge/route.ts');
for (const route of productRoutes) {
  const url = `https://flyto2.com/${route}/`;
  if (!llms.includes(url)) {
    failures.push(`llms.txt missing citation-ready URL ${url}`);
  }
  if (!llmsFull.includes(`/${route}/`) && !llmsFull.includes(url)) {
    failures.push(`llms-full.txt missing public route /${route}/`);
  }
}

if (openaiChallenge.includes('NextResponse.json') || openaiChallenge.includes('JSON.stringify')) {
  failures.push('OpenAI Apps challenge endpoint must return only the exact plain-text token');
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
for (const token of ['isEnglishOnlyRoute', 'locale !== defaultLocale', 'NextResponse.redirect(url, 308)']) {
  if (!middleware.includes(token)) {
    failures.push(`middleware missing English-only locale redirect contract: ${token}`);
  }
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

for (const [file, tokens] of Object.entries(keywordSurfaceContracts)) {
  const content = read(file);
  for (const token of tokens) {
    if (!content.includes(token)) {
      failures.push(`${file} missing SEO keyword cluster token: ${token}`);
    }
  }
}

for (const file of [
  'CONTRIBUTING.md',
  'components/layout/Footer.tsx',
  'components/layout/Header.tsx',
  'components/sections/ProductIntentPage.tsx',
  'lib/nav.ts',
  'lib/product-intent-pages.ts',
  'lib/public-route-pages.ts',
  'public/llms.txt',
  'public/llms-full.txt',
]) {
  const content = read(file);
  for (const url of [
    'https://github.com/flytohub/flyto-flow',
    'https://github.com/flytohub/flyto-warroom',
  ]) {
    if (content.includes(url)) {
      failures.push(`${file} contains prohibited non-public customer URL: ${url}`);
    }
  }
}

for (const [file, wording] of [
  ['lib/product-intent-pages.ts', ['The Flow application source repository is not public', 'The Warroom application source repository is not public']],
  ['lib/public-route-pages.ts', ['The Warroom application source repository is not public']],
  ['public/llms.txt', ['The Flyto2 Flow application source repository is not public', 'The Flyto2 Warroom application source repository is not public']],
  ['public/llms-full.txt', ['The Flow application source repository is not public', 'The Warroom application source repository is not public']],
]) {
  const content = read(file);
  for (const statement of wording) {
    if (!content.includes(statement)) {
      failures.push(`${file} missing honest availability wording: ${statement}`);
    }
  }
}

if (failures.length) {
  console.error('public-site contract audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`public-site contract audit passed: ${productRoutes.length} canonical routes, ${expectedCrawlerPolicies.length} crawler policies, and ${Object.keys(launchSurfaceContracts).length} launch-surface contracts`);
