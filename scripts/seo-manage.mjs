import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeHtmlEntities, escapeMarkdownCell, htmlToText } from './content-safety.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const seoDir = path.join(root, '.seo');
const appDir = path.join(root, '.next', 'server', 'app');
const reportDir = path.join(seoDir, 'reports');
const scoreReportPath = path.join(reportDir, 'seo-score.json');
const managementJsonPath = path.join(reportDir, 'seo-management.json');
const managementMdPath = path.join(reportDir, 'seo-management.md');
const searchConsoleDir = path.join(seoDir, 'search-console');
const minManagementScore = Number(process.env.SEO_MANAGEMENT_MIN_SCORE ?? 86);
const keywordMatrixMaxAgeDays = Number(process.env.SEO_KEYWORD_MATRIX_MAX_AGE_DAYS ?? 100);
const requireSearchConsole = String(process.env.SEO_MANAGEMENT_REQUIRE_GSC ?? 'false').toLowerCase() === 'true';

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
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

function decodeHtml(value) {
  return decodeHtmlEntities(value);
}

function stripHtml(html) {
  return htmlToText(html);
}

function visibleText(html) {
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return stripHtml(bodyMatch ? bodyMatch[1] : html);
}

function csvRows(filePath) {
  if (!existsSync(filePath)) return [];
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((header) => normalizeTerm(header).replace(/\s+/g, ''));
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  });
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

function keywordMatrixInfo() {
  const matrix = newestKeywordMatrix();
  if (!matrix) return { exists: false, ageDays: null, file: '', terms: [] };
  const text = readFileSync(matrix.absolutePath, 'utf8');
  const ageDays = Math.floor((Date.now() - new Date(`${matrix.date}T00:00:00Z`).getTime()) / 86_400_000);
  const terms = Array.from(text.matchAll(/`([^`]+)`/g), (match) => match[1])
    .filter((term) => /automation|agent|attack|surface|workflow|MCP|CTEM|browser|n8n/i.test(term));
  return {
    exists: true,
    ageDays,
    file: path.relative(root, matrix.absolutePath),
    size: statSync(matrix.absolutePath).size,
    terms,
  };
}

function contractInfo() {
  const manifestPath = path.join(seoDir, 'i18n-seo-manifest.json');
  if (!existsSync(manifestPath)) return { exists: false, clusterCount: 0, longTailCount: 0, terms: [] };
  const manifest = readJson(manifestPath);
  const clusters = manifest.surface?.keywordClusters ?? [];
  return {
    exists: true,
    clusterCount: clusters.length,
    longTailCount: clusters.reduce((sum, cluster) => sum + (cluster.longTail?.length ?? 0), 0),
    terms: clusters.flatMap((cluster) => [cluster.primary, ...(cluster.longTail ?? [])]).filter(Boolean),
  };
}

function discoveryInfo() {
  const files = {
    robots: path.join(root, 'public', 'robots.txt'),
    llms: path.join(root, 'public', 'llms.txt'),
    llmsFull: path.join(root, 'public', 'llms-full.txt'),
    imageSitemap: path.join(root, 'public', 'image-sitemap.xml'),
    manifest: path.join(root, 'public', 'discovery-manifest.json'),
    securityTxt: path.join(root, 'public', '.well-known', 'security.txt'),
  };
  const exists = Object.fromEntries(Object.entries(files).map(([key, filePath]) => [key, existsSync(filePath)]));
  const manifest = exists.manifest ? readJson(files.manifest) : {};
  return {
    exists,
    allPresent: Object.values(exists).every(Boolean),
    imageCount: manifest.imageCount ?? 0,
    routes: manifest.routes?.length ?? manifest.routeCount ?? 0,
  };
}

function searchConsoleInfo() {
  const queries = csvRows(path.join(searchConsoleDir, 'queries.csv'));
  const pages = csvRows(path.join(searchConsoleDir, 'pages.csv'));
  return {
    dataConnected: queries.length + pages.length > 0,
    rows: { queries: queries.length, pages: pages.length },
    files: {
      queries: path.relative(root, path.join(searchConsoleDir, 'queries.csv')),
      pages: path.relative(root, path.join(searchConsoleDir, 'pages.csv')),
    },
  };
}

function coverageGaps(contractTerms, scoreReport) {
  const haystack = scoreReport.pages.map((page) => {
    const htmlPath = path.join(appDir, page.path);
    const body = existsSync(htmlPath) ? visibleText(readFileSync(htmlPath, 'utf8')) : '';
    return `${page.focusKeyword} ${page.title} ${page.description} ${body}`;
  }).join(' ');
  return contractTerms
    .filter((term) => !includesTerm(haystack, term))
    .slice(0, 20)
    .map((term) => ({ term, action: `Map or refresh a landing/docs/blog section for "${term}".` }));
}

function pageOpportunities(scoreReport) {
  return scoreReport.pages
    .filter((page) => page.score < 96 || page.failedChecks.length)
    .sort((a, b) => a.score - b.score)
    .slice(0, 20)
    .map((page) => ({
      route: page.route,
      score: page.score,
      focusKeyword: page.focusKeyword,
      priority: page.score < 90 ? 'high' : page.score < 96 ? 'medium' : 'low',
      actions: page.failedChecks.slice(0, 5).map((check) => check.recommendation || check.name),
    }));
}

function addCheck(checks, name, points, pass, recommendation) {
  checks.push({ name, points, earned: pass ? points : 0, status: pass ? 'pass' : 'fail', recommendation: pass ? '' : recommendation });
}

function managementChecks({ scoreReport, matrix, contract, discovery, gsc, gaps }) {
  const checks = [];
  addCheck(checks, 'Score report present', 20, scoreReport.pages.length > 0, 'Run npm run seo:score after build.');
  addCheck(checks, 'Score gate healthy', 20, scoreReport.failures.length === 0, 'Fix failing page scores first.');
  addCheck(checks, 'Keyword matrix fresh', 15, matrix.exists && matrix.ageDays <= keywordMatrixMaxAgeDays && matrix.size >= 2000, 'Refresh .seo/keyword-matrix evidence.');
  addCheck(checks, 'Shared SEO contract synced', 15, contract.exists && contract.clusterCount >= 5 && contract.longTailCount >= 25, 'Run npm run seo:sync after flyto-i18n changes.');
  addCheck(checks, 'Discovery surfaces present', 10, discovery.allPresent && discovery.imageCount >= 20, 'Run npm run seo:discovery.');
  addCheck(checks, 'Long-tail route coverage', 10, gaps.length <= 8, 'Add route copy or internal links for uncovered contract terms.');
  addCheck(checks, 'Search Console policy satisfied', 5, gsc.dataConnected || !requireSearchConsole, 'Export GSC CSV data or keep SEO_MANAGEMENT_REQUIRE_GSC=false.');
  return checks;
}

function escapeCell(value) {
  return escapeMarkdownCell(value, /\n+/g);
}

function tableRows(rows, columns) {
  if (!rows.length) rows = [{}];
  return [
    `| ${columns.map((column) => column.label).join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${columns.map((column) => escapeCell(column.value(row) || 'none')).join(' | ')} |`),
  ].join('\n');
}

function writeReports(report) {
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(managementJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  const failures = report.failures.map((failure) => `- ${failure}`).join('\n') || '- none';
  const gscNote = report.gsc.dataConnected
    ? `Connected with ${report.gsc.rows.queries} query rows and ${report.gsc.rows.pages} page rows.`
    : `Not connected. Place Search Console CSV exports in ${path.relative(root, searchConsoleDir)} when data exists.`;

  writeFileSync(managementMdPath, `# Flyto2 Landing SEO Management Report

Generated: ${report.generatedAt}

| Metric | Value |
| --- | --- |
| Management score | ${report.managementScore} |
| Minimum score | ${report.thresholds.management} |
| Page average | ${report.score.averageScore} |
| Lowest page score | ${report.score.lowestScore} |
| Pages scored | ${report.score.pageCount}/${report.score.expectedPageCount} |
| Keyword clusters | ${report.contract.clusterCount} |
| Long-tail terms | ${report.contract.longTailCount} |
| Search Console | ${gscNote} |

## Failures

${failures}

## Management Checks

${tableRows(report.checks, [
  { label: 'Status', value: (row) => row.status },
  { label: 'Check', value: (row) => row.name },
  { label: 'Points', value: (row) => row.points ? `${row.earned}/${row.points}` : 'none' },
  { label: 'Recommendation', value: (row) => row.recommendation || 'none' },
])}

## Page Opportunities

${tableRows(report.pageOpportunities.slice(0, 15), [
  { label: 'Priority', value: (row) => row.priority },
  { label: 'Score', value: (row) => row.score },
  { label: 'Route', value: (row) => row.route },
  { label: 'Focus keyword', value: (row) => row.focusKeyword },
  { label: 'Next action', value: (row) => row.actions?.[0] ?? 'none' },
])}

## Long-Tail Gaps

${tableRows(report.coverageGaps.slice(0, 15), [
  { label: 'Term', value: (row) => row.term },
  { label: 'Action', value: (row) => row.action },
])}
`);
}

function main() {
  if (!existsSync(scoreReportPath)) throw new Error('missing .seo/reports/seo-score.json; run npm run build && npm run seo:score first');
  const scoreReport = readJson(scoreReportPath);
  const matrix = keywordMatrixInfo();
  const contract = contractInfo();
  const discovery = discoveryInfo();
  const gsc = searchConsoleInfo();
  const gaps = coverageGaps(contract.terms, scoreReport);
  const checks = managementChecks({ scoreReport, matrix, contract, discovery, gsc, gaps });
  const earned = checks.reduce((sum, check) => sum + check.earned, 0);
  const possible = checks.reduce((sum, check) => sum + check.points, 0);
  const managementScore = Math.round((earned / possible) * 100);
  const failures = checks.filter((check) => check.status === 'fail').map((check) => check.recommendation);
  if (managementScore < minManagementScore) failures.push(`management score ${managementScore} below ${minManagementScore}`);

  const report = {
    generatedAt: new Date().toISOString(),
    thresholds: { management: minManagementScore },
    managementScore,
    failures,
    checks,
    score: {
      averageScore: scoreReport.averageScore,
      lowestScore: scoreReport.lowestScore,
      pageCount: scoreReport.pageCount,
      expectedPageCount: scoreReport.expectedPageCount,
    },
    matrix,
    contract,
    discovery,
    gsc,
    coverageGaps: gaps,
    pageOpportunities: pageOpportunities(scoreReport),
  };

  writeReports(report);
  if (failures.length) {
    console.error('Landing SEO management gate failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    console.error('See .seo/reports/seo-management.md');
    process.exit(1);
  }
  console.log(`Landing SEO management gate passed: score ${managementScore}`);
}

main();
