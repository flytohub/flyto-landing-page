import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'docs', 'documentation-manifest.json');
const approvedEmails = new Set([
  'admin@flyto2.com', 'alerts@flyto2.com', 'conduct@flyto2.com', 'dev@flyto2.com',
  'dmarc@flyto2.com', 'hello@flyto2.com', 'info@flyto2.com', 'noreply@flyto2.com',
  'oncall@flyto2.com', 'pentest@flyto2.com', 'privacy@flyto2.com', 'reports@flyto2.com',
  'sales@flyto2.com', 'security@flyto2.com', 'support@flyto2.com', 'team@flyto2.com',
]);
const requiredDocs = [
  'AGENTS.md', 'CLAUDE.md', 'PROJECT.md', 'ARCHITECTURE.md', 'STATE.md', 'ROADMAP.md',
  'tasks.md', 'DECISIONS.md', 'CHANGELOG.md', 'README.md', 'SECURITY.md',
  'docs/README.md', 'docs/WHITEPAPER.md', 'docs/documentation-manifest.json',
  'handoffs/_registry.md',
];
const textExtensions = new Set(['.cjs', '.css', '.example', '.html', '.js', '.json', '.jsx', '.md', '.mjs', '.rules', '.svg', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml']);
const sourceExtensions = new Set(['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx']);

function trackedFiles() {
  return execFileSync('git', ['-C', root, 'ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean)
    .sort();
}

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function globRegex(pattern) {
  let output = '^';
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === '*' && pattern[index + 1] === '*') {
      output += '.*';
      index += 1;
    } else if (char === '*') output += '[^/]*';
    else if (char === '?') output += '[^/]';
    else output += char.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
  }
  return new RegExp(`${output}$`);
}

function matches(relativePath, patterns) {
  return patterns.some((pattern) => globRegex(pattern).test(relativePath));
}

function patternHasFile(pattern, files) {
  return files.some((file) => globRegex(pattern).test(file));
}

function shouldOwn(relativePath) {
  if (sourceExtensions.has(path.extname(relativePath))) return true;
  if (/^(content|messages)\//.test(relativePath)) return true;
  if (/^public\/(?:\.well-known|bimi)\//.test(relativePath)) return true;
  if (/^public\/(?:robots\.txt|llms(?:-full)?\.txt|image-sitemap\.xml|discovery-manifest\.json)$/.test(relativePath)) return true;
  if (/^(?:\.seo\/i18n-seo-manifest\.json|firestore\.(?:indexes\.json|rules)|package\.json|next\.config\.mjs|open-next\.config\.ts|wrangler\.json|lighthouserc\.cjs)$/.test(relativePath)) return true;
  if (/^\.github\/(?:workflows|dependabot\.yml)/.test(relativePath)) return true;
  return false;
}

function checkGenerated(errors) {
  const result = spawnSync(process.execPath, ['scripts/generate-documentation-reference.mjs', '--check'], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    errors.push(...`${result.stderr}${result.stdout}`.split(/\r?\n/).filter(Boolean));
  }
}

function checkDocumentation() {
  const errors = [];
  const files = trackedFiles();
  const fileSet = new Set(files);
  checkGenerated(errors);

  for (const file of requiredDocs) {
    if (!fileSet.has(file)) errors.push(`missing required documentation: ${file}`);
  }
  if (!existsSync(manifestPath)) {
    errors.push('missing docs/documentation-manifest.json');
  } else {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const areas = manifest.source_areas ?? [];
    for (const area of areas) {
      if (!area.id || !Array.isArray(area.paths) || !area.paths.length) errors.push(`invalid source area: ${JSON.stringify(area)}`);
      for (const documentPattern of area.documentation ?? []) {
        if (!patternHasFile(documentPattern, files)) errors.push(`documentation target has no file: ${area.id} -> ${documentPattern}`);
      }
    }
    for (const file of files.filter(shouldOwn)) {
      if (!areas.some((area) => matches(file, area.paths ?? []))) errors.push(`source file has no documentation owner: ${file}`);
    }
  }

  for (const file of files.filter((entry) => entry.endsWith('.md'))) {
    const content = read(file);
    if (!/^#\s+\S/m.test(content) && !/<h1\b/i.test(content)) errors.push(`Markdown file has no H1: ${file}`);
  }

  const currentDocs = files.filter((file) => file.endsWith('.md') && !file.startsWith('handoffs/'));
  for (const file of currentDocs) {
    const content = read(file);
    if (/\b(?:411|412|417)\+?\s+(?:modules?|模組)/i.test(content)) errors.push(`stale module count in ${file}`);
    if (/flyto-landing-page\s*\|\s*Vue\s*3\s*\/\s*Astro/i.test(content)) errors.push(`stale landing stack in ${file}`);
    if (/output:\s*['"]export['"]/i.test(content)) errors.push(`stale static-export claim in ${file}`);
    if (/GitHub Pages/i.test(content)) errors.push(`stale GitHub Pages deployment claim in ${file}`);
    if (/\bFlyto\b(?!2)/.test(content)) errors.push(`bare Flyto brand in ${file}`);
  }

  for (const file of files.filter((entry) => entry !== 'package-lock.json' && (textExtensions.has(path.extname(entry)) || path.basename(entry).startsWith('.env')))) {
    const content = read(file);
    for (const match of content.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
      const email = match[0].toLowerCase();
      if (!approvedEmails.has(email)) errors.push(`unapproved email ${email} in ${file}`);
    }
  }

  const packageJson = JSON.parse(read('package.json'));
  if (!packageJson.scripts?.['docs:reference'] || !packageJson.scripts?.['docs:check']) errors.push('package.json must expose docs:reference and docs:check');
  if (!String(packageJson.scripts?.verify ?? '').includes('docs:check')) errors.push('npm run verify must include docs:check');

  if (errors.length) {
    console.error('Landing documentation contract failed:');
    for (const error of [...new Set(errors)].sort()) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`landing documentation contract passed: ${files.filter((file) => file.endsWith('.md')).length} Markdown files`);
}

checkDocumentation();
