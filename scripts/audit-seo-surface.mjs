import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(root, '.next', 'server', 'app');
const publicDir = path.join(root, 'public');
const seoDir = path.join(root, '.seo');

const checkedPages = [
  { name: 'home', file: 'en.html', canonical: 'https://flyto2.com/', terms: ['AI workflow automation', 'MCP-native', 'CTEM'] },
  { name: 'ctem', file: 'en/ctem.html', canonical: 'https://flyto2.com/ctem/', terms: ['CTEM', 'evidence', 'remediation'] },
  { name: 'attack surface management', file: 'en/attack-surface-management.html', canonical: 'https://flyto2.com/attack-surface-management/', terms: ['attack surface management'] },
  { name: 'external attack surface management', file: 'en/external-attack-surface-management.html', canonical: 'https://flyto2.com/external-attack-surface-management/', terms: ['external attack surface'] },
  { name: 'open source', file: 'en/open-source.html', canonical: 'https://flyto2.com/open-source/', terms: ['open source', 'Warroom CE'] },
  { name: 'aikido alternative', file: 'en/aikido-alternative.html', canonical: 'https://flyto2.com/aikido-alternative/', terms: ['Aikido alternative'] },
  { name: 'security hub', file: 'en/security.html', canonical: 'https://flyto2.com/security/', terms: ['security'] },
  { name: 'pricing', file: 'en/pricing.html', canonical: 'https://flyto2.com/pricing/', terms: ['pricing'] },
  { name: 'enterprise', file: 'en/enterprise.html', canonical: 'https://flyto2.com/enterprise/', terms: ['Enterprise'] },
  { name: 'compare', file: 'en/compare.html', canonical: 'https://flyto2.com/compare/', terms: ['compare'] },
  { name: 'api docs', file: 'en/api-docs.html', canonical: 'https://flyto2.com/api-docs/', terms: ['API'] },
  { name: 'trust', file: 'en/trust.html', canonical: 'https://flyto2.com/trust/', terms: ['trust'] },
  { name: 'docs bridge', file: 'en/docs.html', canonical: 'https://flyto2.com/docs/', terms: ['docs'] },
  { name: 'blog bridge', file: 'en/blog.html', canonical: 'https://flyto2.com/blog/', terms: ['blog'] },
  { name: 'airgap', file: 'en/airgap.html', canonical: 'https://flyto2.com/airgap/', terms: ['airgap'] },
  { name: 'changelog', file: 'en/changelog.html', canonical: 'https://flyto2.com/changelog/', terms: ['changelog'] },
];

const sitemapRequiredUrls = checkedPages.map((page) => page.canonical);
const requiredSitemapAlternates = ['hreflang="en-US"', 'hreflang="zh-Hant-TW"', 'hreflang="x-default"'];
const requiredRobotsTokens = [
  'Sitemap: https://flyto2.com/sitemap.xml',
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
  const standaloneFlyto = content.match(/\bFlyto\b/g);
  if (standaloneFlyto) fail(`${label} contains standalone "Flyto"; use Flyto2 unless referring to repo IDs`);

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
  const xDefault = findLink(html, 'alternate', 'x-default');
  const enAlternate = findLink(html, 'alternate', 'en-US');

  checkLength(`${page.name} title`, title, 10, 70);
  checkLength(`${page.name} description`, description, 50, 180);
  if (canonical !== page.canonical) fail(`${page.name} canonical mismatch: expected ${page.canonical}, got ${canonical || '(missing)'}`);
  if (ogUrl !== page.canonical) fail(`${page.name} og:url mismatch: expected ${page.canonical}, got ${ogUrl || '(missing)'}`);
  if (xDefault !== page.canonical) fail(`${page.name} x-default mismatch: expected ${page.canonical}, got ${xDefault || '(missing)'}`);
  if (enAlternate !== page.canonical) fail(`${page.name} en-US alternate mismatch: expected ${page.canonical}, got ${enAlternate || '(missing)'}`);
  if (!robots.toLowerCase().includes('index')) fail(`${page.name} robots tag must be indexable; got ${robots || '(missing)'}`);

  for (const [label, value] of [
    ['og:title', ogTitle],
    ['og:description', ogDescription],
    ['og:image', ogImage],
    ['twitter:card', twitterCard],
    ['twitter:title', twitterTitle],
    ['twitter:description', twitterDescription],
  ]) {
    if (!value) fail(`${page.name} missing ${label}`);
  }

  if (!html.includes('application/ld+json')) fail(`${page.name} missing JSON-LD`);
  for (const term of page.terms) {
    if (!html.toLowerCase().includes(term.toLowerCase())) fail(`${page.name} missing SEO intent term: ${term}`);
  }
  checkBrandAndEmails(page.name, html);
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
  checkBrandAndEmails(matrix.file, content);
}

checkBuildOutput();
if (existsSync(path.join(appDir, 'sitemap.xml.body'))) {
  checkSitemap();
} else {
  fail('missing built sitemap.xml.body; run npm run build before npm run audit:seo');
}
checkRobotsAndLlms();
checkKeywordMatrix();
for (const relativePath of ['lib/seo.ts', 'app/sitemap.ts', 'public/robots.txt', 'public/llms.txt', 'public/llms-full.txt']) {
  read(relativePath);
}

if (failures.length) {
  console.error('SEO surface audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO surface audit passed: ${checkedPages.length} pages, sitemap, robots, llms, keyword matrix`);
