import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Sparkles, Wrench, Bug, ShieldCheck } from 'lucide-react';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;
  return {
    title: 'Changelog — what shipped recently',
    description:
      'Recent releases of Flyto2 Cloud — features, fixes, security, performance. Roughly weekly cadence.',
    alternates: pageAlternates('cloud/changelog'),
  };
}

type Kind = 'feature' | 'fix' | 'security' | 'improvement';

interface Release {
  version: string;
  date: string;
  headline: string;
  items: { kind: Kind; body: string }[];
}

const RELEASES: Release[] = [
  {
    version: '2.4.2',
    date: '2026-05-13',
    headline: 'IME composition + macOS Sequoia coordinate fixes',
    items: [
      { kind: 'fix',  body: 'Recorder now listens on compositionend, so kana / hangul / pinyin → composed-character flows record correctly (was capturing pre-composition keystrokes).' },
      { kind: 'fix',  body: 'macOS Sequoia coordinate-system regression resolved — clicks at the bottom of windows no longer mis-target by 3–4px.' },
      { kind: 'fix',  body: 'Workflow timeout now propagates to the underlying browser tab; zombie Chromium instances after timeout are gone.' },
      { kind: 'improvement', body: 'Status pill in the run viewer flips to "failed" the instant a step times out (was stuck on "running" until manual refresh).' },
    ],
  },
  {
    version: '2.4.1',
    date: '2026-04-30',
    headline: 'Recorder memory hold + Lightning stale-data',
    items: [
      { kind: 'fix',  body: 'Recorder no longer leaks the DOM snapshot cache across long edit sessions (resident memory used to climb ~2GB / hour).' },
      { kind: 'feature', body: 'Salesforce Lightning recording: built-in `data-stale="false"` wait pattern in the recipe library, survives Lightning UI refactors.' },
      { kind: 'improvement', body: 'Browser-locale flag (`--browser-locale`) inherited from host OS by default; explicit override still respected.' },
    ],
  },
  {
    version: '2.4.0',
    date: '2026-04-15',
    headline: 'Profile persistence + Drag-detection rewrite',
    items: [
      { kind: 'feature', body: 'Persistent browser profiles per workflow — sessions survive across runs without re-auth (notion-friendly, hubspot-friendly).' },
      { kind: 'fix',  body: 'Notion drag-reorder now uses the correct pointer-event ordering; rows actually move on replay.' },
      { kind: 'feature', body: 'Recorder synthetic-event coalescing on by default — fixes the MUI / React double-click capture.' },
      { kind: 'security', body: 'Workflow YAML schema now validates secret-references at parse time; raw secrets in step params raise a parse error.' },
    ],
  },
  {
    version: '2.3.5',
    date: '2026-03-28',
    headline: 'CLI + Action hardening',
    items: [
      { kind: 'feature', body: '`flyto run --headless` exits non-zero on any step failure (was previously always 0). Drop-in for CI smoke checks.' },
      { kind: 'feature', body: 'New GitHub Action: `flytohub/run-workflow@v1`. Logs + screenshots upload as workflow-run artifacts.' },
      { kind: 'improvement', body: '`--screenshot-on-error` writes a PNG next to the log, regardless of headed/headless.' },
    ],
  },
  {
    version: '2.3.4',
    date: '2026-03-10',
    headline: 'Stripe / Notion / HubSpot recipe refresh',
    items: [
      { kind: 'improvement', body: 'Refreshed all Stripe dashboard recipes after their March chart layout change.' },
      { kind: 'improvement', body: 'Notion gallery → table conversion now stable across the new Notion 2026 grid.' },
      { kind: 'fix',  body: 'HubSpot list-view pagination no longer races past the lazy-loaded second page.' },
    ],
  },
];

const KIND_META: Record<Kind, { label: string; color: string; Icon: typeof Sparkles }> = {
  feature:     { label: 'FEATURE',     color: 'text-violet-300 border-violet-400/40 bg-violet-500/[0.05]', Icon: Sparkles },
  fix:         { label: 'FIX',         color: 'text-rose-300 border-rose-400/40 bg-rose-500/[0.05]',     Icon: Bug },
  improvement: { label: 'IMPROVED',    color: 'text-cyan-300 border-cyan-400/40 bg-cyan-500/[0.05]',     Icon: Wrench },
  security:    { label: 'SECURITY',    color: 'text-amber-300 border-amber-400/40 bg-amber-500/[0.05]',  Icon: ShieldCheck },
};

export default async function CloudChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mb-16 max-w-2xl">
        <span className="label-mono">CHANGELOG</span>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,72px)]">What shipped lately.</h1>
        <p className="mt-6 text-[15px] leading-relaxed text-bone-200 sm:text-[16px]">
          Roughly weekly releases — features, fixes, perf, security. Older releases are tagged
          on{' '}
          <a className="text-violet-300 hover:text-violet-200" href="https://github.com/flytohub/flyto-core/releases" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      </header>

      <ol className="space-y-10">
        {RELEASES.map((r) => (
          <li key={r.version}>
            <header className="flex items-baseline gap-3 border-b border-[var(--color-line)] pb-3">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-bone-100">
                v{r.version}
              </h2>
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-bone-300">
                {r.date}
              </span>
            </header>
            <p className="mt-4 text-[14.5px] leading-relaxed text-bone-200">{r.headline}</p>

            <ul className="mt-5 space-y-2.5">
              {r.items.map((it, i) => {
                const meta = KIND_META[it.kind];
                const Icon = meta.Icon;
                return (
                  <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed text-bone-200">
                    <span
                      className={`inline-flex flex-none items-center gap-1 rounded-md border px-1.5 py-px font-mono text-[9.5px] tracking-[0.16em] ${meta.color}`}
                    >
                      <Icon className="h-2.5 w-2.5" strokeWidth={2} />
                      {meta.label}
                    </span>
                    <span>{it.body}</span>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </article>
  );
}
