#!/usr/bin/env node
/**
 * fetch-seo-config.js
 *
 * Fetches SEO config from Firebase Firestore (public read).
 * Falls back to local seo-config.json if Firebase unavailable.
 *
 * Security:
 * - Only READ from public Firestore endpoint
 * - No credentials stored in this repo
 * - Firebase rules: allow read, deny write (unless authenticated)
 *
 * Usage:
 *   node scripts/fetch-seo-config.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Firebase project config (public, read-only)
const FIREBASE_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'flyto-cloud',
  collection: 'seo-config',
  document: 'landing-page'
};

const LOCAL_CONFIG_PATH = path.join(__dirname, 'seo-config.json');
const OUTPUT_PATH = path.join(__dirname, 'seo-config.json');

/**
 * Fetch document from Firestore REST API (no auth required for public read)
 */
function fetchFromFirestore() {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/${FIREBASE_CONFIG.collection}/${FIREBASE_CONFIG.document}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const firestoreDoc = JSON.parse(data);
            const config = parseFirestoreDocument(firestoreDoc);
            resolve(config);
          } catch (e) {
            reject(new Error(`Failed to parse Firestore response: ${e.message}`));
          }
        } else if (res.statusCode === 404) {
          reject(new Error('Firestore document not found'));
        } else {
          reject(new Error(`Firestore returned ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Parse Firestore document format to plain JSON
 */
function parseFirestoreDocument(doc) {
  if (!doc.fields) {
    throw new Error('Invalid Firestore document format');
  }

  return parseFirestoreValue({ mapValue: { fields: doc.fields } });
}

/**
 * Recursively parse Firestore typed values
 */
function parseFirestoreValue(value) {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.nullValue !== undefined) return null;

  if (value.arrayValue) {
    return (value.arrayValue.values || []).map(parseFirestoreValue);
  }

  if (value.mapValue) {
    const result = {};
    const fields = value.mapValue.fields || {};
    for (const [key, val] of Object.entries(fields)) {
      result[key] = parseFirestoreValue(val);
    }
    return result;
  }

  return null;
}

/**
 * Validate SEO config structure
 */
function validateConfig(config) {
  const required = ['baseUrl', 'pages'];
  for (const field of required) {
    if (!config[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate pages structure
  if (typeof config.pages !== 'object') {
    throw new Error('pages must be an object');
  }

  // Validate blockedPages is array
  if (config.blockedPages && !Array.isArray(config.blockedPages)) {
    throw new Error('blockedPages must be an array');
  }

  // Validate blockedPaths is array
  if (config.blockedPaths && !Array.isArray(config.blockedPaths)) {
    throw new Error('blockedPaths must be an array');
  }

  // Validate blockedBots is array
  if (config.blockedBots && !Array.isArray(config.blockedBots)) {
    throw new Error('blockedBots must be an array');
  }

  return true;
}

/**
 * Load local config as fallback
 */
function loadLocalConfig() {
  if (fs.existsSync(LOCAL_CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(LOCAL_CONFIG_PATH, 'utf8'));
  }
  throw new Error('No local config found');
}

async function main() {
  console.log('🔍 Fetching SEO config...');

  let config;
  let source;

  try {
    // Try Firebase first
    config = await fetchFromFirestore();
    validateConfig(config);
    source = 'Firebase';
    console.log('✅ Fetched from Firebase Firestore');
  } catch (firebaseError) {
    console.warn(`⚠️  Firebase fetch failed: ${firebaseError.message}`);
    console.log('📂 Falling back to local config...');

    try {
      config = loadLocalConfig();
      validateConfig(config);
      source = 'local';
      console.log('✅ Loaded local seo-config.json');
    } catch (localError) {
      console.error(`❌ Local config also failed: ${localError.message}`);
      process.exit(1);
    }
  }

  // Write config (ensures consistent format)
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(config, null, 2) + '\n', 'utf8');

  console.log(`📝 Config saved to seo-config.json (source: ${source})`);
  console.log(`   - ${Object.keys(config.pages).length} pages defined`);
  console.log(`   - ${(config.blockedPages || []).length} blocked pages`);
  console.log(`   - ${(config.blockedBots || []).length} blocked bots`);
}

main();
