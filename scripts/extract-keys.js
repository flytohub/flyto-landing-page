#!/usr/bin/env node
/**
 * extract-keys.js
 *
 * Scans HTML files for data-i18n attributes and syncs new keys to flyto-i18n.
 * New keys are added with empty values for translators to fill in.
 *
 * Usage:
 *   node scripts/extract-keys.js
 *   node scripts/extract-keys.js --dry-run  (preview without writing)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  htmlDir: path.join(__dirname, '..'),
  i18nDir: path.join(__dirname, '..', '..', 'flyto-i18n', 'locales'),
  htmlFiles: ['index.html', 'pricing.html', 'download.html', 'app.html', 'faq.html', 'contact.html', 'language-packs.html'],
  locales: ['en', 'zh-TW', 'zh-CN', 'ja', 'ko', 'fr', 'es', 'de', 'pt-BR', 'vi', 'id', 'th', 'tr', 'pl', 'it', 'hi'],
  dryRun: process.argv.includes('--dry-run')
};

// Extract keys from HTML files
function extractKeysFromHtml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();

  // Match data-i18n="key" pattern
  const regex = /data-i18n="([^"]+)"/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return keys;
}

// Group keys by their JSON file (landing.common, landing.index, etc.)
function groupKeysByFile(keys) {
  const groups = {};

  for (const key of keys) {
    // Extract file name from key (e.g., "landing.common.nav.home" -> "landing.common")
    const parts = key.split('.');
    if (parts.length >= 2) {
      const fileName = `${parts[0]}.${parts[1]}`;
      if (!groups[fileName]) {
        groups[fileName] = new Set();
      }
      groups[fileName].add(key);
    }
  }

  return groups;
}

// Load existing keys from JSON file
function loadExistingKeys(filePath) {
  if (!fs.existsSync(filePath)) {
    return new Set();
  }

  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return new Set(Object.keys(content.translations || {}));
}

// Add new keys to JSON file
function addKeysToJson(filePath, newKeys, locale, category) {
  let content;

  if (fs.existsSync(filePath)) {
    content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else {
    content = {
      "$schema": "../../schema/locale.schema.json",
      "locale": locale,
      "category": category,
      "version": "1.0.0",
      "translations": {}
    };
  }

  // Add new keys with empty values
  for (const key of newKeys) {
    if (!content.translations[key]) {
      content.translations[key] = "";
    }
  }

  // Sort keys alphabetically
  const sortedTranslations = {};
  Object.keys(content.translations).sort().forEach(key => {
    sortedTranslations[key] = content.translations[key];
  });
  content.translations = sortedTranslations;

  return content;
}

// Main function
function main() {
  console.log('🔍 Extracting i18n keys from HTML files...\n');

  // Collect all keys from HTML files
  const allKeys = new Set();

  for (const htmlFile of CONFIG.htmlFiles) {
    const filePath = path.join(CONFIG.htmlDir, htmlFile);
    if (fs.existsSync(filePath)) {
      const keys = extractKeysFromHtml(filePath);
      console.log(`  📄 ${htmlFile}: ${keys.size} keys`);
      keys.forEach(key => allKeys.add(key));
    }
  }

  console.log(`\n📊 Total unique keys: ${allKeys.size}\n`);

  // Group keys by file
  const groupedKeys = groupKeysByFile(allKeys);

  // Process each locale
  for (const locale of CONFIG.locales) {
    console.log(`\n🌐 Processing locale: ${locale}`);

    const localeDir = path.join(CONFIG.i18nDir, locale);
    if (!fs.existsSync(localeDir)) {
      if (!CONFIG.dryRun) {
        fs.mkdirSync(localeDir, { recursive: true });
      }
      console.log(`  📁 Created directory: ${localeDir}`);
    }

    for (const [category, keys] of Object.entries(groupedKeys)) {
      const jsonFileName = `${category}.json`;
      const jsonFilePath = path.join(localeDir, jsonFileName);

      const existingKeys = loadExistingKeys(jsonFilePath);
      const newKeys = [...keys].filter(key => !existingKeys.has(key));

      if (newKeys.length > 0) {
        console.log(`  📝 ${jsonFileName}: +${newKeys.length} new keys`);

        if (!CONFIG.dryRun) {
          const updatedContent = addKeysToJson(jsonFilePath, newKeys, locale, category);
          fs.writeFileSync(jsonFilePath, JSON.stringify(updatedContent, null, 2) + '\n');
        } else {
          console.log(`     New keys: ${newKeys.slice(0, 3).join(', ')}${newKeys.length > 3 ? '...' : ''}`);
        }
      } else {
        console.log(`  ✅ ${jsonFileName}: up to date`);
      }
    }
  }

  if (CONFIG.dryRun) {
    console.log('\n⚠️  Dry run mode - no files were modified');
  } else {
    console.log('\n✅ Done! Keys synced to flyto-i18n');
  }
}

main();
