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
    title: 'Flyto2 Platform Audit',
    blurb:
      'Technical inventory of what ships across the Flyto2 stack: architecture, engine internals, browser modules, enterprise features, runtime plugin model, evidence loops, and public product boundaries.',
  },
  {
    slug: 'supplement',
    title: 'Audit Supplement',
    blurb:
      'Coverage the main audit left out: flyto-core with 451 registry-backed modules, 84 catalog categories, 41 built-in recipes, MCP transport, the expression engine, plugin SDK, and the bits the headline doc skipped.',
  },
  {
    slug: 'code',
    title: 'Flyto2 Code — Application-Security War Room',
    blurb:
      'A full-spectrum application-security platform with a code-intelligence layer and a closed-loop verification engine. SCA, SAST, DAST, secrets, IaC, license, container, CSPM — one console, generated pentest workflows, verified verdicts back into the war room.',
  },
  {
    slug: 'engine',
    title: 'Engineering Intelligence — 19-Dimension Analysis',
    blurb:
      'How flyto-engine receives structured analysis from flyto-indexer and stores each dimension as an independent query surface. Taint, SAST, secrets, IaC, complexity, dead code, API drift, bus factor, perf patterns — every dimension addressable without parsing the full profile blob.',
  },
  {
    slug: 'mssp-warroom',
    title: 'The MSSP War-Room: Nine Surfaces, One Closed Loop',
    blurb:
      'How Flyto2\'s 戰情室 converges nine independently-usable, individually-closed-loop security surfaces into a single unified score and one operational picture — and why the MSSP / BYO integration model, not breadth, is the differentiator.',
  },
  {
    slug: 'byo-integration',
    title: 'Bring Your Own Stack: The Integration MSSP Model',
    blurb:
      'We don\'t replace the security tools you already own — we integrate them. Bring your scanners, ratings and threat feeds, we ingest and supplement the gaps, then run correlation, scoring, pentest, evidence and red-team across the combined picture in one closed loop.',
  },
  {
    slug: 'security-surfaces',
    title: 'Nine Security Surfaces in Depth',
    blurb:
      'A surface-by-surface walkthrough of the war-room: external attack surface, code intelligence + red-team, MCP security, container/runtime, darkweb, footprint, asset map, pentest and red-team — each independently closed-loop, all sharing one execution substrate, evidence model and scoring lens.',
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
