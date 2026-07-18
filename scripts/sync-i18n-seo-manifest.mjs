import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));

const surfaceByPackage = {
  'flyto-landing-page': 'landing',
  'flyto-docs': 'docs',
  'flyto-blog': 'blog',
};

const surfaceKey = process.env.FLYTO2_SEO_SURFACE ?? surfaceByPackage[packageJson.name];
if (!surfaceKey) {
  console.error(`No Flyto2 SEO surface mapping for package ${packageJson.name}`);
  process.exit(1);
}

const sourcePath = process.env.FLYTO2_I18N_SEO_MANIFEST
  ? path.resolve(process.env.FLYTO2_I18N_SEO_MANIFEST)
  : path.resolve(repoRoot, '..', 'flyto-i18n', 'dist', 'seo-manifest.json');

if (!existsSync(sourcePath)) {
  console.error(`Missing upstream SEO manifest: ${sourcePath}`);
  process.exit(1);
}

const sourceText = readFileSync(sourcePath, 'utf8');
const upstream = JSON.parse(sourceText);
const surface = upstream.surfaces?.[surfaceKey];

if (!surface) {
  console.error(`Upstream SEO manifest does not define surface "${surfaceKey}"`);
  process.exit(1);
}

const requiredSignals = new Set(surface.requiredSignals ?? []);
for (const signal of ['canonical', 'hreflang-alternates', 'x-default', 'sitemap']) {
  if (!requiredSignals.has(signal)) {
    console.error(`Surface "${surfaceKey}" missing required SEO signal: ${signal}`);
    process.exit(1);
  }
}

const output = {
  version: upstream.version,
  sourceVersion: upstream.sourceVersion,
  defaultLocale: upstream.defaultLocale,
  xDefaultLocale: upstream.xDefaultLocale,
  source: {
    repository: 'flyto-i18n',
    path: 'dist/seo-manifest.json',
    sha256: createHash('sha256').update(sourceText).digest('hex'),
  },
  locales: upstream.locales,
  surfaceKey,
  surface,
};

const outputDir = path.join(repoRoot, '.seo');
const outputPath = path.join(outputDir, 'i18n-seo-manifest.json');
mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

console.log(`Synced ${surfaceKey} SEO manifest to ${path.relative(repoRoot, outputPath)}`);
