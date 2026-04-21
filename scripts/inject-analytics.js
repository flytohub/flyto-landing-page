#!/usr/bin/env node
/**
 * inject-analytics.js
 *
 * Injects Google Analytics and Search Console verification into HTML files.
 * Reads config from seo-config.json.
 *
 * Usage:
 *   node scripts/inject-analytics.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'seo-config.json');
const HTML_DIR = path.join(__dirname, '..');

// Load config
const seoConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const analytics = seoConfig.analytics || {};

/**
 * Generate GA4 script tag
 */
function generateGAScript(measurementId) {
  return `
	<!-- Google Analytics (GA4) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', '${measurementId}');
	</script>`;
}

/**
 * Generate Search Console verification meta tag
 */
function generateSearchConsoleTag(verificationId) {
  if (!verificationId) return '';
  return `\n	<meta name="google-site-verification" content="${verificationId}">`;
}

/**
 * Update CSP to allow Google Analytics
 */
function updateCSP(html) {
  // Add googletagmanager.com and google-analytics.com to CSP
  const cspPattern = /(<meta http-equiv="Content-Security-Policy" content="[^"]*)(">)/;

  if (!cspPattern.test(html)) {
    return html;
  }

  return html.replace(cspPattern, (match, before, after) => {
    let updated = before;

    // Add to script-src if not present
    if (!updated.includes('googletagmanager.com')) {
      updated = updated.replace(
        /script-src ([^;]+);/,
        'script-src $1 https://www.googletagmanager.com;'
      );
    }

    // Add to connect-src if not present
    if (!updated.includes('google-analytics.com')) {
      updated = updated.replace(
        /connect-src ([^;]+);/,
        'connect-src $1 https://www.google-analytics.com https://www.googletagmanager.com;'
      );
    }

    return updated + after;
  });
}

/**
 * Remove existing GA script
 */
function removeExistingGA(html) {
  // Remove GA4 script block
  const gaPattern = /\n?\t*<!-- Google Analytics \(GA4\) -->[\s\S]*?gtag\('config', 'G-[A-Z0-9]+'\);\s*<\/script>/g;
  return html.replace(gaPattern, '');
}

/**
 * Inject analytics into a single HTML file
 */
function injectIntoFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const ga = analytics.googleAnalytics || {};
  const gsc = analytics.googleSearchConsole || {};

  // Remove existing GA if present and different
  if (ga.enabled && ga.measurementId) {
    const hasOldGA = html.includes('googletagmanager.com/gtag/js') && !html.includes(ga.measurementId);
    if (hasOldGA) {
      html = removeExistingGA(html);
      modified = true;
    }
  }

  // Inject GA if not present
  if (ga.enabled && ga.measurementId && !html.includes(ga.measurementId)) {
    const gaScript = generateGAScript(ga.measurementId);

    // Inject after <head> tag
    if (html.includes('<head>')) {
      html = html.replace('<head>', '<head>' + gaScript);
      modified = true;
    }
  }

  // Skip if Search Console already injected
  if (gsc.enabled && gsc.verificationId && !html.includes(gsc.verificationId)) {
    const gscTag = generateSearchConsoleTag(gsc.verificationId);

    // Inject after charset meta tag
    if (html.includes('<meta charset="UTF-8">')) {
      html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">' + gscTag);
      modified = true;
    }
  }

  // Update CSP
  if (ga.enabled && ga.measurementId) {
    const updatedHtml = updateCSP(html);
    if (updatedHtml !== html) {
      html = updatedHtml;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
  }

  return false;
}

/**
 * Get all HTML files to process
 */
function getAllHtmlFiles() {
  const files = [];
  const PRODUCTS_PATH = path.join(__dirname, 'products.json');
  const productsConfig = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const productSlugs = productsConfig.products.map(p => p.slug);

  // Root HTML files
  const rootFiles = fs.readdirSync(HTML_DIR)
    .filter(f => f.endsWith('.html') && !f.startsWith('404'));

  for (const file of rootFiles) {
    files.push(path.join(HTML_DIR, file));
  }

  // Product directories (claude/, code/)
  for (const slug of productSlugs) {
    const productDir = path.join(HTML_DIR, slug);
    if (fs.existsSync(productDir) && fs.statSync(productDir).isDirectory()) {
      const productFiles = fs.readdirSync(productDir).filter(f => f.endsWith('.html'));
      for (const file of productFiles) {
        files.push(path.join(productDir, file));
      }
    }
  }

  // Language directories
  const langDirs = fs.readdirSync(HTML_DIR)
    .filter(d => {
      const fullPath = path.join(HTML_DIR, d);
      return d.length === 2 &&
             fs.statSync(fullPath).isDirectory() &&
             fs.existsSync(path.join(fullPath, 'index.html'));
    });

  for (const lang of langDirs) {
    const langDir = path.join(HTML_DIR, lang);
    const langFiles = fs.readdirSync(langDir)
      .filter(f => f.endsWith('.html'));

    for (const file of langFiles) {
      files.push(path.join(langDir, file));
    }

    // Language + product directories (e.g., /zh/code/)
    for (const slug of productSlugs) {
      const langProductDir = path.join(langDir, slug);
      if (fs.existsSync(langProductDir) && fs.statSync(langProductDir).isDirectory()) {
        const lpFiles = fs.readdirSync(langProductDir).filter(f => f.endsWith('.html'));
        for (const file of lpFiles) {
          files.push(path.join(langProductDir, file));
        }
      }
    }
  }

  return files;
}

function main() {
  console.log('🔍 Injecting analytics...');

  const ga = analytics.googleAnalytics || {};
  const gsc = analytics.googleSearchConsole || {};

  if (!ga.enabled && !gsc.enabled) {
    console.log('⚠️  No analytics enabled in seo-config.json');
    return;
  }

  if (ga.enabled) {
    console.log(`   GA4: ${ga.measurementId}`);
  }
  if (gsc.enabled && gsc.verificationId) {
    console.log(`   Search Console: ${gsc.verificationId}`);
  }

  const files = getAllHtmlFiles();
  let injected = 0;

  for (const file of files) {
    if (injectIntoFile(file)) {
      injected++;
    }
  }

  console.log(`✅ Analytics injected into ${injected}/${files.length} files`);
}

main();
