#!/usr/bin/env node
/**
 * fetch-templates.js
 *
 * Fetches public marketplace templates from flyto-cloud API.
 * Outputs: scripts/cloud-templates.json
 *
 * Usage:
 *   node scripts/fetch-templates.js
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.flyto2.com';
const OUTPUT_PATH = path.join(__dirname, 'cloud-templates.json');
const PAGE_SIZE = 50;

// Category mapping (slug → display info)
const CATEGORIES = {
  scraping:      { label: 'Web Scraping',      icon: 'bi-globe',             color: '#3B82F6' },
  automation:    { label: 'Automation',         icon: 'bi-gear',              color: '#8B5CF6' },
  monitoring:    { label: 'Monitoring',         icon: 'bi-activity',          color: '#10B981' },
  testing:       { label: 'Testing & QA',       icon: 'bi-bug',              color: '#F59E0B' },
  data:          { label: 'Data Conversion',    icon: 'bi-arrow-left-right',  color: '#EC4899' },
  api:           { label: 'API & Integration',  icon: 'bi-plug',             color: '#06B6D4' },
  productivity:  { label: 'Productivity',       icon: 'bi-lightning',         color: '#F97316' },
  notification:  { label: 'Notifications',      icon: 'bi-bell',             color: '#EF4444' },
  browser:       { label: 'Browser',            icon: 'bi-window',           color: '#6366F1' },
  ai:            { label: 'AI',                 icon: 'bi-robot',            color: '#8B5CF6' },
};

function defaultCategory(slug) {
  return { label: slug.charAt(0).toUpperCase() + slug.slice(1), icon: 'bi-box', color: '#6B7280' };
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchAllTemplates() {
  const all = [];
  let page = 1;
  let total = Infinity;

  while (all.length < total) {
    const url = `${API_BASE}/api/templates/search?page=${page}&page_size=${PAGE_SIZE}&sort_by=downloads`;
    console.log(`  Fetching page ${page}...`);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (!data.ok) throw new Error(`API returned error: ${JSON.stringify(data.error)}`);

    total = data.total;
    all.push(...data.templates);
    page++;
  }

  return all;
}

function transformTemplate(t) {
  const cat = CATEGORIES[t.category] || defaultCategory(t.category || 'other');

  return {
    id: t.id,
    slug: slugify(t.name),
    name: t.name,
    description: t.description || '',
    category: t.category || 'other',
    categoryLabel: cat.label,
    categoryColor: cat.color,
    categoryIcon: cat.icon,
    tags: t.tags || [],
    pricing: t.pricing || 'free',
    price: t.price || 0,
    iconUrl: t.icon_url || '',
    rating: t.rating,
    downloads: t.download_count || t.downloads || 0,
    creatorName: t.creator_name || t.author_name || 'Unknown',
    isFeatured: t.is_featured || false,
    isVerified: t.is_verified || false,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

async function main() {
  console.log('Fetching marketplace templates from cloud API...');

  const raw = await fetchAllTemplates();
  console.log(`  Fetched ${raw.length} templates`);

  // Transform all templates, ensure unique slugs
  const slugCounts = {};
  const templates = [];
  for (const t of raw) {
    const transformed = transformTemplate(t);
    // Ensure unique slugs by appending suffix for duplicates
    if (slugCounts[transformed.slug]) {
      slugCounts[transformed.slug]++;
      transformed.slug = transformed.slug + '-' + slugCounts[transformed.slug];
    } else {
      slugCounts[transformed.slug] = 1;
    }
    templates.push(transformed);
  }

  // Collect categories that actually have templates
  const catCounts = {};
  for (const t of templates) {
    catCounts[t.category] = (catCounts[t.category] || 0) + 1;
  }

  const categories = {};
  for (const [key, count] of Object.entries(catCounts)) {
    categories[key] = {
      ...(CATEGORIES[key] || defaultCategory(key)),
      count,
    };
  }

  const output = { categories, templates };
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');

  console.log(`\n✅ Saved ${templates.length} templates to cloud-templates.json`);
  console.log(`   Categories: ${Object.keys(categories).join(', ')}`);
}

main().catch(err => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
