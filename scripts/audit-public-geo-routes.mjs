import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const requiredRoutes = [
  'pricing',
  'security',
  'enterprise',
  'airgap',
  'open-source',
  'aikido-alternative',
  'compare',
  'api-docs',
  'trust',
  'docs',
  'blog',
  'changelog',
];

const requiredStatic = [
  'public/robots.txt',
  'public/llms.txt',
  'public/llms-full.txt',
  'public/.well-known/security.txt',
];

const failures = [];

for (const route of requiredRoutes) {
  const page = path.join(root, 'app', '[locale]', route, 'page.tsx');
  if (!existsSync(page)) {
    failures.push(`missing source route: /${route}/`);
  }
}

for (const file of requiredStatic) {
  if (!existsSync(path.join(root, file))) {
    failures.push(`missing static GEO file: ${file}`);
  }
}

const sitemap = readFileSync(path.join(root, 'app', 'sitemap.ts'), 'utf8');
if (!sitemap.includes('requiredGeoRoutes')) {
  failures.push('sitemap.ts must include requiredGeoRoutes');
}

const llms = readFileSync(path.join(root, 'public', 'llms.txt'), 'utf8');
const full = readFileSync(path.join(root, 'public', 'llms-full.txt'), 'utf8');
for (const route of requiredRoutes) {
  const url = `https://flyto2.com/${route}/`;
  if (!llms.includes(url)) {
    failures.push(`llms.txt missing ${url}`);
  }
  if (!full.includes(`/${route}/`) && !full.includes(url)) {
    failures.push(`llms-full.txt missing /${route}/`);
  }
}

const robots = readFileSync(path.join(root, 'public', 'robots.txt'), 'utf8');
for (const ua of ['OAI-SearchBot', 'ChatGPT-User', 'Claude-User', 'PerplexityBot', 'Googlebot', 'Bingbot']) {
  if (!robots.includes(`User-agent: ${ua}`)) {
    failures.push(`robots.txt missing explicit UA policy for ${ua}`);
  }
}

if (failures.length) {
  console.error('public GEO route audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`public GEO route audit passed: ${requiredRoutes.length} routes`);
