#!/usr/bin/env node
/**
 * build-i18n.js
 *
 * Builds multi-language HTML files by replacing data-i18n content with translations.
 * Generates /zh/, /ja/ etc. directories with translated HTML.
 *
 * Usage:
 *   node scripts/build-i18n.js
 *   node scripts/build-i18n.js --locale zh-TW  (build specific locale only)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  htmlDir: path.join(__dirname, '..'),
  i18nDir: path.join(__dirname, '..', '..', 'flyto-i18n', 'locales'),
  htmlFiles: ['index.html', 'pricing.html', 'download.html', 'app.html', 'faq.html', 'contact.html', 'buy-offline.html', 'language-packs.html', 'product.html', 'use-cases.html', 'compare.html', 'philosophy.html', 'about.html', 'blog.html'],
  locales: [],
  localeMapping: {},
  localeEntries: []
};

// Parse command line args
const specificLocale = process.argv.find(arg => arg.startsWith('--locale='))?.split('=')[1];

// Load all translations for a locale
function loadTranslations(locale) {
  const translations = {};
  const localeDir = path.join(CONFIG.i18nDir, locale);

  if (!fs.existsSync(localeDir)) {
    console.warn(`⚠️  Locale directory not found: ${localeDir}`);
    return translations;
  }

  const files = fs.readdirSync(localeDir).filter(f => f.startsWith('landing.') && f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(localeDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (content.translations) {
      Object.assign(translations, content.translations);
    }
  }

  return translations;
}

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

function normalizeLangAttr(locale) {
  return locale.replace('_', '-');
}

function resolveLocales(targetLocale) {
  const locales = targetLocale ? [targetLocale] : getLocalesFromI18n();
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

  const localeMapping = Object.fromEntries(localeEntries.map(entry => [entry.locale, entry.dir]));
  return { locales: localeEntries.map(entry => entry.locale), localeMapping, localeEntries };
}

// Replace data-i18n content in HTML
function translateHtml(html, translations, locale, htmlFile) {
  // Replace content inside elements with data-i18n attribute
  // Pattern: <tag data-i18n="key">original content</tag>
  let translated = html.replace(
    /(<[^>]+data-i18n="([^"]+)"[^>]*>)([^<]*?)(<\/[^>]+>)/g,
    (match, openTag, key, content, closeTag) => {
      const translation = translations[key];
      if (translation && translation.trim() !== '') {
        return `${openTag}${translation}${closeTag}`;
      }
      return match; // Keep original if no translation
    }
  );

  // Update canonical, hreflang tags, og:url, og:locale, and meta descriptions
  translated = updateSeoLinks(translated, locale, htmlFile, translations);

  // Update html lang attribute
  const langCode = normalizeLangAttr(locale);
  translated = translated.replace(/<html([^>]*)lang="en"/, `<html$1lang="${langCode}"`);

  // Update language switcher active state
  const localeDir = CONFIG.localeMapping[locale] || locale.toLowerCase();
  translated = updateLangSwitcher(translated, localeDir);

  return translated;
}

// Update language switcher active class
function updateLangSwitcher(html, currentLocale) {
  // Remove active class from English and add to current locale
  html = html.replace(
    /<a href="\/" class="lang-option active"/g,
    '<a href="/" class="lang-option"'
  );

  // Add active class to current locale
  const pattern = new RegExp(`<a href="/${currentLocale}/" class="lang-option"`, 'g');
  html = html.replace(pattern, `<a href="/${currentLocale}/" class="lang-option active"`);

  // Update current-lang display
  const langNames = {
    'zh': 'ZH',
    'ja': 'JA',
    'ko': 'KO',
    'de': 'DE',
    'es': 'ES',
    'fr': 'FR',
    'it': 'IT',
    'pt': 'PT',
    'vi': 'VI',
    'id': 'ID',
    'th': 'TH',
    'tr': 'TR',
    'pl': 'PL',
    'hi': 'HI'
  };
  const displayLang = langNames[currentLocale] || currentLocale.toUpperCase() || 'EN';
  html = html.replace(
    /<span class="current-lang">EN<\/span>/g,
    `<span class="current-lang">${displayLang}</span>`
  );

  return html;
}

// Update canonical, hreflang, og:url, og:locale, and meta descriptions for localized pages
function updateSeoLinks(html, locale, htmlFile, translations) {
  const localeDir = CONFIG.localeMapping[locale] || locale.toLowerCase();
  const pagePath = htmlFile === 'index.html' ? '' : htmlFile;
  const localizedUrl = buildPageUrl(localeDir, pagePath);

  // Update canonical link
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${localizedUrl}">`
  );

  // Update og:url meta
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${localizedUrl}">`
  );

  // Update og:locale meta
  const ogLocale = getOgLocale(locale);
  html = html.replace(
    /<meta property="og:locale" content="[^"]*"\s*\/?>/,
    `<meta property="og:locale" content="${ogLocale}">`
  );

  // Update meta description from translations
  const pageKey = htmlFile.replace('.html', '').replace('-', '');
  const metaDescKey = `landing.meta.${pageKey}.description`;
  const ogDescKey = `landing.meta.${pageKey}.ogDescription`;

  if (translations[metaDescKey]) {
    html = html.replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(translations[metaDescKey])}">`
    );
  }

  // Update og:description
  const ogDesc = translations[ogDescKey] || translations[metaDescKey];
  if (ogDesc) {
    html = html.replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeHtml(ogDesc)}">`
    );
  }

  // Update twitter:description
  if (translations[metaDescKey]) {
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeHtml(translations[metaDescKey].substring(0, 200))}">`
    );
  }

  // Update page title
  const titleKey = `landing.meta.${pageKey}.title`;
  if (translations[titleKey]) {
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(translations[titleKey])}</title>`
    );
  }

  // Update og:title
  const ogTitleKey = `landing.meta.${pageKey}.ogTitle`;
  const ogTitle = translations[ogTitleKey] || translations[titleKey];
  if (ogTitle) {
    html = html.replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeHtml(ogTitle)}">`
    );
  }

  // Update twitter:title
  if (ogTitle) {
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeHtml(ogTitle)}">`
    );
  }

  // Update keywords
  const keywordsKey = `landing.meta.${pageKey}.keywords`;
  if (translations[keywordsKey]) {
    html = html.replace(
      /<meta name="keywords" content="[^"]*"\s*\/?>/,
      `<meta name="keywords" content="${escapeHtml(translations[keywordsKey])}">`
    );
  }

  // Remove existing hreflang tags and insert fresh set after canonical
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]*"\s*\/?>\s*/g, '');
  const hreflangTags = buildHreflangTags(pagePath);
  html = html.replace(
    /(<link rel="canonical"[^>]+>)/,
    `$1${hreflangTags}`
  );

  return html;
}

// Get og:locale format from locale code
function getOgLocale(locale) {
  const localeMap = {
    'ja': 'ja_JP',
    'zh-TW': 'zh_TW',
    'zh_TW': 'zh_TW',
    'ko': 'ko_KR',
    'de': 'de_DE',
    'es': 'es_ES',
    'fr': 'fr_FR',
    'it': 'it_IT',
    'pt-BR': 'pt_BR',
    'vi': 'vi_VN',
    'id': 'id_ID',
    'th': 'th_TH',
    'tr': 'tr_TR',
    'pl': 'pl_PL',
    'hi': 'hi_IN'
  };
  return localeMap[locale] || 'en_US';
}

// Escape HTML special characters
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildPageUrl(localeDir, pagePath) {
  if (!pagePath) {
    return localeDir === 'en' ? 'https://flyto2.com/' : `https://flyto2.com/${localeDir}/`;
  }
  return localeDir === 'en'
    ? `https://flyto2.com/${pagePath}`
    : `https://flyto2.com/${localeDir}/${pagePath}`;
}

function buildHreflangTags(pagePath) {
  const tags = CONFIG.localeEntries.map((entry) => {
    const url = buildPageUrl(entry.dir, pagePath);
    return `\t<link rel="alternate" hreflang="${entry.hreflang}" href="${url}" />`;
  });
  tags.unshift(`\t<link rel="alternate" hreflang="en" href="${buildPageUrl('en', pagePath)}" />`);
  tags.push(`\t<link rel="alternate" hreflang="x-default" href="${buildPageUrl('en', pagePath)}" />`);
  return `\n${tags.join('\n')}`;
}

// Fix relative paths for subdirectory
function fixRelativePaths(html) {
  // Fix asset paths: assets/ -> ../assets/
  html = html.replace(/href="assets\//g, 'href="../assets/');
  html = html.replace(/src="assets\//g, 'src="../assets/');

  // Fix page links for same directory
  html = html.replace(/href="([a-z-]+\.html)"/g, 'href="$1"');

  return html;
}

// Main function
function main() {
  console.log('🏗️  Building multi-language HTML files...\n');
  const resolved = resolveLocales(specificLocale);
  CONFIG.locales = resolved.locales;
  CONFIG.localeMapping = resolved.localeMapping;
  CONFIG.localeEntries = resolved.localeEntries;

  if (CONFIG.locales.length === 0) {
    console.warn('⚠️  No locales found to build.');
  }

  for (const locale of CONFIG.locales) {
    console.log(`\n🌐 Building locale: ${locale}`);

    // Load translations
    const translations = loadTranslations(locale);
    const keyCount = Object.keys(translations).length;
    const filledCount = Object.values(translations).filter(v => v && v.trim() !== '').length;

    console.log(`   📊 Translations: ${filledCount}/${keyCount} keys filled`);

    if (filledCount === 0) {
      console.log(`   ⏭️  Skipping - no translations available`);
      continue;
    }

    // Create output directory
    const outputDir = path.join(CONFIG.htmlDir, CONFIG.localeMapping[locale] || locale.toLowerCase());
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Process each HTML file
    for (const htmlFile of CONFIG.htmlFiles) {
      const sourcePath = path.join(CONFIG.htmlDir, htmlFile);

      if (!fs.existsSync(sourcePath)) {
        continue;
      }

      let html = fs.readFileSync(sourcePath, 'utf8');

      // Translate content
      html = translateHtml(html, translations, locale, htmlFile);

      // Fix relative paths
      html = fixRelativePaths(html);

      // Write output
      const outputPath = path.join(outputDir, htmlFile);
      fs.writeFileSync(outputPath, html);

      console.log(`   ✅ ${htmlFile}`);
    }
  }

  updateEnglishSeo();
  console.log('\n✅ Build complete!');
}

function updateEnglishSeo() {
  if (CONFIG.localeEntries.length === 0) {
    return;
  }
  console.log('\n🔧 Updating English SEO tags...');
  const translations = loadTranslations('en');
  for (const htmlFile of CONFIG.htmlFiles) {
    const sourcePath = path.join(CONFIG.htmlDir, htmlFile);
    if (!fs.existsSync(sourcePath)) {
      continue;
    }

    let html = fs.readFileSync(sourcePath, 'utf8');
    html = updateSeoLinks(html, 'en', htmlFile, translations);
    fs.writeFileSync(sourcePath, html);
    console.log(`   ✅ ${htmlFile}`);
  }
}

main();
