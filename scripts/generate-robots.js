#!/usr/bin/env node
/**
 * generate-robots.js
 *
 * Generates robots.txt with whitelist-based approach.
 * Reads config from seo-config.json.
 *
 * Usage:
 *   node scripts/generate-robots.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'seo-config.json');
const seoConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const CONFIG = {
  baseUrl: seoConfig.baseUrl,
  outputPath: path.join(__dirname, '..', 'robots.txt'),
  pages: seoConfig.pages,
  blockedPages: seoConfig.blockedPages || [],
  blockedPaths: seoConfig.blockedPaths || [],
  blockedBots: seoConfig.blockedBots || [],
  crawlDelay: seoConfig.crawlDelay || 1
};

function getLanguageDirs() {
  const htmlDir = path.join(__dirname, '..');
  return fs.readdirSync(htmlDir)
    .filter(entry => {
      if (entry.length !== 2) return false;
      const fullPath = path.join(htmlDir, entry);
      return fs.statSync(fullPath).isDirectory() &&
             fs.existsSync(path.join(fullPath, 'index.html'));
    })
    .sort();
}

function generateRobotsTxt() {
  const langDirs = getLanguageDirs();

  // Get indexable pages
  const allowedPages = Object.entries(CONFIG.pages)
    .filter(([_, meta]) => meta.index !== false)
    .map(([page, _]) => page);

  const lines = [
    '# Flyto2 Robots.txt',
    '# Auto-generated from seo-config.json',
    `# Generated: ${new Date().toISOString().slice(0, 10)}`,
    '#',
    '# SEO Strategy: Whitelist-based indexing',
    '# Edit scripts/seo-config.json to modify',
    '',
    '# ===========================================',
    '# All Crawlers',
    '# ===========================================',
    'User-agent: *',
    '',
    '# Allowed: Root pages',
    'Allow: /$',
  ];

  // Allow root pages
  for (const page of allowedPages) {
    if (page !== 'index.html') {
      lines.push(`Allow: /${page}`);
    }
  }

  // Allow language directories
  lines.push('');
  lines.push('# Allowed: Language versions');
  for (const lang of langDirs) {
    lines.push(`Allow: /${lang}/$`);
    for (const page of allowedPages) {
      if (page !== 'index.html') {
        lines.push(`Allow: /${lang}/${page}`);
      }
    }
  }

  // Allow assets for rendering
  lines.push('');
  lines.push('# Allowed: Assets for page rendering');
  lines.push('Allow: /assets/css/');
  lines.push('Allow: /assets/img/');
  lines.push('Allow: /assets/fonts/');
  lines.push('Allow: /style.css');

  // Disallow blocked pages
  lines.push('');
  lines.push('# Blocked: Specific pages');
  for (const page of CONFIG.blockedPages) {
    lines.push(`Disallow: /${page}`);
  }

  // Disallow paths
  lines.push('');
  lines.push('# Blocked: Paths');
  for (const p of CONFIG.blockedPaths) {
    lines.push(`Disallow: ${p}`);
  }

  // Crawl delay
  lines.push('');
  lines.push('# Crawl settings');
  lines.push(`Crawl-delay: ${CONFIG.crawlDelay}`);

  // Sitemap
  lines.push('');
  lines.push('# ===========================================');
  lines.push('# Sitemap');
  lines.push('# ===========================================');
  lines.push(`Sitemap: ${CONFIG.baseUrl}/sitemap.xml`);

  // Blocked bots
  if (CONFIG.blockedBots.length > 0) {
    lines.push('');
    lines.push('# ===========================================');
    lines.push('# Blocked Bots (AI crawlers, etc.)');
    lines.push('# ===========================================');
    for (const bot of CONFIG.blockedBots) {
      lines.push('');
      lines.push(`User-agent: ${bot}`);
      lines.push('Disallow: /');
    }
  }

  lines.push('');

  const content = lines.join('\n');
  fs.writeFileSync(CONFIG.outputPath, content, 'utf8');

  console.log(`✅ robots.txt generated`);
  console.log(`   - ${allowedPages.length} allowed pages`);
  console.log(`   - ${langDirs.length} language directories`);
  console.log(`   - ${CONFIG.blockedPages.length + CONFIG.blockedPaths.length} blocked rules`);
  console.log(`   - ${CONFIG.blockedBots.length} blocked bots`);
}

generateRobotsTxt();
