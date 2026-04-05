#!/usr/bin/env node
/**
 * submit-indexnow.js
 *
 * Submits all indexable URLs to IndexNow API (Bing, Yandex, DuckDuckGo).
 * Reads URLs from the generated sitemap.xml.
 *
 * Usage:
 *   node scripts/submit-indexnow.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const INDEXNOW_KEY = 'af3d392d033d414a98d01a1868a7818d';
const BASE_URL = 'https://flyto2.com';
const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');

function extractUrlsFromSitemap() {
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1];
    if (!urls.includes(url)) {
      urls.push(url);
    }
  }
  return urls;
}

function submitBatch(urls) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: 'flyto2.com',
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls
    });

    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ sitemap.xml not found. Run generate-sitemap.js first.');
    process.exit(1);
  }

  const allUrls = extractUrlsFromSitemap();
  console.log(`📡 IndexNow: found ${allUrls.length} URLs in sitemap`);

  // IndexNow accepts max 10,000 URLs per batch
  const BATCH_SIZE = 10000;
  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    console.log(`   Submitting batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} URLs)...`);

    try {
      const result = await submitBatch(batch);
      if (result.status === 200 || result.status === 202) {
        console.log(`   ✅ Batch accepted (HTTP ${result.status})`);
      } else {
        console.warn(`   ⚠️  HTTP ${result.status}: ${result.body}`);
      }
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
    }
  }

  console.log('✅ IndexNow submission complete');
}

main();
