#!/usr/bin/env node
/**
 * inject-header.js
 *
 * Injects the canonical header (product switcher + header + mobile menu)
 * into all HTML files, including product subdirectories.
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
const PRODUCTS_PATH = path.join(__dirname, 'products.json');

const dryRun = process.argv.includes('--dry-run');

function getHtmlFiles() {
  const files = [];
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

  // Root-level pages: index.html + shared pages
  files.push('index.html');
  for (const page of products.sharedPages) {
    files.push(page);
  }

  // Product pages
  for (const product of products.products) {
    for (const page of product.pages) {
      files.push(path.join(product.slug, page));
    }
  }

  return files;
}

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
  const htmlFiles = getHtmlFiles();

  console.log('Injecting canonical header into HTML files...\n');

  let updatedCount = 0;
  let skippedCount = 0;

  for (const htmlFile of htmlFiles) {
    const filePath = path.join(ROOT_DIR, htmlFile);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace product switcher + header block
    const headerPattern = /\t<!-- Product Switcher Bar -->[\s\S]*?<\/header>\s*<!-- Product Nav \+ Lang Switcher Detection Script -->\s*<script>[\s\S]*?<\/script>/;
    if (headerPattern.test(html)) {
      const newHtml = html.replace(headerPattern, headerHtml.trimEnd());
      if (newHtml !== html) {
        html = newHtml;
        changed = true;
      }
    } else {
      // Fallback: old-style header without product switcher
      const oldHeaderPattern = /\t<header class="header">[\s\S]*?<\/header>/;
      if (oldHeaderPattern.test(html)) {
        const newHtml = html.replace(oldHeaderPattern, headerHtml.trimEnd());
        if (newHtml !== html) {
          html = newHtml;
          changed = true;
        }
      }
    }

    // Replace mobile menu area
    const mobilePattern = /\t<div class="mobile-menu-area">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>(?:\s*<!-- Mobile Product Nav Detection -->\s*<script>[\s\S]*?<\/script>)?/;
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
