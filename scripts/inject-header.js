#!/usr/bin/env node
/**
 * inject-header.js
 *
 * Injects the canonical header and mobile menu into all HTML files.
 * Run BEFORE build-i18n.js so translations apply to the unified header.
 *
 * Usage:
 *   node scripts/inject-header.js
 *   node scripts/inject-header.js --dry-run   (preview changes without writing)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const HEADER_PATH = path.join(ROOT_DIR, '_header.html');
const MOBILE_MENU_PATH = path.join(ROOT_DIR, '_mobile-menu.html');

const HTML_FILES = [
  'index.html', 'pricing.html', 'download.html', 'app.html',
  'faq.html', 'contact.html', 'language-packs.html', 'product.html',
  'use-cases.html', 'compare.html', 'philosophy.html', 'about.html',
  'blog.html', 'dev.html', 'node.html', 'wasm.html', 'open.html',
  'sponsor.html'
];

const dryRun = process.argv.includes('--dry-run');

function main() {
  if (!fs.existsSync(HEADER_PATH)) {
    console.error('_header.html not found');
    process.exit(1);
  }
  if (!fs.existsSync(MOBILE_MENU_PATH)) {
    console.error('_mobile-menu.html not found');
    process.exit(1);
  }

  const headerHtml = fs.readFileSync(HEADER_PATH, 'utf8');
  const mobileMenuHtml = fs.readFileSync(MOBILE_MENU_PATH, 'utf8');

  console.log('Injecting canonical header into HTML files...\n');

  let updatedCount = 0;
  let skippedCount = 0;

  for (const htmlFile of HTML_FILES) {
    const filePath = path.join(ROOT_DIR, htmlFile);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace <header class="header">...</header>
    const headerPattern = /\t<header class="header">[\s\S]*?<\/header>/;
    if (headerPattern.test(html)) {
      const newHtml = html.replace(headerPattern, headerHtml.trimEnd());
      if (newHtml !== html) {
        html = newHtml;
        changed = true;
      }
    }

    // Replace mobile menu area (4 nested closing divs: lang-switcher, wrapper, menu, area)
    const mobilePattern = /\t<div class="mobile-menu-area">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
    if (mobilePattern.test(html)) {
      const newHtml = html.replace(mobilePattern, mobileMenuHtml.trimEnd());
      if (newHtml !== html) {
        html = newHtml;
        changed = true;
      }
    }

    if (changed) {
      if (!dryRun) {
        fs.writeFileSync(filePath, html);
      }
      console.log(`  ${dryRun ? '[DRY RUN] ' : ''}Updated: ${htmlFile}`);
      updatedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`\nDone! Updated: ${updatedCount}, Already up-to-date: ${skippedCount}`);
  if (dryRun) {
    console.log('(Dry run - no files were modified)');
  }
}

main();
