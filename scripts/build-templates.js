#!/usr/bin/env node
/**
 * build-templates.js
 *
 * Generates static template pages for SEO:
 *   - templates.html (gallery listing)
 *   - templates/{slug}.html (individual detail pages)
 *
 * Reads from:
 *   - scripts/template-data.json (metadata + SEO)
 *   - templates/content/{slug}.md (rich content)
 *
 * Usage:
 *   node scripts/build-templates.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(__dirname, 'template-data.json');
const CONTENT_DIR = path.join(ROOT, 'templates', 'content');
const OUTPUT_DIR = path.join(ROOT, 'templates');
const BASE_URL = 'https://flyto2.com';
const APP_URL = 'https://cloud.flyto2.com';

// ── Simple Markdown → HTML ──────────────────────────────────────────────────
function mdToHtml(md) {
  if (!md) return '';
  return md
    // headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // unordered lists (handle - items)
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    // paragraphs (non-empty lines that aren't already HTML)
    .replace(/^(?!<[hulo])((?!<li).+)$/gm, '<p>$1</p>')
    // clean up extra newlines
    .replace(/\n{2,}/g, '\n')
    .trim();
}

// ── Shared HTML fragments ───────────────────────────────────────────────────
const ANALYTICS = `\t<!-- Ahrefs Analytics -->
\t<script src="https://analytics.ahrefs.com/analytics.js" data-key="YGlNNxBET/eGo08/CoK3GQ" async></script>
\t<!-- Google Analytics (GA4) -->
\t<script async src="https://www.googletagmanager.com/gtag/js?id=G-7V4D315CBD"></script>
\t<script>
\t\twindow.dataLayer = window.dataLayer || [];
\t\tfunction gtag(){dataLayer.push(arguments);}
\t\tgtag('js', new Date());
\t\tgtag('config', 'G-7V4D315CBD');
\t</script>`;

function headCommon(relRoot) {
  return `\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0">

\t<!-- Preconnect to critical origins -->
\t<link rel="preconnect" href="https://fonts.googleapis.com">
\t<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
\t<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
\t<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">

\t<!-- Google Fonts -->
\t<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap">
\t<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" media="print" onload="this.media='all'">
\t<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"></noscript>`;
}

function csp() {
  return `\t<!-- Content Security Policy -->
\t<meta http-equiv="Content-Security-Policy" content="
\t\tdefault-src 'self';
\t\tscript-src 'self' 'unsafe-inline' https://www.gstatic.com https://cdn.jsdelivr.net https://apis.google.com https://www.googletagmanager.com https://analytics.ahrefs.com;
\t\tstyle-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com;
\t\tfont-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net;
\t\timg-src 'self' data: https:;
\t\tconnect-src 'self' https://www.gstatic.com https://cdn.jsdelivr.net https://*.cloudfunctions.net https://*.firebaseio.com https://www.google-analytics.com https://www.googletagmanager.com https://analytics.ahrefs.com;
\t\tframe-src https://accounts.google.com https://*.firebaseapp.com;
\t">

\t<!-- Security Headers -->
\t<meta http-equiv="X-Content-Type-Options" content="nosniff">
\t<meta name="referrer" content="strict-origin-when-cross-origin">
\t<meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()">`;
}

function cssIncludes(relRoot) {
  return `\t<link rel="icon" href="${relRoot}assets/img/favicon.ico" type="image/x-icon">
\t<link rel="icon" href="${relRoot}assets/img/icon.png" type="image/png" sizes="32x32">
\t<link rel="apple-touch-icon" href="${relRoot}assets/img/icon.png" sizes="180x180">

\t<!-- CSS -->
\t<link rel="stylesheet" href="${relRoot}assets/css/normalize.css">
\t<link rel="stylesheet" href="${relRoot}assets/css/bootstrap.min.css">
\t<link rel="stylesheet" href="${relRoot}assets/css/fontawesome.all.min.css">
\t<link rel="stylesheet" href="${relRoot}style.css">
\t<link rel="stylesheet" href="${relRoot}assets/css/responsive.css">
\t<link rel="stylesheet" href="${relRoot}assets/css/bootstrap-icons.css" media="print" onload="this.media='all'">
\t<link rel="stylesheet" href="${relRoot}assets/css/animate.css" media="print" onload="this.media='all'">
\t<link rel="stylesheet" href="${relRoot}assets/css/auth.css">
\t<noscript>
\t\t<link rel="stylesheet" href="${relRoot}assets/css/bootstrap-icons.css">
\t\t<link rel="stylesheet" href="${relRoot}assets/css/animate.css">
\t</noscript>`;
}

function jsIncludes(relRoot) {
  return `\t<script src="${relRoot}assets/js/jquery-3.6.0.min.js"></script>
\t<script src="${relRoot}assets/js/bootstrap.min.js"></script>
\t<script src="${relRoot}assets/js/wow.min.js"></script>
\t<script src="${relRoot}assets/js/script.js"></script>`;
}

// ── Load data ───────────────────────────────────────────────────────────────
// Prefer cloud-templates.json (fetched from API), fallback to static template-data.json
const CLOUD_DATA_PATH = path.join(__dirname, 'cloud-templates.json');
let categories, templates;

if (fs.existsSync(CLOUD_DATA_PATH)) {
  console.log('  Using cloud-templates.json (live marketplace data)');
  const cloud = JSON.parse(fs.readFileSync(CLOUD_DATA_PATH, 'utf8'));
  categories = cloud.categories;
  templates = cloud.templates;
} else {
  console.log('  Using template-data.json (static fallback)');
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  categories = data.categories;
  // Normalize static templates to match cloud format
  templates = data.templates.map(t => {
    const cat = categories[t.category] || {};
    return {
      ...t,
      categoryLabel: cat.label || t.category,
      categoryColor: cat.color || '#6B7280',
      categoryIcon: cat.icon || 'bi-box',
      iconUrl: '',
      pricing: 'free',
      price: 0,
      downloads: 0,
      creatorName: 'Flyto2',
    };
  });
}

// ── Read header/footer/mobile-menu ──────────────────────────────────────────
const headerHtml = fs.readFileSync(path.join(ROOT, '_header.html'), 'utf8');
const footerHtml = fs.readFileSync(path.join(ROOT, '_footer.html'), 'utf8');
const mobileMenuHtml = fs.readFileSync(path.join(ROOT, '_mobile-menu.html'), 'utf8');

// Fix relative paths in header/footer for templates/ subdirectory
function fixPaths(html, relRoot) {
  return html
    .replace(/href="\.\/"/g, `href="${relRoot}"`)
    .replace(/href="(?!https?:\/\/|#|javascript:|mailto:)(?!\/)([\w-]+\.html)"/g, `href="${relRoot}$1"`)
    .replace(/src="assets\//g, `src="${relRoot}assets/`)
    .replace(/srcset="assets\//g, `srcset="${relRoot}assets/`);
}

// ── Template page CSS (inline for simplicity) ───────────────────────────────
const TEMPLATE_CSS = `
<style>
/* Template Gallery */
.template-filters { padding: 30px 0; background: #f8f9fa; border-bottom: 1px solid #e9ecef; position: sticky; top: 0; z-index: 10; }
.filter-btn { display: inline-block; padding: 8px 20px; margin: 4px; border-radius: 24px; border: 1px solid #dee2e6; background: #fff; color: #495057; font-size: 14px; cursor: pointer; transition: all 0.2s; text-decoration: none; }
.filter-btn:hover, .filter-btn.active { background: #667eea; color: #fff; border-color: #667eea; }
.filter-count { font-size: 12px; opacity: 0.7; margin-left: 4px; }
.template-grid { padding: 50px 0 80px; }
.template-card { background: #fff; border-radius: 12px; padding: 28px; border: 1px solid #e9ecef; transition: all 0.3s; height: 100%; display: flex; flex-direction: column; cursor: pointer; }
.template-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.08); transform: translateY(-2px); border-color: #667eea; }
.template-card-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff; margin-bottom: 16px; flex-shrink: 0; }
.template-card-icon.has-img { width: 56px; height: 56px; background: none !important; border-radius: 14px; overflow: hidden; }
.template-card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; }
.template-card h3 a { color: #1a1a2e; text-decoration: none; }
.template-card h3 a:hover { color: #667eea; }
.template-card p { color: #6c757d; font-size: 0.9rem; flex-grow: 1; }
.template-card-meta { display: flex; align-items: center; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
.template-tag { display: inline-block; padding: 3px 10px; border-radius: 12px; background: #f0f0f7; color: #555; font-size: 12px; }
.template-difficulty { font-size: 12px; padding: 3px 10px; border-radius: 12px; }
.difficulty-beginner { background: #d1fae5; color: #065f46; }
.difficulty-intermediate { background: #fef3c7; color: #92400e; }
.template-time { font-size: 12px; color: #6c757d; }
.template-time i { margin-right: 4px; }
.template-card-icon.has-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.template-pricing { font-size: 12px; padding: 3px 10px; border-radius: 12px; font-weight: 500; }
.pricing-free { background: #d1fae5; color: #065f46; }
.pricing-paid { background: #fef3c7; color: #92400e; }
.template-creator { font-size: 12px; color: #6c757d; }
.template-creator i { margin-right: 4px; }

/* Pagination */
.tmpl-pagination { display: flex; justify-content: center; align-items: center; gap: 6px; list-style: none; padding: 0; margin: 0; flex-wrap: wrap; }
.tmpl-pagination li { display: inline-block; }
.tmpl-pagination .page-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: 40px; padding: 0 12px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none; }
.tmpl-pagination .page-btn:hover { background: #f3f4f6; border-color: #667eea; color: #667eea; }
.tmpl-pagination .page-btn.active { background: #667eea; color: #fff; border-color: #667eea; pointer-events: none; }
.tmpl-pagination .page-btn.disabled { opacity: 0.4; pointer-events: none; }
.tmpl-pagination .page-ellipsis { color: #9ca3af; padding: 0 4px; font-size: 14px; }

/* ── Template Detail Dialog ─────────────────────────────────────────────── */
#templateModal .modal-dialog { max-width: 960px; margin: 30px auto; }
#templateModal .modal-content { border: none; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.15); }

/* Dialog Hero */
.dlg-hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 36px 28px; color: #fff; position: relative; }
.dlg-hero-top { display: flex; align-items: flex-start; gap: 20px; }
.dlg-hero-icon { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #fff; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); flex-shrink: 0; }
.dlg-hero-info { flex: 1; min-width: 0; }
.dlg-hero h2 { font-size: 1.6rem; font-weight: 700; margin: 0 0 8px; line-height: 1.3; }
.dlg-hero p { font-size: 0.95rem; opacity: 0.9; margin: 0 0 14px; line-height: 1.5; }
.dlg-hero-badges { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.dlg-hero-badges .badge { padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.dlg-badge-cat { background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); }
.dlg-badge-free { background: #10B981; }
.dlg-badge-paid { background: #F59E0B; color: #1a1a2e; }
.dlg-close { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; transition: background 0.2s; backdrop-filter: blur(4px); }
.dlg-close:hover { background: rgba(255,255,255,0.3); }

/* Dialog Body */
.dlg-body { padding: 0; }
.dlg-layout { display: flex; min-height: 400px; }
.dlg-main { flex: 1; padding: 32px 36px; min-width: 0; overflow-y: auto; max-height: 60vh; }
.dlg-sidebar { width: 280px; background: #f8f9fb; border-left: 1px solid #eef0f4; padding: 28px 24px; flex-shrink: 0; }

/* Dialog Content (markdown) */
.dlg-content { font-size: 0.95rem; line-height: 1.8; color: #374151; }
.dlg-content h2 { font-size: 1.3rem; font-weight: 600; margin: 28px 0 12px; color: #1a1a2e; padding-bottom: 8px; border-bottom: 2px solid #f0f0f7; }
.dlg-content h2:first-child { margin-top: 0; }
.dlg-content h3 { font-size: 1.1rem; font-weight: 600; margin: 20px 0 10px; color: #1a1a2e; }
.dlg-content ul { padding-left: 20px; margin: 12px 0; }
.dlg-content li { margin-bottom: 6px; }
.dlg-content li::marker { color: #667eea; }
.dlg-content p { margin-bottom: 14px; }
.dlg-content code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; color: #7c3aed; }
.dlg-content strong { color: #1a1a2e; }

/* Sidebar elements */
.dlg-cta { display: block; width: 100%; padding: 13px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; transition: opacity 0.2s, transform 0.2s; }
.dlg-cta:hover { opacity: 0.92; color: #fff; transform: translateY(-1px); }
.dlg-cta-secondary { display: block; width: 100%; padding: 11px; background: #fff; color: #667eea; border: 2px solid #667eea; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; margin-top: 10px; transition: all 0.2s; }
.dlg-cta-secondary:hover { background: #667eea; color: #fff; }
.dlg-info-card { background: #fff; border-radius: 10px; padding: 18px; margin-top: 18px; border: 1px solid #eef0f4; }
.dlg-info-card h4 { font-size: 0.85rem; font-weight: 600; margin: 0 0 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
.dlg-info-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
.dlg-info-row:last-child { border-bottom: none; }
.dlg-info-label { color: #9ca3af; }
.dlg-info-value { font-weight: 500; color: #1f2937; }
.dlg-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 18px; }
.dlg-tags .template-tag { font-size: 11px; padding: 4px 10px; background: #fff; border: 1px solid #e5e7eb; }

/* Dialog Related Templates */
.dlg-related { border-top: 1px solid #eef0f4; padding: 28px 36px; background: #fafbfc; }
.dlg-related h3 { font-size: 1.1rem; font-weight: 600; margin: 0 0 18px; color: #1a1a2e; }
.dlg-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.dlg-related-card { background: #fff; border: 1px solid #eef0f4; border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s; }
.dlg-related-card:hover { border-color: #667eea; box-shadow: 0 4px 12px rgba(0,0,0,0.06); transform: translateY(-1px); }
.dlg-related-card h4 { font-size: 0.88rem; font-weight: 600; margin: 0 0 6px; color: #1a1a2e; }
.dlg-related-card p { font-size: 0.8rem; color: #6b7280; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Responsive */
@media (max-width: 768px) {
  #templateModal .modal-dialog { margin: 10px; max-width: calc(100% - 20px); }
  .dlg-layout { flex-direction: column; }
  .dlg-sidebar { width: 100%; border-left: none; border-top: 1px solid #eef0f4; }
  .dlg-main { max-height: 45vh; padding: 24px; }
  .dlg-hero { padding: 24px; }
  .dlg-hero h2 { font-size: 1.3rem; }
  .dlg-hero-icon { width: 52px; height: 52px; font-size: 22px; }
  .dlg-related-grid { grid-template-columns: 1fr; }
  .dlg-related { padding: 20px 24px; }
}

/* Template Detail Page (SEO pages) */
.detail-hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 100px 0 50px; color: #fff; }
.detail-hero .breadcrumb { margin-bottom: 20px; }
.detail-hero .breadcrumb a { color: rgba(255,255,255,0.7); text-decoration: none; }
.detail-hero .breadcrumb a:hover { color: #fff; }
.detail-hero .breadcrumb span { color: rgba(255,255,255,0.5); margin: 0 8px; }
.detail-hero h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 12px; }
.detail-hero .meta { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.detail-hero .meta .badge { padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; }
.detail-content { padding: 60px 0 80px; }
.detail-content .main-content { font-size: 1.05rem; line-height: 1.8; color: #333; }
.detail-content .main-content h2 { font-size: 1.5rem; font-weight: 600; margin: 32px 0 16px; color: #1a1a2e; }
.detail-content .main-content h3 { font-size: 1.2rem; font-weight: 600; margin: 24px 0 12px; color: #1a1a2e; }
.detail-content .main-content ul { padding-left: 20px; margin: 16px 0; }
.detail-content .main-content li { margin-bottom: 8px; }
.detail-content .main-content p { margin-bottom: 16px; }
.detail-sidebar { position: sticky; top: 100px; }
.sidebar-card { background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.sidebar-card h4 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; }
.sidebar-card .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef; font-size: 14px; }
.sidebar-card .info-row:last-child { border-bottom: none; }
.sidebar-card .info-label { color: #6c757d; }
.sidebar-card .info-value { font-weight: 500; color: #1a1a2e; }
.btn-use-template { display: block; width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; transition: opacity 0.2s; }
.btn-use-template:hover { opacity: 0.9; color: #fff; }
.btn-download-desktop { display: block; width: 100%; padding: 12px; background: #fff; color: #667eea; border: 2px solid #667eea; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; margin-top: 10px; transition: all 0.2s; }
.btn-download-desktop:hover { background: #667eea; color: #fff; }
.related-templates { padding: 60px 0; background: #f8f9fa; }
.related-templates h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 30px; }
</style>`;

// ── Difficulty badge ────────────────────────────────────────────────────────
function difficultyBadge(d) {
  const cls = d === 'beginner' ? 'difficulty-beginner' : 'difficulty-intermediate';
  const label = d === 'beginner' ? 'Beginner' : 'Intermediate';
  return `<span class="template-difficulty ${cls}">${label}</span>`;
}

// ── Category badge (for detail page hero) ───────────────────────────────────
function categoryBadge(catKey) {
  const cat = categories[catKey] || { label: catKey, color: '#6c757d' };
  return `<span class="badge" style="background:${cat.color}">${cat.label}</span>`;
}

// ── hreflang links ──────────────────────────────────────────────────────────
const LOCALES = [
  { hreflang: 'en', dir: '' },
  { hreflang: 'de', dir: 'de/' },
  { hreflang: 'es', dir: 'es/' },
  { hreflang: 'fr', dir: 'fr/' },
  { hreflang: 'hi', dir: 'hi/' },
  { hreflang: 'id', dir: 'id/' },
  { hreflang: 'it', dir: 'it/' },
  { hreflang: 'ja', dir: 'ja/' },
  { hreflang: 'ko', dir: 'ko/' },
  { hreflang: 'pl', dir: 'pl/' },
  { hreflang: 'pt-BR', dir: 'pt/' },
  { hreflang: 'th', dir: 'th/' },
  { hreflang: 'tr', dir: 'tr/' },
  { hreflang: 'vi', dir: 'vi/' },
  { hreflang: 'zh-Hans', dir: 'cn/' },
  { hreflang: 'zh-Hant', dir: 'zh/' },
];

function hreflangLinks(pagePath) {
  const links = LOCALES.map(l =>
    `\t<link rel="alternate" hreflang="${l.hreflang}" href="${BASE_URL}/${l.dir}${pagePath}" />`
  );
  links.push(`\t<link rel="alternate" hreflang="x-default" href="${BASE_URL}/${pagePath}" />`);
  return links.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// GALLERY PAGE
// ═══════════════════════════════════════════════════════════════════════════
function buildGalleryPage() {
  // Count templates per category
  const catCounts = {};
  for (const t of templates) {
    catCounts[t.category] = (catCounts[t.category] || 0) + 1;
  }

  // Filter buttons
  const filterButtons = [`<button class="filter-btn active" data-category="all">All<span class="filter-count">(${templates.length})</span></button>`];
  for (const [key, cat] of Object.entries(categories)) {
    if (catCounts[key]) {
      filterButtons.push(`<button class="filter-btn" data-category="${key}"><i class="${cat.icon}"></i> ${cat.label}<span class="filter-count">(${catCounts[key]})</span></button>`);
    }
  }

  // Template cards — click opens dialog
  const cards = templates.map(t => {
    const catColor = t.categoryColor || '#6B7280';
    const catIcon = t.categoryIcon || 'bi-box';
    const tags = t.tags.slice(0, 3).map(tag => `<span class="template-tag">${tag}</span>`).join('');
    const pricingBadge = t.pricing === 'free'
      ? '<span class="template-pricing pricing-free">Free</span>'
      : `<span class="template-pricing pricing-paid">$${t.price}</span>`;

    // Icon: custom image or fallback to category icon
    const iconHtml = t.iconUrl
      ? `<div class="template-card-icon has-img"><img src="${t.iconUrl}" alt="${t.name}" loading="lazy" onerror="this.onerror=null;this.style.display='none'"></div>`
      : `<div class="template-card-icon" style="background:${catColor}"><i class="${catIcon}"></i></div>`;

    return `\t\t\t\t<div class="col-lg-4 col-md-6 mb-4 template-item" data-category="${t.category}">
\t\t\t\t\t<div class="template-card" data-slug="${t.slug}" onclick="openTemplate('${t.slug}')">
\t\t\t\t\t\t${iconHtml}
\t\t\t\t\t\t<h3><a href="templates/${t.slug}.html" onclick="event.preventDefault()">${t.name}</a></h3>
\t\t\t\t\t\t<p>${t.description}</p>
\t\t\t\t\t\t<div class="template-card-meta">
\t\t\t\t\t\t\t${pricingBadge}
\t\t\t\t\t\t\t<span class="template-creator"><i class="bi bi-person"></i>${t.creatorName || 'Flyto2'}</span>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="template-card-meta" style="margin-top:8px">${tags}</div>
\t\t\t\t\t</div>
\t\t\t\t</div>`;
  }).join('\n');

  // ── Build template data for dialog (embed pre-rendered HTML) ──────────
  const templateDialogData = {};
  for (const t of templates) {
    // Try to load markdown content if available
    const mdPath = path.join(CONTENT_DIR, `${t.slug}.md`);
    let contentHtml = '';
    if (fs.existsSync(mdPath)) {
      contentHtml = mdToHtml(fs.readFileSync(mdPath, 'utf8'));
    } else {
      contentHtml = `<h2>About</h2><p>${t.description}</p>`;
    }

    // Related templates (same category, max 3)
    const related = templates
      .filter(r => r.category === t.category && r.slug !== t.slug)
      .slice(0, 3)
      .map(r => ({
        slug: r.slug,
        name: r.name,
        description: r.description,
        iconUrl: r.iconUrl || '',
        categoryColor: r.categoryColor || '#6B7280',
        categoryIcon: r.categoryIcon || 'bi-box',
      }));

    templateDialogData[t.slug] = {
      name: t.name,
      description: t.description,
      category: t.category,
      categoryLabel: t.categoryLabel || t.category,
      categoryColor: t.categoryColor || '#6B7280',
      categoryIcon: t.categoryIcon || 'bi-box',
      iconUrl: t.iconUrl || '',
      pricing: t.pricing || 'free',
      price: t.price || 0,
      tags: t.tags,
      downloads: t.downloads || 0,
      creatorName: t.creatorName || 'Flyto2',
      content: contentHtml,
      related: related
    };
  }

  // Structured data - ItemList
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Flyto2 Automation Templates',
    description: 'Free no-code automation templates for browser tasks, web scraping, monitoring, and data processing.',
    numberOfItems: templates.length,
    itemListElement: templates.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      description: t.description,
      url: `${BASE_URL}/templates/${t.slug}.html`
    }))
  };

  const html = `<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
${ANALYTICS}
${headCommon('./')}
\t<title>Flyto2 Templates - Free No-Code Automation Templates</title>
\t<meta name="description" content="Browse ${templates.length}+ free automation templates. Web scraping, monitoring, data conversion, and more. No coding required. Import and run in seconds with Flyto2.">

${csp()}

\t<!-- SEO Meta Tags -->
\t<link rel="canonical" href="${BASE_URL}/templates.html">
${hreflangLinks('templates.html')}
\t<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
\t<meta name="keywords" content="automation templates, no code templates, browser automation workflows, web scraping templates, free automation tools, flyto2 templates, pre-built workflows, no code web scraping, automate browser tasks templates">

\t<!-- Open Graph -->
\t<meta property="og:type" content="website">
\t<meta property="og:url" content="${BASE_URL}/templates.html">
\t<meta property="og:title" content="Flyto2 Templates - Free No-Code Automation Templates">
\t<meta property="og:description" content="Browse ${templates.length}+ free automation templates. Web scraping, monitoring, data conversion, and more.">
\t<meta property="og:image" content="${BASE_URL}/assets/img/og-image.png">
\t<meta property="og:site_name" content="Flyto2">

\t<!-- Twitter Card -->
\t<meta name="twitter:card" content="summary_large_image">
\t<meta name="twitter:title" content="Flyto2 Templates - Free No-Code Automation Templates">
\t<meta name="twitter:description" content="Browse ${templates.length}+ free automation templates. No coding required.">
\t<meta name="twitter:image" content="${BASE_URL}/assets/img/og-image.png">

${cssIncludes('./')}
${TEMPLATE_CSS}

\t<!-- Structured Data -->
\t<script type="application/ld+json">
${JSON.stringify(structuredData, null, '\t')}
\t</script>
</head>
<body>
${headerHtml}

${mobileMenuHtml}

\t<!-- Start Breadcrumb Area -->
\t<main>
\t<section id="main-content" class="breadcrumb-area hero-wave-bg">
\t\t<div class="container">
\t\t\t<div class="row">
\t\t\t\t<div class="col-lg-12">
\t\t\t\t\t<div class="breadcrumb-content">
\t\t\t\t\t\t<h1 data-i18n="landing.templates.hero.title">Marketplace</h1>
\t\t\t\t\t\t<p style="color:rgba(255,255,255,0.8);font-size:18px;margin-top:12px" data-i18n="landing.templates.hero.subtitle">Browse ${templates.length}+ ready-to-use templates. Import, customize, and run — no coding required.</p>
\t\t\t\t\t\t<ul>
\t\t\t\t\t\t\t<li><a href="./" data-i18n="landing.common.nav.home">Home</a></li>
\t\t\t\t\t\t\t<li data-i18n="landing.common.nav.marketplace">Marketplace</li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t\t<div class="wave-divider">
\t\t\t<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
\t\t\t\t<path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
\t\t\t</svg>
\t\t</div>
\t</section>
\t<!-- End Breadcrumb Area -->

\t<!-- Filters -->
\t<section class="template-filters">
\t\t<div class="container">
\t\t\t${filterButtons.join('\n\t\t\t')}
\t\t</div>
\t</section>

\t<!-- Grid -->
\t<section class="template-grid">
\t\t<div class="container">
\t\t\t<div class="row" id="templateGrid">
${cards}
\t\t\t</div>
\t\t\t<!-- Pagination -->
\t\t\t<nav id="pagination" aria-label="Template pages" style="margin-top:30px">
\t\t\t\t<ul class="tmpl-pagination" id="paginationList"></ul>
\t\t\t</nav>
\t\t</div>
\t</section>

\t<!-- Template Detail Dialog -->
\t<div class="modal fade" id="templateModal" tabindex="-1" aria-hidden="true">
\t\t<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
\t\t\t<div class="modal-content">
\t\t\t\t<!-- Hero -->
\t\t\t\t<div class="dlg-hero">
\t\t\t\t\t<button class="dlg-close" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-lg"></i></button>
\t\t\t\t\t<div class="dlg-hero-top">
\t\t\t\t\t\t<div class="dlg-hero-icon" id="dlgIcon"></div>
\t\t\t\t\t\t<div class="dlg-hero-info">
\t\t\t\t\t\t\t<h2 id="dlgTitle"></h2>
\t\t\t\t\t\t\t<p id="dlgDesc"></p>
\t\t\t\t\t\t\t<div class="dlg-hero-badges">
\t\t\t\t\t\t\t\t<span class="badge dlg-badge-cat" id="dlgCatBadge"></span>
\t\t\t\t\t\t\t\t<span class="badge dlg-badge-free" id="dlgPriceBadge">Free</span>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<!-- Body -->
\t\t\t\t<div class="dlg-body">
\t\t\t\t\t<div class="dlg-layout">
\t\t\t\t\t\t<!-- Main content (markdown) -->
\t\t\t\t\t\t<div class="dlg-main">
\t\t\t\t\t\t\t<div class="dlg-content" id="dlgContent"></div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<!-- Sidebar -->
\t\t\t\t\t\t<div class="dlg-sidebar">
\t\t\t\t\t\t\t<a id="dlgCtaUse" href="${APP_URL}/templates" class="dlg-cta"><i class="bi bi-play-circle"></i> Use This Template</a>
\t\t\t\t\t\t\t<a href="app.html" class="dlg-cta-secondary"><i class="bi bi-download"></i> Download Desktop App</a>
\t\t\t\t\t\t\t<div class="dlg-info-card">
\t\t\t\t\t\t\t\t<h4>Template Info</h4>
\t\t\t\t\t\t\t\t<div class="dlg-info-row"><span class="dlg-info-label">Category</span><span class="dlg-info-value" id="dlgInfoCat"></span></div>
\t\t\t\t\t\t\t\t<div class="dlg-info-row"><span class="dlg-info-label">Creator</span><span class="dlg-info-value" id="dlgInfoCreator"></span></div>
\t\t\t\t\t\t\t\t<div class="dlg-info-row"><span class="dlg-info-label">Downloads</span><span class="dlg-info-value" id="dlgInfoDownloads"></span></div>
\t\t\t\t\t\t\t\t<div class="dlg-info-row"><span class="dlg-info-label">Price</span><span class="dlg-info-value" id="dlgInfoPrice" style="color:#10B981">Free</span></div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="dlg-tags" id="dlgTags"></div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<!-- Related Templates -->
\t\t\t\t<div class="dlg-related" id="dlgRelated" style="display:none">
\t\t\t\t\t<h3>Related Templates</h3>
\t\t\t\t\t<div class="dlg-related-grid" id="dlgRelatedGrid"></div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</div>
\t</main>

${footerHtml}

${jsIncludes('./')}
\t<script>
\t// ── Template data (pre-rendered) ────────────────────────────────────────
\tvar TEMPLATES = ${JSON.stringify(templateDialogData)};

\t// ── Open template dialog ────────────────────────────────────────────────
\tfunction openTemplate(slug) {
\t\tvar t = TEMPLATES[slug];
\t\tif (!t) return;

\t\t// Hero icon
\t\tvar iconEl = document.getElementById('dlgIcon');
\t\tif (t.iconUrl) {
\t\t\tvar img = document.createElement('img');
\t\t\timg.src = t.iconUrl;
\t\t\timg.alt = t.name;
\t\t\timg.width = 40; img.height = 40;
\t\t\timg.style.cssText = 'object-fit:contain;border-radius:6px';
\t\t\timg.onerror = function() { iconEl.innerHTML = '<i class="' + t.categoryIcon + '"></i>'; };
\t\t\ticonEl.innerHTML = '';
\t\t\ticonEl.appendChild(img);
\t\t} else {
\t\t\ticonEl.innerHTML = '<i class="' + t.categoryIcon + '"></i>';
\t\t}
\t\tdocument.getElementById('dlgTitle').textContent = t.name;
\t\tdocument.getElementById('dlgDesc').textContent = t.description;
\t\tdocument.getElementById('dlgCatBadge').innerHTML = '<i class="' + t.categoryIcon + '"></i> ' + t.categoryLabel;
\t\t// Pricing badge
\t\tvar priceBadge = document.getElementById('dlgPriceBadge');
\t\tif (t.pricing === 'free') {
\t\t\tpriceBadge.textContent = 'Free';
\t\t\tpriceBadge.className = 'badge dlg-badge-free';
\t\t} else {
\t\t\tpriceBadge.textContent = '$' + t.price;
\t\t\tpriceBadge.className = 'badge dlg-badge-paid';
\t\t}

\t\t// Content
\t\tdocument.getElementById('dlgContent').innerHTML = t.content;

\t\t// Sidebar info
\t\tdocument.getElementById('dlgInfoCat').textContent = t.categoryLabel;
\t\tdocument.getElementById('dlgInfoCreator').textContent = t.creatorName || 'Flyto2';
\t\tdocument.getElementById('dlgInfoDownloads').textContent = (t.downloads || 0).toLocaleString();
\t\tvar priceEl = document.getElementById('dlgInfoPrice');
\t\tpriceEl.textContent = t.pricing === 'free' ? 'Free' : '$' + t.price;
\t\tpriceEl.style.color = t.pricing === 'free' ? '#10B981' : '#92400e';

\t\t// Tags
\t\tvar tagsHtml = t.tags.map(function(tag) { return '<span class="template-tag">' + tag + '</span>'; }).join('');
\t\tdocument.getElementById('dlgTags').innerHTML = tagsHtml;

\t\t// Related templates
\t\tvar relEl = document.getElementById('dlgRelated');
\t\tvar relGrid = document.getElementById('dlgRelatedGrid');
\t\tif (t.related && t.related.length > 0) {
\t\t\trelEl.style.display = '';
\t\t\trelGrid.innerHTML = t.related.map(function(r) {
\t\t\t\tvar rIcon = r.iconUrl
\t\t\t\t\t? '<img src="' + r.iconUrl + '" width="24" height="24" style="object-fit:contain;border-radius:4px;margin-right:8px;vertical-align:middle">'
\t\t\t\t\t: '<i class="' + r.categoryIcon + '" style="color:' + r.categoryColor + ';margin-right:8px"></i>';
\t\t\t\treturn '<div class="dlg-related-card" onclick="openTemplate(\\'' + r.slug + '\\')">' +
\t\t\t\t\t'<h4>' + rIcon + r.name + '</h4>' +
\t\t\t\t\t'<p>' + r.description + '</p>' +
\t\t\t\t'</div>';
\t\t\t}).join('');
\t\t} else {
\t\t\trelEl.style.display = 'none';
\t\t}

\t\t// Update URL hash
\t\thistory.replaceState(null, '', '#' + slug);

\t\t// Scroll dialog content to top
\t\tvar dlgMain = document.querySelector('.dlg-main');
\t\tif (dlgMain) dlgMain.scrollTop = 0;

\t\t// Show modal
\t\tvar modalEl = document.getElementById('templateModal');
\t\tvar modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
\t\tmodal.show();
\t}

\t// ── Pagination + Filter ─────────────────────────────────────────────
\t(function() {
\t\tvar PER_PAGE = 12;
\t\tvar currentPage = 1;
\t\tvar currentCat = 'all';
\t\tvar allItems = Array.from(document.querySelectorAll('.template-item'));
\t\tvar btns = document.querySelectorAll('.filter-btn');
\t\tvar pagList = document.getElementById('paginationList');

\t\tfunction getFiltered() {
\t\t\treturn allItems.filter(function(item) {
\t\t\t\treturn currentCat === 'all' || item.getAttribute('data-category') === currentCat;
\t\t\t});
\t\t}

\t\tfunction render() {
\t\t\tvar filtered = getFiltered();
\t\t\tvar totalPages = Math.ceil(filtered.length / PER_PAGE);
\t\t\tif (currentPage > totalPages) currentPage = totalPages || 1;

\t\t\tvar start = (currentPage - 1) * PER_PAGE;
\t\t\tvar end = start + PER_PAGE;
\t\t\tvar visible = new Set(filtered.slice(start, end));

\t\t\tallItems.forEach(function(item) {
\t\t\t\titem.style.display = visible.has(item) ? '' : 'none';
\t\t\t});

\t\t\trenderPagination(totalPages);
\t\t}

\t\tfunction renderPagination(totalPages) {
\t\t\tif (totalPages <= 1) { pagList.innerHTML = ''; return; }

\t\t\tvar html = '';
\t\t\t// Prev
\t\t\thtml += '<li><button class="page-btn' + (currentPage === 1 ? ' disabled' : '') + '" data-page="' + (currentPage - 1) + '"><i class="bi bi-chevron-left"></i></button></li>';

\t\t\t// Page numbers with ellipsis
\t\t\tvar pages = buildPageNumbers(currentPage, totalPages);
\t\t\tfor (var i = 0; i < pages.length; i++) {
\t\t\t\tif (pages[i] === '...') {
\t\t\t\t\thtml += '<li><span class="page-ellipsis">...</span></li>';
\t\t\t\t} else {
\t\t\t\t\thtml += '<li><button class="page-btn' + (pages[i] === currentPage ? ' active' : '') + '" data-page="' + pages[i] + '">' + pages[i] + '</button></li>';
\t\t\t\t}
\t\t\t}

\t\t\t// Next
\t\t\thtml += '<li><button class="page-btn' + (currentPage === totalPages ? ' disabled' : '') + '" data-page="' + (currentPage + 1) + '"><i class="bi bi-chevron-right"></i></button></li>';

\t\t\tpagList.innerHTML = html;

\t\t\t// Bind clicks
\t\t\tpagList.querySelectorAll('.page-btn').forEach(function(btn) {
\t\t\t\tbtn.addEventListener('click', function() {
\t\t\t\t\tvar p = parseInt(this.getAttribute('data-page'));
\t\t\t\t\tif (p >= 1 && p <= totalPages) {
\t\t\t\t\t\tcurrentPage = p;
\t\t\t\t\t\trender();
\t\t\t\t\t\tdocument.querySelector('.template-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
\t\t\t\t\t}
\t\t\t\t});
\t\t\t});
\t\t}

\t\tfunction buildPageNumbers(current, total) {
\t\t\tif (total <= 7) {
\t\t\t\tvar arr = [];
\t\t\t\tfor (var i = 1; i <= total; i++) arr.push(i);
\t\t\t\treturn arr;
\t\t\t}
\t\t\tvar pages = [1];
\t\t\tif (current > 3) pages.push('...');
\t\t\tfor (var j = Math.max(2, current - 1); j <= Math.min(total - 1, current + 1); j++) {
\t\t\t\tpages.push(j);
\t\t\t}
\t\t\tif (current < total - 2) pages.push('...');
\t\t\tpages.push(total);
\t\t\treturn pages;
\t\t}

\t\t// Category filter
\t\tbtns.forEach(function(btn) {
\t\t\tbtn.addEventListener('click', function() {
\t\t\t\tbtns.forEach(function(b) { b.classList.remove('active'); });
\t\t\t\tbtn.classList.add('active');
\t\t\t\tcurrentCat = btn.getAttribute('data-category');
\t\t\t\tcurrentPage = 1;
\t\t\t\trender();
\t\t\t});
\t\t});

\t\t// Initial render
\t\trender();

\t\t// Hash restore
\t\tvar hash = window.location.hash.replace('#', '');
\t\tif (hash && TEMPLATES[hash]) {
\t\t\tsetTimeout(function() { openTemplate(hash); }, 300);
\t\t}

\t\t// Clear hash when modal closes
\t\tdocument.getElementById('templateModal').addEventListener('hidden.bs.modal', function() {
\t\t\thistory.replaceState(null, '', window.location.pathname + window.location.search);
\t\t});
\t})();
\t</script>
</body>
</html>`;

  fs.writeFileSync(path.join(ROOT, 'templates.html'), html, 'utf8');
  console.log('  templates.html (gallery)');
}

// ═══════════════════════════════════════════════════════════════════════════
// DETAIL PAGES
// ═══════════════════════════════════════════════════════════════════════════
function buildDetailPage(t) {
  const cat = categories[t.category] || { label: t.categoryLabel || t.category, color: t.categoryColor || '#6B7280', icon: t.categoryIcon || 'bi-box' };
  const relRoot = '../';

  // Generate SEO fields from template data if not present
  const seo = t.seo || {
    title: `${t.name} - Automation Template | Flyto2`,
    description: t.description || `Use ${t.name} automation template on Flyto2. No coding required.`,
    keywords: (t.tags || []).join(', '),
  };

  // Read MD content
  const mdPath = path.join(CONTENT_DIR, `${t.slug}.md`);
  let contentHtml = '';
  if (fs.existsSync(mdPath)) {
    const md = fs.readFileSync(mdPath, 'utf8');
    contentHtml = mdToHtml(md);
  } else {
    contentHtml = `<h2>How It Works</h2><p>${t.description}</p>`;
  }

  // Related templates (same category, max 3)
  const related = templates
    .filter(r => r.category === t.category && r.slug !== t.slug)
    .slice(0, 3);

  const relatedCards = related.map(r => {
    const rCat = categories[r.category];
    return `\t\t\t\t<div class="col-lg-4 col-md-6 mb-4">
\t\t\t\t\t<div class="template-card">
\t\t\t\t\t\t<div class="template-card-icon" style="background:${rCat.color}"><i class="${rCat.icon}"></i></div>
\t\t\t\t\t\t<h3><a href="${r.slug}.html">${r.name}</a></h3>
\t\t\t\t\t\t<p>${r.description}</p>
\t\t\t\t\t\t<div class="template-card-meta">
\t\t\t\t\t\t\t${difficultyBadge(r.difficulty)}
\t\t\t\t\t\t\t<span class="template-time"><i class="bi bi-clock"></i>${r.estimatedTime}</span>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>`;
  }).join('\n');

  // Tags
  const tagsHtml = t.tags.map(tag => `<span class="template-tag">${tag}</span>`).join(' ');

  // Structured data - SoftwareApplication + HowTo
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: t.name,
      description: t.description,
      applicationCategory: 'BrowserApplication',
      operatingSystem: 'Windows, macOS, Linux',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Organization', name: 'Flyto2', url: BASE_URL }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use ${t.name}`,
      description: seo.description,
      totalTime: 'PT5M',
      tool: { '@type': 'SoftwareApplication', name: 'Flyto2' },
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Open Flyto2', text: 'Open Flyto2 desktop app or cloud platform' },
        { '@type': 'HowToStep', position: 2, name: 'Import Template', text: `Import the ${t.name} template from the marketplace` },
        { '@type': 'HowToStep', position: 3, name: 'Configure & Run', text: 'Set your parameters and run the automation' }
      ]
    }
  ];

  const fixedHeader = fixPaths(headerHtml, relRoot);
  const fixedFooter = fixPaths(footerHtml, relRoot);
  const fixedMobileMenu = fixPaths(mobileMenuHtml, relRoot);

  const html = `<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
${ANALYTICS}
${headCommon(relRoot)}
\t<title>${seo.title}</title>
\t<meta name="description" content="${seo.description}">

${csp()}

\t<!-- SEO Meta Tags -->
\t<link rel="canonical" href="${BASE_URL}/templates/${t.slug}.html">
${hreflangLinks(`templates/${t.slug}.html`)}
\t<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
\t<meta name="keywords" content="${seo.keywords}">

\t<!-- Open Graph -->
\t<meta property="og:type" content="article">
\t<meta property="og:url" content="${BASE_URL}/templates/${t.slug}.html">
\t<meta property="og:title" content="${seo.title}">
\t<meta property="og:description" content="${seo.description}">
\t<meta property="og:image" content="${BASE_URL}/assets/img/og-image.png">
\t<meta property="og:site_name" content="Flyto2">

\t<!-- Twitter Card -->
\t<meta name="twitter:card" content="summary_large_image">
\t<meta name="twitter:title" content="${seo.title}">
\t<meta name="twitter:description" content="${seo.description}">
\t<meta name="twitter:image" content="${BASE_URL}/assets/img/og-image.png">

${cssIncludes(relRoot)}
${TEMPLATE_CSS}

\t<!-- Structured Data -->
\t<script type="application/ld+json">
${JSON.stringify(structuredData[0], null, '\t')}
\t</script>
\t<script type="application/ld+json">
${JSON.stringify(structuredData[1], null, '\t')}
\t</script>
</head>
<body>
${fixedHeader}

${fixedMobileMenu}

\t<!-- Hero -->
\t<main>
\t<section class="detail-hero">
\t\t<div class="container">
\t\t\t<div class="breadcrumb">
\t\t\t\t<a href="${relRoot}">Home</a><span>/</span>
\t\t\t\t<a href="${relRoot}templates.html">Templates</a><span>/</span>
\t\t\t\t${t.name}
\t\t\t</div>
\t\t\t<h1>${t.name}</h1>
\t\t\t<p>${t.description}</p>
\t\t\t<div class="meta" style="margin-top:16px">
\t\t\t\t${categoryBadge(t.category)}
\t\t\t\t<span class="badge" style="background:rgba(255,255,255,0.2)">${t.pricing === 'free' ? 'Free' : '$' + t.price}</span>
\t\t\t\t<span style="font-size:14px;opacity:0.8"><i class="bi bi-person"></i> ${t.creatorName || 'Flyto2'}</span>
\t\t\t</div>
\t\t</div>
\t</section>

\t<!-- Content -->
\t<section class="detail-content">
\t\t<div class="container">
\t\t\t<div class="row">
\t\t\t\t<!-- Main Content -->
\t\t\t\t<div class="col-lg-8">
\t\t\t\t\t<div class="main-content">
${contentHtml}
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<!-- Sidebar -->
\t\t\t\t<div class="col-lg-4">
\t\t\t\t\t<div class="detail-sidebar">
\t\t\t\t\t\t<a href="${APP_URL}/templates" class="btn-use-template"><i class="bi bi-play-circle"></i> Use This Template</a>
\t\t\t\t\t\t<a href="${relRoot}app.html" class="btn-download-desktop"><i class="bi bi-download"></i> Download Desktop App</a>

\t\t\t\t\t\t<div class="sidebar-card" style="margin-top:20px">
\t\t\t\t\t\t\t<h4>Template Info</h4>
\t\t\t\t\t\t\t<div class="info-row"><span class="info-label">Category</span><span class="info-value">${cat.label}</span></div>
\t\t\t\t\t\t\t<div class="info-row"><span class="info-label">Creator</span><span class="info-value">${t.creatorName || 'Flyto2'}</span></div>
\t\t\t\t\t\t\t<div class="info-row"><span class="info-label">Downloads</span><span class="info-value">${t.downloads || 0}</span></div>
\t\t\t\t\t\t\t<div class="info-row"><span class="info-label">Price</span><span class="info-value" style="color:#10B981">Free</span></div>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<div class="sidebar-card">
\t\t\t\t\t\t\t<h4>Tags</h4>
\t\t\t\t\t\t\t<div style="display:flex;flex-wrap:wrap;gap:6px">${tagsHtml}</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>

${related.length > 0 ? `\t<!-- Related Templates -->
\t<section class="related-templates">
\t\t<div class="container">
\t\t\t<h2>Related Templates</h2>
\t\t\t<div class="row">
${relatedCards}
\t\t\t</div>
\t\t\t<div class="text-center mt-4">
\t\t\t\t<a href="${relRoot}templates.html" class="filter-btn" style="font-size:16px;padding:12px 32px">Browse All Templates</a>
\t\t\t</div>
\t\t</div>
\t</section>` : ''}
\t</main>

${fixedFooter}

${jsIncludes(relRoot)}
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, `${t.slug}.html`), html, 'utf8');
  console.log(`  templates/${t.slug}.html`);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
console.log('Building template pages...');
buildGalleryPage();

for (const t of templates) {
  buildDetailPage(t);
}

console.log(`\n✅ Generated ${templates.length + 1} template pages`);
console.log(`   - 1 gallery page (templates.html)`);
console.log(`   - ${templates.length} detail pages (templates/*.html)`);
