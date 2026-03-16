#!/usr/bin/env node
/**
 * inject-footer.js
 *
 * Injects the canonical footer into all HTML files.
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

const HTML_FILES = [
  'index.html', 'pricing.html', 'download.html', 'app.html',
  'faq.html', 'contact.html', 'language-packs.html',
  'dev.html', 'node.html', 'wasm.html'
];

const dryRun = process.argv.includes('--dry-run');

function main() {
  if (!fs.existsSync(FOOTER_PATH)) {
    console.error('_footer.html not found');
    process.exit(1);
  }

  const footerHtml = fs.readFileSync(FOOTER_PATH, 'utf8');

  console.log('Injecting canonical footer into HTML files...\n');

  let updatedCount = 0;
  let skippedCount = 0;

  for (const htmlFile of HTML_FILES) {
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
