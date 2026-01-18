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
  // All 15 supported languages (excluding 'en' which is the source)
  locales: ['zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'it', 'pt-BR', 'vi', 'id', 'th', 'tr', 'pl', 'hi'],
  localeMapping: {
    'zh-TW': 'zh',
    'ja': 'ja',
    'ko': 'ko',
    'de': 'de',
    'es': 'es',
    'fr': 'fr',
    'it': 'it',
    'pt-BR': 'pt',
    'vi': 'vi',
    'id': 'id',
    'th': 'th',
    'tr': 'tr',
    'pl': 'pl',
    'hi': 'hi'
  }
};

// Parse command line args
const specificLocale = process.argv.find(arg => arg.startsWith('--locale='))?.split('=')[1];
if (specificLocale) {
  CONFIG.locales = [specificLocale];
}

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

// Replace data-i18n content in HTML
function translateHtml(html, translations, locale) {
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

  // Update hreflang tags
  translated = updateHreflangTags(translated, locale);

  // Update html lang attribute
  const langCode = CONFIG.localeMapping[locale] || locale.split('-')[0];
  translated = translated.replace(/<html([^>]*)lang="en"/, `<html$1lang="${langCode}"`);

  // Update canonical and og:url for localized pages
  const localeDir = CONFIG.localeMapping[locale] || locale.toLowerCase();
  translated = translated.replace(
    /href="https:\/\/flyto2\.com\/([^"]*?)"/g,
    (match, pagePath) => {
      if (pagePath === '' || pagePath === 'index.html') {
        return `href="https://flyto2.com/${localeDir}/"`;
      }
      return `href="https://flyto2.com/${localeDir}/${pagePath}"`;
    }
  );

  // Update language switcher active state
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
  const displayLang = langNames[currentLocale] || 'EN';
  html = html.replace(
    /<span class="current-lang">EN<\/span>/g,
    `<span class="current-lang">${displayLang}</span>`
  );

  return html;
}

// Add/update hreflang tags
function updateHreflangTags(html, currentLocale) {
  // Check if hreflang already exists
  if (html.includes('hreflang=')) {
    return html;
  }

  // Insert hreflang tags after <link rel="canonical" for all 15 languages
  const hreflangTags = `
	<link rel="alternate" hreflang="en" href="https://flyto2.com/" />
	<link rel="alternate" hreflang="zh-Hant" href="https://flyto2.com/zh/" />
	<link rel="alternate" hreflang="ja" href="https://flyto2.com/ja/" />
	<link rel="alternate" hreflang="ko" href="https://flyto2.com/ko/" />
	<link rel="alternate" hreflang="de" href="https://flyto2.com/de/" />
	<link rel="alternate" hreflang="es" href="https://flyto2.com/es/" />
	<link rel="alternate" hreflang="fr" href="https://flyto2.com/fr/" />
	<link rel="alternate" hreflang="it" href="https://flyto2.com/it/" />
	<link rel="alternate" hreflang="pt-BR" href="https://flyto2.com/pt/" />
	<link rel="alternate" hreflang="vi" href="https://flyto2.com/vi/" />
	<link rel="alternate" hreflang="id" href="https://flyto2.com/id/" />
	<link rel="alternate" hreflang="th" href="https://flyto2.com/th/" />
	<link rel="alternate" hreflang="tr" href="https://flyto2.com/tr/" />
	<link rel="alternate" hreflang="pl" href="https://flyto2.com/pl/" />
	<link rel="alternate" hreflang="hi" href="https://flyto2.com/hi/" />
	<link rel="alternate" hreflang="x-default" href="https://flyto2.com/" />`;

  return html.replace(
    /(<link rel="canonical"[^>]+>)/,
    `$1${hreflangTags}`
  );
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
      html = translateHtml(html, translations, locale);

      // Fix relative paths
      html = fixRelativePaths(html);

      // Write output
      const outputPath = path.join(outputDir, htmlFile);
      fs.writeFileSync(outputPath, html);

      console.log(`   ✅ ${htmlFile}`);
    }
  }

  console.log('\n✅ Build complete!');
}

main();
