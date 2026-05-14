import { readFileSync } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'whitepaper');

export interface WhitepaperMeta {
  slug: string;
  title: string;
  blurb: string;
  /** Approx reading minutes — calculated from word count. */
  readingMinutes: number;
}

const ENTRIES: Omit<WhitepaperMeta, 'readingMinutes'>[] = [
  {
    slug: 'audit',
    title: 'Flyto Platform Audit',
    blurb:
      '8 projects · 579 modules · 946 API endpoints. The full technical inventory of what ships across the Flyto2 stack — architecture, engine internals, browser modules, enterprise features, runtime plugin model.',
  },
  {
    slug: 'supplement',
    title: 'Audit Supplement',
    blurb:
      'Coverage the main audit left out: 8 MCP tools, 37 pre-built recipes, the expression engine, plugin SDK, and the bits the headline doc skipped.',
  },
];

function countMinutes(md: string): number {
  // Chinese-heavy docs: ~400 chars/min reading; English ~250 wpm.
  // Hybrid heuristic: total chars / 350.
  return Math.max(1, Math.round(md.length / 350));
}

export function listWhitepapers(): WhitepaperMeta[] {
  return ENTRIES.map((e) => {
    const md = readFileSync(path.join(CONTENT_DIR, `${e.slug}.md`), 'utf8');
    return { ...e, readingMinutes: countMinutes(md) };
  });
}

export function readWhitepaper(slug: string): { meta: WhitepaperMeta; body: string } | null {
  const meta = ENTRIES.find((e) => e.slug === slug);
  if (!meta) return null;
  const body = readFileSync(path.join(CONTENT_DIR, `${slug}.md`), 'utf8');
  return { meta: { ...meta, readingMinutes: countMinutes(body) }, body };
}

export function whitepaperSlugs(): string[] {
  return ENTRIES.map((e) => e.slug);
}
