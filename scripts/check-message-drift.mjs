import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const messagesDir = path.join(root, 'messages');
const baselineLocale = 'en';
const failures = [];

function fail(message) {
  failures.push(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`${path.relative(root, filePath)} is invalid JSON: ${error.message}`);
    return null;
  }
}

function collectKeys(value, prefix = '') {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      return collectKeys(child, nextPrefix);
    });
  }
  return [prefix];
}

function compare(locale, keys, baselineKeys) {
  const keySet = new Set(keys);
  const missing = baselineKeys.filter((key) => !keySet.has(key));
  const extra = keys.filter((key) => !baselineKeys.includes(key));

  if (missing.length) fail(`${locale} missing key(s): ${missing.slice(0, 20).join(', ')}`);
  if (extra.length) fail(`${locale} has orphan key(s): ${extra.slice(0, 20).join(', ')}`);
}

if (!existsSync(messagesDir)) fail('messages directory is missing');

const files = existsSync(messagesDir)
  ? readdirSync(messagesDir).filter((file) => file.endsWith('.json')).sort()
  : [];
const baselineFile = path.join(messagesDir, `${baselineLocale}.json`);
const baseline = readJson(baselineFile);
const baselineKeys = baseline ? collectKeys(baseline).sort() : [];

if (!baselineKeys.length) fail(`${baselineLocale}.json has no message keys`);

for (const file of files) {
  const locale = path.basename(file, '.json');
  const data = readJson(path.join(messagesDir, file));
  if (!data) continue;
  const keys = collectKeys(data).sort();
  compare(locale, keys, baselineKeys);
}

if (failures.length) {
  console.error('message drift check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`message drift check passed: ${files.length} locale files, ${baselineKeys.length} baseline keys`);
