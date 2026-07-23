import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(root, '.next', 'server', 'app');
const publicDir = path.join(root, 'public');
const seoDir = path.join(root, '.seo');
const reportDir = path.join(seoDir, 'reports');
const siteUrl = 'https://flyto2.com';
const pageThreshold = Number(process.env.SEO_PAGE_SCORE_THRESHOLD ?? 82);
const averageThreshold = Number(process.env.SEO_AVERAGE_SCORE_THRESHOLD ?? 88);
const homepageThreshold = Number(process.env.SEO_HOMEPAGE_SCORE_THRESHOLD ?? 88);
const legacyBrandPattern = new RegExp(`\\b${['Fly', 'to'].join('')}\\b`);

const routes = [
  '',
  'flow',
  'flow/mcp-builder',
  'flow/browser-automation',
  'flow/n8n-alternative',
  'warroom',
  'warroom/ctem',
  'warroom/security-validation',
  'warroom/attack-surface-management',
  'cloud',
  'cloud/recipes',
  'cloud/templates',
  'cloud/use-cases',
  'code',
  'security',
  'ctem',
  'attack-surface-management',
  'external-attack-surface-management',
  'dark-web-monitoring',
  'mssp-platform',
  'ai-security',
  'open-source',
  'n8n-alternative',
  'zapier-alternative',
  'make-alternative',
  'playwright-alternative',
  'langgraph-alternative',
  'aikido-alternative',
  'pricing',
  'enterprise',
  'airgap',
  'compare',
  'api-docs',
  'trust',
  'community',
  'docs',
  'blog',
  'changelog',
];

const focusByRoute = new Map([
  ['', 'Flyto2'],
  ['flow', 'AI workflow automation'],
  ['flow/mcp-builder', 'visual MCP builder'],
  ['flow/browser-automation', 'self-hosted browser automation'],
  ['flow/n8n-alternative', 'n8n alternative'],
  ['warroom', 'security validation'],
  ['warroom/ctem', 'continuous threat exposure management'],
  ['warroom/security-validation', 'security validation'],
  ['warroom/attack-surface-management', 'attack surface management'],
  ['cloud', 'AI workflow automation'],
  ['cloud/recipes', 'AI workflow automation examples'],
  ['cloud/templates', 'AI workflow automation templates'],
  ['cloud/use-cases', 'workflow automation use cases'],
  ['code', 'security war room'],
  ['security', 'security automation platform'],
  ['ctem', 'continuous threat exposure management'],
  ['attack-surface-management', 'attack surface management'],
  ['external-attack-surface-management', 'external attack surface management'],
  ['dark-web-monitoring', 'dark web monitoring'],
  ['mssp-platform', 'MSSP platform'],
  ['ai-security', 'AI security platform'],
  ['open-source', 'open source security war room'],
  ['n8n-alternative', 'n8n alternative'],
  ['zapier-alternative', 'Zapier alternative'],
  ['make-alternative', 'Make alternative'],
  ['playwright-alternative', 'Playwright alternative'],
  ['langgraph-alternative', 'LangGraph alternative'],
  ['aikido-alternative', 'Aikido alternative'],
  ['pricing', 'Flyto2 pricing'],
  ['enterprise', 'Flyto2 Enterprise'],
  ['airgap', 'enterprise airgap'],
  ['compare', 'attack surface management tools'],
  ['api-docs', 'MCP server automation'],
  ['trust', 'Flyto2 trust'],
  ['community', 'open-source AI workflow automation'],
  ['docs', 'Flyto2 docs'],
  ['blog', 'Flyto2 blog'],
  ['changelog', 'Flyto2 changelog'],
]);

function decodeHtml(value) {
  return String(value)
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
    if ((attributes[key] ?? '').toLowerCase() === wanted) return attributes.content ?? '';
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

function stripHtml(html) {
  return decodeHtml(String(html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' '));
}

function visibleText(html) {
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return stripHtml(bodyMatch ? bodyMatch[1] : html);
}

function textFromTag(html, tagName) {
  return Array.from(html.matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi')), (match) => stripHtml(match[1]));
}

function normalizeTerm(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesTerm(haystack, term) {
  return normalizeTerm(haystack).includes(normalizeTerm(term));
}

function wordList(text) {
  return String(text).toLowerCase().match(/[a-z0-9]+(?:[-'][a-z0-9]+)*/g) ?? [];
}

function wordCount(text) {
  return wordList(text).length;
}

function canonicalFor(route) {
  return route ? `${siteUrl}/${route}/` : `${siteUrl}/`;
}

function htmlPathFor(route) {
  return route ? path.join(appDir, 'en', `${route}.html`) : path.join(appDir, 'en.html');
}

function sitemapUrls() {
  const sitemapPath = path.join(appDir, 'sitemap.xml.body');
  if (!existsSync(sitemapPath)) return new Set();
  const sitemap = readFileSync(sitemapPath, 'utf8');
  return new Set(Array.from(sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/g), (match) => decodeHtml(match[1])));
}

function publicAssetExists(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.host !== 'flyto2.com') return true;
    return existsSync(path.join(publicDir, parsed.pathname.replace(/^\/+/, '')));
  } catch {
    return url.startsWith('/') && existsSync(path.join(publicDir, url.replace(/^\/+/, '')));
  }
}

function linkStats(html) {
  const links = getTags(html, 'a').map(attrs).map((attributes) => attributes.href).filter(Boolean);
  const internal = links.filter((href) => href.startsWith('/') || href.startsWith(siteUrl));
  const external = links.filter((href) => /^https?:\/\//.test(href) && !href.startsWith(siteUrl));
  return { total: links.length, internal: internal.length, external: external.length };
}

function imageStats(html) {
  const images = getTags(html, 'img').map(attrs).filter((image) => {
    const src = String(image.src ?? image.srcset ?? '');
    const className = String(image.class ?? '');
    return !className.includes('logo') && !src.includes('/flags/');
  });
  const missingAlt = images.filter((image) => !image.alt || image.alt.trim().length < 3);
  return { total: images.length, missingAlt: missingAlt.length };
}

function jsonLdTypes(html) {
  const types = [];
  const blocks = Array.from(html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi));
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(decodeHtml(block[1]));
      const nodes = Array.isArray(parsed) ? parsed : [parsed, ...(parsed['@graph'] ?? [])];
      for (const node of nodes) {
        const type = node?.['@type'];
        if (Array.isArray(type)) types.push(...type);
        else if (type) types.push(type);
      }
    } catch {
      types.push('invalid-json-ld');
    }
  }
  return types;
}

function noBadEmails(html) {
  const emails = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  return emails.every((email) => email.toLowerCase().endsWith('@flyto2.com'));
}

function scoreItem(items, category, name, points, pass, recommendation, details = {}) {
  items.push({
    category,
    name,
    points,
    earned: pass ? points : 0,
    status: pass ? 'pass' : 'fail',
    recommendation: pass ? '' : recommendation,
    details,
  });
}

function scoreRange(items, category, name, points, value, min, max, recommendation) {
  scoreItem(items, category, name, points, value >= min && value <= max, recommendation, { value, min, max });
}

function scorePage(route, html, sitemap) {
  const title = titleFrom(html);
  const description = findMeta(html, 'name', 'description');
  const canonical = findLink(html, 'canonical');
  const robots = findMeta(html, 'name', 'robots');
  const ogImage = findMeta(html, 'property', 'og:image');
  const twitterImage = findMeta(html, 'name', 'twitter:image');
  const h1s = textFromTag(html, 'h1');
  const h2s = textFromTag(html, 'h2');
  const text = visibleText(html);
  const focusKeyword = focusByRoute.get(route) ?? route.replace(/[-/]/g, ' ');
  const links = linkStats(html);
  const images = imageStats(html);
  const schemaTypes = jsonLdTypes(html);
  const expectedCanonical = canonicalFor(route);
  const intro = text.slice(0, Math.max(420, Math.floor(text.length * 0.12)));
  const items = [];

  scoreRange(items, 'technical', 'SEO title length', 5, title.length, route ? 18 : 20, 70, 'Set a clear title between 18 and 70 characters.');
  scoreRange(items, 'technical', 'Meta description length', 5, description.length, 50, 180, 'Set a meta description between 50 and 180 characters.');
  scoreItem(items, 'technical', 'Canonical URL', 5, canonical === expectedCanonical, `Expected canonical ${expectedCanonical}.`, { canonical });
  scoreItem(items, 'technical', 'Robots indexable', 3, robots.toLowerCase().includes('index'), 'Use an indexable robots meta tag.', { robots });
  scoreItem(items, 'technical', 'OpenGraph complete', 4, ['og:title', 'og:description', 'og:image', 'og:url'].every((name) => findMeta(html, 'property', name)), 'Add complete OpenGraph metadata.');
  scoreItem(items, 'technical', 'Twitter card complete', 3, ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].every((name) => findMeta(html, 'name', name)), 'Add complete Twitter card metadata.');
  scoreItem(items, 'technical', 'JSON-LD present', 4, schemaTypes.length > 0 && !schemaTypes.includes('invalid-json-ld'), 'Add valid JSON-LD structured data.', { schemaTypes });
  scoreItem(items, 'technical', 'Hreflang alternates', 4, Boolean(findLink(html, 'alternate', 'en') && findLink(html, 'alternate', 'x-default')), 'Add en and x-default hreflang links.');
  scoreItem(items, 'technical', 'Sitemap inclusion', 4, sitemap.has(expectedCanonical), 'Include the canonical URL in sitemap.xml.', { expectedCanonical });

  scoreItem(items, 'keyword', 'Focus keyword in title', 5, includesTerm(title, focusKeyword), `Use focus keyword in the title: ${focusKeyword}.`);
  scoreItem(items, 'keyword', 'Focus keyword in description', 5, includesTerm(description, focusKeyword), `Use focus keyword in meta description: ${focusKeyword}.`);
  scoreItem(items, 'keyword', 'Focus keyword in H1', 4, h1s.some((h1) => includesTerm(h1, focusKeyword)), `Use focus keyword in H1: ${focusKeyword}.`, { h1s });
  scoreItem(items, 'keyword', 'Focus keyword in intro', 4, includesTerm(intro, focusKeyword), `Mention focus keyword early: ${focusKeyword}.`);
  scoreItem(items, 'keyword', 'Related entity terms', 4, ['Flyto2', 'open source', 'MCP', 'evidence', 'automation'].filter((term) => includesTerm(text, term)).length >= 3, 'Use related entity terms naturally in body copy.');

  scoreItem(items, 'content', 'Word count', 5, wordCount(text) >= (route ? 260 : 360), 'Add enough useful body copy for the search intent.', { wordCount: wordCount(text) });
  scoreItem(items, 'content', 'Heading structure', 4, h1s.length === 1 && h2s.length >= (route ? 2 : 3), 'Use exactly one H1 and enough H2 sections.', { h1s: h1s.length, h2s: h2s.length });
  scoreItem(items, 'content', 'Answer-shaped sections', 4, /what|how|why|compare|pricing|install|question|FAQ|Frequently/i.test(`${h2s.join(' ')} ${text.slice(0, 900)}`), 'Add answer-shaped sections that match long-tail search intent.');

  scoreItem(items, 'links_images', 'Internal links', 5, links.internal >= (route ? 2 : 6), 'Add relevant internal links to product, docs, or blog pages.', links);
  scoreItem(items, 'links_images', 'External authority links', 3, route === '' || route === 'cloud' || links.external >= 1, 'Add at least one useful external authority or distribution link where relevant.', links);
  scoreItem(items, 'links_images', 'Image alt text', 4, images.missingAlt === 0, 'Add descriptive alt text to every image.', images);
  scoreItem(items, 'links_images', 'Social image reachable', 4, publicAssetExists(ogImage) && publicAssetExists(twitterImage), 'Point social images to existing public assets.', { ogImage, twitterImage });

  scoreItem(items, 'ai_visibility', 'Entity clarity', 4, includesTerm(text, 'Flyto2') && includesTerm(text, focusKeyword), 'Make the entity and topic explicit in body copy.');
  scoreItem(items, 'ai_visibility', 'Evidence path', 3, includesTerm(text, 'docs') || includesTerm(text, 'GitHub') || includesTerm(text, 'source') || includesTerm(text, 'evidence'), 'Point readers and AI systems to durable evidence paths.');
  scoreItem(items, 'ai_visibility', 'No legacy brand text', 4, !legacyBrandPattern.test(html), 'Use Flyto2 consistently across rendered HTML.');
  scoreItem(items, 'ai_visibility', 'Flyto2 email hygiene', 4, noBadEmails(html), 'Use only @flyto2.com email addresses in public content.');

  const earned = items.reduce((sum, item) => sum + item.earned, 0);
  const possible = items.reduce((sum, item) => sum + item.points, 0);
  const failedChecks = items.filter((item) => item.status === 'fail');
  return {
    route: route || '/',
    path: route ? `en/${route}.html` : 'en.html',
    canonical: expectedCanonical,
    focusKeyword,
    score: Math.round((earned / possible) * 100),
    title,
    description,
    wordCount: wordCount(text),
    internalLinks: links.internal,
    externalLinks: links.external,
    images: images.total,
    failedChecks: failedChecks.map((item) => ({
      category: item.category,
      name: item.name,
      points: item.points,
      recommendation: item.recommendation,
      details: item.details,
    })),
  };
}

function writeReports(report) {
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(path.join(reportDir, 'seo-score.json'), `${JSON.stringify(report, null, 2)}\n`);
  const rows = report.pages
    .slice()
    .sort((a, b) => a.score - b.score)
    .map((page) => `| ${page.score} | ${page.route} | ${page.focusKeyword} | ${page.failedChecks.slice(0, 3).map((check) => check.name).join('; ') || 'none'} |`)
    .join('\n');
  const failures = report.failures.map((failure) => `- ${failure}`).join('\n') || '- none';
  writeFileSync(path.join(reportDir, 'seo-score.md'), `# Flyto2 Landing SEO Score Report

Generated: ${report.generatedAt}

| Metric | Value |
| --- | --- |
| Pages | ${report.pageCount} |
| Average score | ${report.averageScore} |
| Lowest score | ${report.lowestScore} |
| Page threshold | ${report.thresholds.page} |
| Homepage threshold | ${report.thresholds.homepage} |
| Average threshold | ${report.thresholds.average} |

## Failures

${failures}

## Lowest Pages

| Score | Route | Focus keyword | Top issues |
| --- | --- | --- | --- |
${rows}
`);
}

function main() {
  if (!existsSync(appDir)) throw new Error('missing .next/server/app; run npm run build first');
  const sitemap = sitemapUrls();
  const missing = [];
  const pages = [];
  for (const route of routes) {
    const htmlPath = htmlPathFor(route);
    if (!existsSync(htmlPath)) {
      missing.push(route || '/');
      continue;
    }
    pages.push(scorePage(route, readFileSync(htmlPath, 'utf8'), sitemap));
  }
  const averageScore = Math.round(pages.reduce((sum, page) => sum + page.score, 0) / Math.max(1, pages.length));
  const lowestScore = Math.min(...pages.map((page) => page.score));
  const failures = missing.map((route) => `missing build output for ${route}`);
  for (const page of pages) {
    const threshold = page.route === '/' ? homepageThreshold : pageThreshold;
    if (page.score < threshold) failures.push(`${page.route} scored ${page.score}, below ${threshold}`);
  }
  if (averageScore < averageThreshold) failures.push(`average score ${averageScore} below ${averageThreshold}`);

  const report = {
    generatedAt: new Date().toISOString(),
    thresholds: { page: pageThreshold, homepage: homepageThreshold, average: averageThreshold },
    pageCount: pages.length,
    expectedPageCount: routes.length,
    averageScore,
    lowestScore,
    failures,
    pages,
    referenceModel: {
      name: 'Rank Math-style CI scorer',
      categories: ['technical', 'keyword', 'content', 'links_images', 'ai_visibility'],
      source: 'Built from Flyto2 static output, sitemap, and the shared i18n SEO contract.',
    },
  };

  writeReports(report);
  if (failures.length) {
    console.error('Landing SEO score gate failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    console.error('See .seo/reports/seo-score.md');
    process.exit(1);
  }
  console.log(`Landing SEO score gate passed: average ${averageScore}, lowest ${lowestScore}, pages ${pages.length}`);
}

main();
