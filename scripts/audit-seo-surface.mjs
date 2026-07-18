import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(root, '.next', 'server', 'app');
const publicDir = path.join(root, 'public');
const seoDir = path.join(root, '.seo');
const seoContractPath = path.join(seoDir, 'i18n-seo-manifest.json');
const expectedSurfaceKey = 'landing';
const publicLocaleByManifestLocale = {
  en: 'en',
  'zh-TW': 'zh',
  'zh-CN': 'cn',
  ja: 'ja',
  ko: 'ko',
  de: 'de',
  es: 'es',
  fr: 'fr',
  it: 'it',
  'pt-BR': 'pt',
  hi: 'hi',
  id: 'id',
  pl: 'pl',
  th: 'th',
  tr: 'tr',
  vi: 'vi',
};
const seoContract = loadSeoContract();
const siteUrl = seoContract.surface.origin;

const checkedPages = [
  { name: 'home', file: 'en.html', canonical: `${siteUrl}/`, terms: ['AI workflow automation', 'MCP-native', 'CTEM'] },
  { name: 'ctem', file: 'en/ctem.html', canonical: `${siteUrl}/ctem/`, terms: ['CTEM', 'evidence', 'remediation'] },
  { name: 'attack surface management', file: 'en/attack-surface-management.html', canonical: `${siteUrl}/attack-surface-management/`, terms: ['attack surface management'] },
  { name: 'external attack surface management', file: 'en/external-attack-surface-management.html', canonical: `${siteUrl}/external-attack-surface-management/`, terms: ['external attack surface'] },
  { name: 'open source', file: 'en/open-source.html', canonical: `${siteUrl}/open-source/`, terms: ['open source', 'Warroom CE'] },
  { name: 'aikido alternative', file: 'en/aikido-alternative.html', canonical: `${siteUrl}/aikido-alternative/`, terms: ['Aikido alternative'] },
  { name: 'security hub', file: 'en/security.html', canonical: `${siteUrl}/security/`, terms: ['security'] },
  { name: 'pricing', file: 'en/pricing.html', canonical: `${siteUrl}/pricing/`, terms: ['pricing'] },
  { name: 'enterprise', file: 'en/enterprise.html', canonical: `${siteUrl}/enterprise/`, terms: ['Enterprise'] },
  { name: 'compare', file: 'en/compare.html', canonical: `${siteUrl}/compare/`, terms: ['compare'] },
  { name: 'api docs', file: 'en/api-docs.html', canonical: `${siteUrl}/api-docs/`, terms: ['API'] },
  { name: 'trust', file: 'en/trust.html', canonical: `${siteUrl}/trust/`, terms: ['trust'] },
  { name: 'community', file: 'en/community.html', canonical: `${siteUrl}/community/`, terms: ['community', 'social'] },
  { name: 'docs bridge', file: 'en/docs.html', canonical: `${siteUrl}/docs/`, terms: ['docs'] },
  { name: 'blog bridge', file: 'en/blog.html', canonical: `${siteUrl}/blog/`, terms: ['blog'] },
  { name: 'airgap', file: 'en/airgap.html', canonical: `${siteUrl}/airgap/`, terms: ['airgap'] },
  { name: 'changelog', file: 'en/changelog.html', canonical: `${siteUrl}/changelog/`, terms: ['changelog'] },
];

const sitemapRequiredUrls = checkedPages.map((page) => page.canonical);
const requiredSitemapAlternates = [
  `hreflang="${seoContract.locales.en.hreflang}"`,
  `hreflang="${seoContract.locales['zh-TW'].hreflang}"`,
  'hreflang="x-default"',
];
const requiredRobotsTokens = [
  `Sitemap: ${seoContract.surface.sitemap}`,
  'Sitemap: https://flyto2.com/image-sitemap.xml',
  'User-agent: Googlebot',
  'User-agent: Bingbot',
  'User-agent: OAI-SearchBot',
  'User-agent: ChatGPT-User',
  'User-agent: Claude-User',
  'User-agent: PerplexityBot',
];
const requiredLlmsTokens = [
  'Search-intent keyword clusters',
  'AI workflow automation',
  'open source AI agent framework',
  'attack surface management',
  'continuous threat exposure management',
  'MCP server automation',
  'https://flyto2.com/image-sitemap.xml',
  'https://docs.flyto2.com',
  'https://blog.flyto2.com',
];
const requiredKeywordMatrixTokens = ['Volume', 'SD', 'PD', 'CPC', 'Long-Tail Route Intent', 'Ubersuggest'];
const maxKeywordMatrixAgeDays = 100;
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`missing required file: ${relativePath}`);
    return '';
  }
  return readFileSync(absolutePath, 'utf8');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function loadSeoContract() {
  if (!existsSync(seoContractPath)) {
    throw new Error('missing .seo/i18n-seo-manifest.json; run npm run seo:sync');
  }

  return JSON.parse(readFileSync(seoContractPath, 'utf8'));
}

function fail(message) {
  failures.push(message);
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function getTags(html, tagName) {
  return Array.from(html.matchAll(new RegExp(`<${tagName}\\b([^>]*)>`, 'gi')), (match) => match[1]);
}

function attrs(rawAttrs) {
  const result = {};
  for (const match of rawAttrs.matchAll(/([:@\w-]+)\s*=\s*"([^"]*)"/g)) {
    result[match[1].toLowerCase()] = decodeHtml(match[2]);
  }
  return result;
}

function findMeta(html, key, value) {
  const wanted = value.toLowerCase();
  for (const raw of getTags(html, 'meta')) {
    const attributes = attrs(raw);
    if ((attributes[key] ?? '').toLowerCase() === wanted) {
      return attributes.content ?? '';
    }
  }
  return '';
}

function findLink(html, rel, hrefLang = null) {
  const wantedRel = rel.toLowerCase();
  const wantedLang = hrefLang?.toLowerCase();
  for (const raw of getTags(html, 'link')) {
    const attributes = attrs(raw);
    if ((attributes.rel ?? '').toLowerCase() !== wantedRel) continue;
    if (wantedLang && (attributes.hreflang ?? '').toLowerCase() !== wantedLang) continue;
    return attributes.href ?? '';
  }
  return '';
}

function publicAssetPath(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.host !== 'flyto2.com') return '';
    return path.join(publicDir, parsed.pathname.replace(/^\/+/, ''));
  } catch {
    return url.startsWith('/') ? path.join(publicDir, url.replace(/^\/+/, '')) : '';
  }
}

function checkPublicAsset(label, metaLabel, url) {
  const assetPath = publicAssetPath(url);
  if (assetPath && !existsSync(assetPath)) fail(`${label} ${metaLabel} points to missing public asset: ${url}`);
}

function routeFromCanonical(canonical) {
  const pathname = new URL(canonical).pathname.replace(/^\/+|\/+$/g, '');
  return pathname === 'en' ? '' : pathname;
}

function publicUrlForManifestLocale(route, manifestLocale) {
  const publicLocale = publicLocaleByManifestLocale[manifestLocale];
  if (!publicLocale) throw new Error(`missing public locale mapping for ${manifestLocale}`);

  const suffix = route ? `/${route}/` : '/';
  return publicLocale === 'en' ? `${siteUrl}${suffix}` : `${siteUrl}/${publicLocale}${suffix}`;
}

function contractKeywordTerms() {
  return seoContract.surface.keywordClusters.flatMap((cluster) => [
    cluster.primary,
    ...cluster.longTail,
  ]);
}

function titleFrom(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? decodeHtml(match[1]) : '';
}

function checkLength(label, value, min, max) {
  if (value.length < min || value.length > max) {
    fail(`${label} length ${value.length} outside ${min}-${max}: ${value}`);
  }
}

function checkBrandAndEmails(label, content) {
  const legacyBrandPattern = new RegExp(`\\b${'Fly'}${'to'}\\b`, 'g');
  const legacyBrand = content.match(legacyBrandPattern);
  if (legacyBrand) fail(`${label} contains standalone legacy brand token; use Flyto2 unless referring to repo IDs`);

  const emails = content.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  const badEmails = [...new Set(emails.filter((email) => !email.toLowerCase().endsWith('@flyto2.com')))];
  if (badEmails.length) fail(`${label} contains non-flyto2.com email(s): ${badEmails.join(', ')}`);
}

function checkPage(page) {
  const htmlPath = path.join(appDir, page.file);
  if (!existsSync(htmlPath)) {
    fail(`${page.name} build output missing: ${path.relative(root, htmlPath)}`);
    return;
  }

  const html = readFileSync(htmlPath, 'utf8');
  const title = titleFrom(html);
  const description = findMeta(html, 'name', 'description');
  const canonical = findLink(html, 'canonical');
  const robots = findMeta(html, 'name', 'robots');
  const ogTitle = findMeta(html, 'property', 'og:title');
  const ogDescription = findMeta(html, 'property', 'og:description');
  const ogUrl = findMeta(html, 'property', 'og:url');
  const ogImage = findMeta(html, 'property', 'og:image');
  const twitterCard = findMeta(html, 'name', 'twitter:card');
  const twitterTitle = findMeta(html, 'name', 'twitter:title');
  const twitterDescription = findMeta(html, 'name', 'twitter:description');
  const twitterImage = findMeta(html, 'name', 'twitter:image');
  const xDefault = findLink(html, 'alternate', 'x-default');
  const route = routeFromCanonical(page.canonical);
  const enHreflang = seoContract.locales.en.hreflang;
  const zhTwHreflang = seoContract.locales['zh-TW'].hreflang;
  const enAlternate = findLink(html, 'alternate', enHreflang);
  const zhTwAlternate = findLink(html, 'alternate', zhTwHreflang);

  checkLength(`${page.name} title`, title, 10, 70);
  checkLength(`${page.name} description`, description, 50, 180);
  if (canonical !== page.canonical) fail(`${page.name} canonical mismatch: expected ${page.canonical}, got ${canonical || '(missing)'}`);
  if (ogUrl !== page.canonical) fail(`${page.name} og:url mismatch: expected ${page.canonical}, got ${ogUrl || '(missing)'}`);
  if (xDefault !== page.canonical) fail(`${page.name} x-default mismatch: expected ${page.canonical}, got ${xDefault || '(missing)'}`);
  if (enAlternate !== page.canonical) fail(`${page.name} en-US alternate mismatch: expected ${page.canonical}, got ${enAlternate || '(missing)'}`);
  if (zhTwAlternate !== publicUrlForManifestLocale(route, 'zh-TW')) {
    fail(`${page.name} zh-TW alternate mismatch: expected ${publicUrlForManifestLocale(route, 'zh-TW')}, got ${zhTwAlternate || '(missing)'}`);
  }
  if (!robots.toLowerCase().includes('index')) fail(`${page.name} robots tag must be indexable; got ${robots || '(missing)'}`);

  for (const [label, value] of [
    ['og:title', ogTitle],
    ['og:description', ogDescription],
    ['og:image', ogImage],
    ['twitter:card', twitterCard],
    ['twitter:title', twitterTitle],
    ['twitter:description', twitterDescription],
    ['twitter:image', twitterImage],
  ]) {
    if (!value) fail(`${page.name} missing ${label}`);
  }
  checkPublicAsset(page.name, 'og:image', ogImage);
  checkPublicAsset(page.name, 'twitter:image', twitterImage);

  if (!html.includes('application/ld+json')) fail(`${page.name} missing JSON-LD`);
  for (const term of page.terms) {
    if (!html.toLowerCase().includes(term.toLowerCase())) fail(`${page.name} missing SEO intent term: ${term}`);
  }
  checkBrandAndEmails(page.name, html);
}

function checkSeoContract() {
  if (seoContract.surfaceKey !== expectedSurfaceKey) {
    fail(`SEO contract surface mismatch: expected ${expectedSurfaceKey}, got ${seoContract.surfaceKey || '(missing)'}`);
  }
  if (seoContract.surface.origin !== 'https://flyto2.com') {
    fail(`SEO contract origin mismatch: ${seoContract.surface.origin || '(missing)'}`);
  }
  if (seoContract.surface.sitemap !== `${seoContract.surface.origin}/sitemap.xml`) {
    fail(`SEO contract sitemap mismatch: ${seoContract.surface.sitemap || '(missing)'}`);
  }

  const requiredSignals = new Set(seoContract.surface.requiredSignals ?? []);
  for (const signal of ['canonical', 'hreflang-alternates', 'x-default', 'sitemap', 'localized-title', 'localized-description', 'structured-data']) {
    if (!requiredSignals.has(signal)) fail(`SEO contract missing required signal: ${signal}`);
  }

  if (Object.keys(seoContract.locales ?? {}).length < 16) {
    fail('SEO contract must expose all 16 Flyto2 locale definitions');
  }
  for (const locale of ['en', 'zh-TW', 'zh-CN', 'pt-BR']) {
    if (!seoContract.locales?.[locale]?.hreflang) fail(`SEO contract missing hreflang for ${locale}`);
  }

  if ((seoContract.surface.keywordClusters ?? []).length < 2) {
    fail('SEO contract must include at least two keyword clusters for landing');
  }
  for (const cluster of seoContract.surface.keywordClusters ?? []) {
    if (!cluster.evidence?.source || cluster.evidence.observedAt !== '2026-07-18') {
      fail(`SEO contract keyword cluster ${cluster.id} missing fresh evidence`);
    }
    if (!Array.isArray(cluster.longTail) || cluster.longTail.length < 5) {
      fail(`SEO contract keyword cluster ${cluster.id} must include long-tail terms`);
    }
  }

  const upstreamPath = path.resolve(root, '..', 'flyto-i18n', 'dist', 'seo-manifest.json');
  if (existsSync(upstreamPath)) {
    const upstreamText = readFileSync(upstreamPath, 'utf8');
    if (seoContract.source?.sha256 !== sha256(upstreamText)) {
      fail('.seo/i18n-seo-manifest.json is stale; run npm run seo:sync');
    }
  }
}

function checkBuildOutput() {
  if (!existsSync(appDir)) {
    fail('missing .next/server/app; run npm run build before npm run audit:seo');
    return;
  }
  for (const page of checkedPages) checkPage(page);
}

function checkSitemap() {
  const sitemap = readFileSync(path.join(appDir, 'sitemap.xml.body'), 'utf8');
  const locCount = (sitemap.match(/<loc>/g) ?? []).length;
  if (locCount < 900) fail(`sitemap has too few URLs for multilingual landing surface: ${locCount}`);
  for (const url of sitemapRequiredUrls) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`sitemap missing ${url}`);
  }
  for (const token of requiredSitemapAlternates) {
    if (!sitemap.includes(token)) fail(`sitemap missing alternate token: ${token}`);
  }
}

function checkRobotsAndLlms() {
  const robots = readFileSync(path.join(publicDir, 'robots.txt'), 'utf8');
  const llms = readFileSync(path.join(publicDir, 'llms.txt'), 'utf8');
  const full = readFileSync(path.join(publicDir, 'llms-full.txt'), 'utf8');

  for (const token of requiredRobotsTokens) {
    if (!robots.includes(token)) fail(`robots.txt missing ${token}`);
  }
  for (const token of requiredLlmsTokens) {
    if (!llms.includes(token) && !full.includes(token)) fail(`llms files missing ${token}`);
  }

  checkBrandAndEmails('robots.txt', robots);
  checkBrandAndEmails('llms.txt', llms);
  checkBrandAndEmails('llms-full.txt', full);
}

function checkDiscoveryFiles() {
  const imageSitemapPath = path.join(publicDir, 'image-sitemap.xml');
  const manifestPath = path.join(publicDir, 'discovery-manifest.json');
  const securityPath = path.join(publicDir, '.well-known', 'security.txt');
  for (const [label, filePath] of [
    ['image-sitemap.xml', imageSitemapPath],
    ['discovery-manifest.json', manifestPath],
    ['.well-known/security.txt', securityPath],
    ['assets/img/og-image.png', path.join(publicDir, 'assets', 'img', 'og-image.png')],
  ]) {
    if (!existsSync(filePath)) fail(`missing landing discovery file: ${label}`);
  }
  if (!existsSync(imageSitemapPath) || !existsSync(manifestPath) || !existsSync(securityPath)) return;

  const imageSitemap = readFileSync(imageSitemapPath, 'utf8');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const security = readFileSync(securityPath, 'utf8');
  if ((imageSitemap.match(/<image:image>/g) ?? []).length < 20) {
    fail('image-sitemap.xml must include landing product and Warroom images');
  }
  if ((manifest.imageCount ?? 0) < 20) fail('discovery-manifest.json must track landing product and Warroom images');
  for (const token of ['Contact: mailto:security@flyto2.com', 'Canonical: https://flyto2.com/.well-known/security.txt']) {
    if (!security.includes(token)) fail(`security.txt missing ${token}`);
  }
  checkBrandAndEmails('image-sitemap.xml', imageSitemap);
  checkBrandAndEmails('discovery-manifest.json', JSON.stringify(manifest));
  checkBrandAndEmails('security.txt', security);
}

function newestKeywordMatrix() {
  if (!existsSync(seoDir)) return null;
  return readdirSync(seoDir)
    .filter((file) => /^keyword-matrix-\d{4}-\d{2}-\d{2}\.md$/.test(file))
    .map((file) => ({
      file,
      absolutePath: path.join(seoDir, file),
      date: file.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? '',
    }))
    .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

function checkKeywordMatrix() {
  const matrix = newestKeywordMatrix();
  if (!matrix) {
    fail('missing .seo/keyword-matrix-YYYY-MM-DD.md');
    return;
  }
  const ageMs = Date.now() - new Date(`${matrix.date}T00:00:00Z`).getTime();
  const ageDays = Math.floor(ageMs / 86_400_000);
  if (ageDays > maxKeywordMatrixAgeDays) {
    fail(`${matrix.file} is ${ageDays} days old; refresh search volume and long-tail data`);
  }

  const content = readFileSync(matrix.absolutePath, 'utf8');
  const stat = statSync(matrix.absolutePath);
  if (stat.size < 2000) fail(`${matrix.file} is too small to be a useful keyword evidence matrix`);
  for (const token of requiredKeywordMatrixTokens) {
    if (!content.includes(token)) fail(`${matrix.file} missing keyword evidence token: ${token}`);
  }
  for (const term of contractKeywordTerms().slice(0, 6)) {
    if (!content.toLowerCase().includes(term.toLowerCase())) {
      fail(`${matrix.file} missing manifest keyword term: ${term}`);
    }
  }
  checkBrandAndEmails(matrix.file, content);
}

checkSeoContract();
checkBuildOutput();
if (existsSync(path.join(appDir, 'sitemap.xml.body'))) {
  checkSitemap();
} else {
  fail('missing built sitemap.xml.body; run npm run build before npm run audit:seo');
}
checkRobotsAndLlms();
checkDiscoveryFiles();
checkKeywordMatrix();
for (const relativePath of ['lib/seo.ts', 'app/sitemap.ts', 'public/robots.txt', 'public/llms.txt', 'public/llms-full.txt', 'public/image-sitemap.xml']) {
  read(relativePath);
}

if (failures.length) {
  console.error('SEO surface audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO surface audit passed: ${checkedPages.length} pages, sitemap, robots, llms, keyword matrix`);
