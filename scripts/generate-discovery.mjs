import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const imageRoot = path.join(publicDir, 'assets', 'img');
const siteUrl = 'https://flyto2.com';
const defaultImageCaption = 'Flyto2 product screenshot and visual asset for AI workflow automation, Warroom CE, CTEM, and MCP automation pages.';

function xmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function titleFromFile(file) {
  return path.basename(file)
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/^\d+-/, '')
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const absolutePath = path.join(dir, entry);
    const stat = statSync(absolutePath);
    return stat.isDirectory() ? walk(absolutePath) : [absolutePath];
  });
}

function publicPath(filePath) {
  return `/${path.relative(publicDir, filePath).split(path.sep).join('/')}`;
}

function pageForImage(filePath) {
  const relativePath = publicPath(filePath);
  if (relativePath.includes('/warroom/')) return `${siteUrl}/open-source/`;
  if (relativePath.includes('/examples/')) return `${siteUrl}/cloud/templates/`;
  return `${siteUrl}/`;
}

function imageRecords() {
  return walk(imageRoot)
    .filter((file) => /\.(png|jpg|jpeg|webp|svg)$/i.test(file))
    .sort()
    .map((file) => {
      const assetPath = publicPath(file);
      return {
        file: assetPath,
        page: pageForImage(file),
        image: `${siteUrl}${assetPath}`,
        title: `Flyto2 ${titleFromFile(file)}`,
        caption: defaultImageCaption,
      };
    });
}

function writeIfChanged(filePath, content) {
  let previous = null;
  try {
    previous = readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  if (previous === content) return false;
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
  return true;
}

function imageSitemap(images) {
  const urls = images.map((image) => `  <url>
    <loc>${xmlEscape(image.page)}</loc>
    <image:image>
      <image:loc>${xmlEscape(image.image)}</image:loc>
      <image:title>${xmlEscape(image.title)}</image:title>
      <image:caption>${xmlEscape(image.caption)}</image:caption>
    </image:image>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

function manifest(images) {
  return `${JSON.stringify({
    generatedFrom: 'scripts/generate-discovery.mjs',
    sourceHash: createHash('sha256').update(images.map((image) => `${image.file}:${image.title}:${image.caption}`).join('\n')).digest('hex'),
    outputs: ['/image-sitemap.xml'],
    imageCount: images.length,
  }, null, 2)}\n`;
}

function main() {
  const images = imageRecords();
  let changed = 0;
  if (writeIfChanged(path.join(publicDir, 'image-sitemap.xml'), imageSitemap(images))) changed += 1;
  if (writeIfChanged(path.join(publicDir, 'discovery-manifest.json'), manifest(images))) changed += 1;
  console.log(`landing discovery files ready: ${images.length} image(s), ${changed} changed`);
}

main();
