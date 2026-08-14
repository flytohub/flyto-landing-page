import { createHash } from 'node:crypto';
import { closeSync, existsSync, fstatSync, openSync, readFileSync, readSync } from 'node:fs';
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
  'components/sections/PhysicalAIDemo.tsx': [
    'physical-ai-exhibit',
    'PHYSICAL_AI_DEMO_ASSET',
    'alt={copy.alt}',
    '<figcaption',
    'https://github.com/flytohub/flyto-robotics',
    'href="#flow-demo-videos"',
  ],
  'lib/physical-ai-demo.ts': [
    'flyto2-ai-space-workflows.webp',
    "'en' | 'zh-TW' | 'zh-CN'",
    'Captured 2026-08-12',
    'Corridor clearance (robot)',
    'Zone overview (camera)',
    'Live commissioning remains incomplete',
    'configuration and exhibit preview, not live commissioning',
    'TurtleBot motion and LiDAR',
    'Mac observation path was verified locally',
    'Customer pairing and live Raspberry Pi commissioning are incomplete',
    '90d0e3a61d7db2646a7d4579acd676352760c4e2d4037298d333e2b80f7c88bb',
    '?? ENGLISH_COPY',
  ],
  'lib/seo.ts': [
    'Physical AI exhibit previews',
    'Physical AI workflow exhibit',
    'TurtleBot LiDAR workflow',
  ],
  'public/llms.txt': [
    'Captured 2026-08-12',
    'configuration and exhibit preview, not live commissioning',
    'TurtleBot motion and LiDAR',
    'separate Mac UVC loopback-only resource',
    'Mac observation was verified locally',
    'Customer pairing and live Raspberry Pi commissioning remain incomplete',
    'Corridor clearance (robot)',
    'Zone overview (camera)',
    'https://github.com/flytohub/flyto-robotics',
    'https://flyto2.com/#flow-demo-videos',
  ],
  'public/llms-full.txt': [
    'captured 2026-08-12',
    'configuration and exhibit preview',
    'live commissioning remains incomplete',
    'TurtleBot motion and LiDAR',
    'separate Mac UVC loopback-only resource',
    'Mac observation was verified locally',
    'customer pairing and live Raspberry Pi commissioning remain incomplete',
    'Corridor clearance (robot)',
    'Zone overview (camera)',
    'https://github.com/flytohub/flyto-robotics',
    'https://flyto2.com/#flow-demo-videos',
  ],
  'scripts/generate-discovery.mjs': [
    "const physicalAiPreviewPath = '/assets/img/demo/flyto2-ai-space-workflows.webp'",
    "title: 'Physical AI configuration preview'",
    'Captured 2026-08-12',
    'Corridor clearance (robot)',
    'Zone overview (camera)',
    'configuration preview',
    'customer pairing and live Raspberry Pi commissioning remain incomplete',
  ],
  'app/[locale]/page.tsx': [
    "import { VideoDemo }",
    '<VideoDemo />',
    'Flyto2 Flow Community Edition Docker image',
    '<PhysicalAIDemo locale={locale} />',
    'Physical AI exhibit preview',
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

const physicalAiPublicFiles = [
  'components/sections/PhysicalAIDemo.tsx',
  'lib/physical-ai-demo.ts',
  'lib/seo.ts',
  'public/llms.txt',
  'public/llms-full.txt',
];

const prohibitedPhysicalAiClaims = [
  'Pi camera',
  'customer commissioning complete',
  'Cloud-to-Pi motion complete',
  'production-ready',
  'one-click install',
  'completed live closed loop',
];

const physicalAiAssetContract = {
  path: 'public/assets/img/demo/flyto2-ai-space-workflows.webp',
  maxBytes: 2 * 1024 * 1024,
  sha256: '74ecc11031517d83dff779a4031fa771fcc2bcaba36cd5ff5636e928393e8dc9',
  sourceSha256: '90d0e3a61d7db2646a7d4579acd676352760c4e2d4037298d333e2b80f7c88bb',
  width: 952,
  height: 908,
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

function readBoundedAsset(relativePath, maxBytes) {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) return null;
  const descriptor = openSync(absolutePath, 'r');
  try {
    const size = fstatSync(descriptor).size;
    if (size > maxBytes) {
      failures.push(`${relativePath} exceeds bounded audit limit of ${maxBytes} bytes`);
      return null;
    }
    const bytes = Buffer.alloc(size);
    let offset = 0;
    while (offset < size) {
      const count = readSync(descriptor, bytes, offset, size - offset, offset);
      if (count === 0) break;
      offset += count;
    }
    if (offset !== size) failures.push(`${relativePath} could not be read completely within its declared size`);
    return bytes.subarray(0, offset);
  } finally {
    closeSync(descriptor);
  }
}

function webpDimensions(bytes) {
  if (bytes.length < 30 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') return null;
  const riffSize = bytes.readUInt32LE(4) + 8;
  if (riffSize !== bytes.length) return null;
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const kind = bytes.toString('ascii', offset, offset + 4);
    const chunkSize = bytes.readUInt32LE(offset + 4);
    const payload = offset + 8;
    if (payload + chunkSize > bytes.length) return null;
    if (kind === 'VP8 ' && chunkSize >= 10 && bytes.subarray(payload + 3, payload + 6).equals(Buffer.from([0x9d, 0x01, 0x2a]))) {
      return { codec: 'VP8', width: bytes.readUInt16LE(payload + 6) & 0x3fff, height: bytes.readUInt16LE(payload + 8) & 0x3fff };
    }
    if (kind === 'VP8L' && chunkSize >= 5 && bytes[payload] === 0x2f) {
      const bits = bytes.readUInt32LE(payload + 1);
      return { codec: 'VP8L', width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
    }
    if (kind === 'VP8X' && chunkSize >= 10) {
      return {
        codec: 'VP8X',
        width: bytes.readUIntLE(payload + 4, 3) + 1,
        height: bytes.readUIntLE(payload + 7, 3) + 1,
      };
    }
    offset = payload + chunkSize + (chunkSize % 2);
  }
  return null;
}

const physicalAiAsset = readBoundedAsset(physicalAiAssetContract.path, physicalAiAssetContract.maxBytes);
if (!physicalAiAsset) {
  failures.push('missing or unreadable Physical AI exhibit preview asset');
} else {
  const digest = createHash('sha256').update(physicalAiAsset).digest('hex');
  if (digest !== physicalAiAssetContract.sha256) failures.push(`Physical AI asset SHA256 mismatch: ${digest}`);
  const dimensions = webpDimensions(physicalAiAsset);
  if (!dimensions || dimensions.codec !== 'VP8') {
    failures.push('Physical AI asset must be RIFF/WEBP with a VP8 image chunk');
  } else if (dimensions.width !== physicalAiAssetContract.width || dimensions.height !== physicalAiAssetContract.height) {
    failures.push(`Physical AI asset dimensions must be ${physicalAiAssetContract.width}x${physicalAiAssetContract.height}`);
  }
}

const physicalAiSource = read('lib/physical-ai-demo.ts');
if (!physicalAiSource.includes(physicalAiAssetContract.sourceSha256)) {
  failures.push('Physical AI asset source provenance SHA256 is not recorded in repository source');
}

for (const file of physicalAiPublicFiles) {
  const content = read(file);
  for (const claim of prohibitedPhysicalAiClaims) {
    if (content.toLowerCase().includes(claim.toLowerCase())) {
      failures.push(`${file} contains prohibited Physical AI claim: ${claim}`);
    }
  }
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
for (const token of [
  'asset/source',
  'whitepaperContentDir',
  './content/whitepaper',
  'skipTrailingSlashRedirect: true',
]) {
  if (!nextConfig.includes(token)) {
    failures.push(`next.config.mjs missing markdown bundling token: ${token}`);
  }
}

const packageJson = JSON.parse(read('package.json'));
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
