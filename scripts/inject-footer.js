#!/usr/bin/env node
/**
 * inject-footer.js
 *
 * Injects the canonical footer into all HTML files,
 * including product subdirectories.
 * Run BEFORE build-i18n.js so translations apply to the unified footer.
 *
 * Usage:
 *   node scripts/inject-footer.js
 *   node scripts/inject-footer.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const FOOTER_PATH = path.join(ROOT_DIR, '_footer.html');
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
  if (!fs.existsSync(FOOTER_PATH)) {
    console.error('_footer.html not found');
    process.exit(1);
  }

  const footerHtml = fs.readFileSync(FOOTER_PATH, 'utf8');
  const htmlFiles = getHtmlFiles();

  console.log('Injecting canonical footer into HTML files...\n');

  let updatedCount = 0;
  let skippedCount = 0;

  for (const htmlFile of htmlFiles) {
    const filePath = path.join(ROOT_DIR, htmlFile);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace <footer class="footer">...</footer>
    const footerPattern = /\t<footer class="footer">[\s\S]*?<\/footer>/;
    if (footerPattern.test(html)) {
      const newHtml = html.replace(footerPattern, footerHtml.trimEnd());
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
