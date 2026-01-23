#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Generates sitemap.xml with full hreflang coverage.
 *
 * Usage:
 *   node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  htmlDir: path.join(__dirname, '..'),
  i18nDir: path.join(__dirname, '..', '..', 'flyto-i18n', 'locales'),
  htmlFiles: [
    'index.html',
    'pricing.html',
    'download.html',
    'app.html',
    'faq.html',
    'contact.html',
    'buy-offline.html',
    'language-packs.html',
    'product.html',
    'use-cases.html',
    'compare.html',
    'philosophy.html',
    'about.html',
    'blog.html'
  ],
  localeEntries: [],
  pageMeta: {
    'index.html': { changefreq: 'weekly', priority: '1.0' },
    'pricing.html': { changefreq: 'weekly', priority: '0.9' },
    'download.html': { changefreq: 'monthly', priority: '0.8' },
    'app.html': { changefreq: 'monthly', priority: '0.8' },
    'faq.html': { changefreq: 'monthly', priority: '0.7' },
    'contact.html': { changefreq: 'monthly', priority: '0.6' },
    'buy-offline.html': { changefreq: 'monthly', priority: '0.7' },
    'language-packs.html': { changefreq: 'monthly', priority: '0.6' },
    'about.html': { changefreq: 'monthly', priority: '0.6' },
    'product.html': { changefreq: 'monthly', priority: '0.7' },
    'philosophy.html': { changefreq: 'monthly', priority: '0.5' },
    'use-cases.html': { changefreq: 'monthly', priority: '0.6' },
    'compare.html': { changefreq: 'monthly', priority: '0.6' },
    'blog.html': { changefreq: 'weekly', priority: '0.6' }
  }
};

function getLocalesFromI18n() {
  if (!fs.existsSync(CONFIG.i18nDir)) {
    console.warn(`⚠️  i18n directory not found: ${CONFIG.i18nDir}`);
    return [];
  }

  return fs.readdirSync(CONFIG.i18nDir)
    .filter((entry) => {
      if (entry.startsWith('.')) {
        return false;
      }
      const fullPath = path.join(CONFIG.i18nDir, entry);
      return fs.statSync(fullPath).isDirectory() && entry.toLowerCase() !== 'en';
    })
    .sort();
}

function localeToDir(locale) {
  const normalized = locale.replace('_', '-');
  const lower = normalized.toLowerCase();
  if (lower.startsWith('zh')) {
    return 'zh';
  }
  if (lower.startsWith('pt-')) {
    return 'pt';
  }
  return normalized.split('-')[0].toLowerCase();
}

function normalizeHreflang(locale) {
  const normalized = locale.replace('_', '-');
  const lower = normalized.toLowerCase();
  if (lower.startsWith('zh')) {
    if (lower.includes('hant') || lower.includes('tw') || lower.includes('hk') || lower.includes('mo')) {
      return 'zh-Hant';
    }
    if (lower.includes('hans') || lower.includes('cn') || lower.includes('sg')) {
      return 'zh-Hans';
    }
    return 'zh';
  }
  return normalized;
}

function resolveLocales() {
  const locales = getLocalesFromI18n();
  const localeEntries = [];
  const seenDirs = new Set();

  for (const locale of locales) {
    const dir = localeToDir(locale);
    if (seenDirs.has(dir)) {
      console.warn(`⚠️  Skipping locale ${locale} - output dir "${dir}" already used`);
      continue;
    }
    seenDirs.add(dir);
    localeEntries.push({
      locale,
      dir,
      hreflang: normalizeHreflang(locale)
    });
  }

  return localeEntries;
}

function pagePath(htmlFile) {
  return htmlFile === 'index.html' ? '' : htmlFile;
}

function buildUrl(localeDir, pagePathValue) {
  if (!pagePathValue) {
    return localeDir === 'en' ? 'https://flyto2.com/' : `https://flyto2.com/${localeDir}/`;
  }
  return localeDir === 'en'
    ? `https://flyto2.com/${pagePathValue}`
    : `https://flyto2.com/${localeDir}/${pagePathValue}`;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getLastmod(localeDir, htmlFile) {
  const localizedPath = localeDir === 'en'
    ? path.join(CONFIG.htmlDir, htmlFile)
    : path.join(CONFIG.htmlDir, localeDir, htmlFile);
  const fallbackPath = path.join(CONFIG.htmlDir, htmlFile);

  if (fs.existsSync(localizedPath)) {
    return formatDate(fs.statSync(localizedPath).mtime);
  }
  if (fs.existsSync(fallbackPath)) {
    return formatDate(fs.statSync(fallbackPath).mtime);
  }
  return formatDate(new Date());
}

function buildAlternateLinks(pagePathValue) {
  const links = [
    `\t\t<xhtml:link rel="alternate" hreflang="en" href="${buildUrl('en', pagePathValue)}"/>`
  ];
  for (const entry of CONFIG.localeEntries) {
    links.push(`\t\t<xhtml:link rel="alternate" hreflang="${entry.hreflang}" href="${buildUrl(entry.dir, pagePathValue)}"/>`);
  }
  links.push(`\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${buildUrl('en', pagePathValue)}"/>`);
  return links.join('\n');
}

function buildUrlEntry(localeDir, htmlFile) {
  const pagePathValue = pagePath(htmlFile);
  const loc = buildUrl(localeDir, pagePathValue);
  const lastmod = getLastmod(localeDir, htmlFile);
  const meta = CONFIG.pageMeta[htmlFile] || { changefreq: 'monthly', priority: '0.5' };
  const alternates = buildAlternateLinks(pagePathValue);

  return [
    '\t<url>',
    `\t\t<loc>${loc}</loc>`,
    alternates,
    `\t\t<lastmod>${lastmod}</lastmod>`,
    `\t\t<changefreq>${meta.changefreq}</changefreq>`,
    `\t\t<priority>${meta.priority}</priority>`,
    '\t</url>'
  ].join('\n');
}

function generateSitemap() {
  CONFIG.localeEntries = resolveLocales();
  const header = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  ];

  const body = [];
  for (const htmlFile of CONFIG.htmlFiles) {
    body.push(buildUrlEntry('en', htmlFile));
  }
  for (const entry of CONFIG.localeEntries) {
    for (const htmlFile of CONFIG.htmlFiles) {
      body.push(buildUrlEntry(entry.dir, htmlFile));
    }
  }

  const footer = ['</urlset>', ''];
  const xml = [...header, ...body, ...footer].join('\n');

  const outputPath = path.join(CONFIG.htmlDir, 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`✅ sitemap.xml generated (${CONFIG.localeEntries.length + 1} locales)`);
}

generateSitemap();
