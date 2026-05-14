import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import {
  Globe, BarChart3, Bell, Database, ImagePlus, Wrench, FileInput, FileOutput,
  type LucideIcon,
} from 'lucide-react';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;
  return {
    title: 'Recipes — pre-built workflows',
    description:
      '37 ready-to-run YAML workflows for scraping, analytics, monitoring, data processing, image work, devops and form filling.',
    alternates: pageAlternates('cloud/recipes'),
  };
}

interface RecipeGroup {
  icon: LucideIcon;
  category: string;
  body: string;
  items: { name: string; what: string }[];
}

const GROUPS: RecipeGroup[] = [
  {
    icon: Globe, category: 'Web Scraping',
    body: 'Grab structured data off any page without writing a parser.',
    items: [
      { name: 'scrape-to-csv',  what: 'Walk a list of URLs, extract a fixed schema, write a CSV.' },
      { name: 'scrape-page',    what: 'Single-page extract — title, meta, headings, body, links.' },
      { name: 'scrape-table',   what: 'Pull an HTML table into rows; handles paging.' },
      { name: 'scrape-links',   what: 'Crawl outbound links to a configurable depth.' },
      { name: 'demo-scrape',    what: 'Sample run on a benign demo page — sanity check the install.' },
    ],
  },
  {
    icon: BarChart3, category: 'Analytics',
    body: 'Site audits, competitor intel, performance reports — outputs you can hand to a stakeholder.',
    items: [
      { name: 'competitor-intel',  what: 'Pull a competitor list, screenshot homepages, summarize copy via LLM.' },
      { name: 'responsive-report', what: 'Three viewport renders + Lighthouse delta per URL.' },
      { name: 'full-audit',        what: 'Lighthouse + headers + accessibility + spelling — one batch.' },
      { name: 'site-audit',        what: 'Lighter daily audit — perf budget + broken links.' },
      { name: 'web-perf',          what: 'Core Web Vitals snapshot, regression detection.' },
    ],
  },
  {
    icon: Bell, category: 'Monitoring',
    body: 'Watch the things that change and ping the channel that should know.',
    items: [
      { name: 'monitor-site',       what: 'Page changes since last run → diff to Slack/Discord/LINE.' },
      { name: 'new-posting-alert',  what: 'Track a job board / classifieds page for new postings.' },
      { name: 'price-drop-alert',   what: 'Multi-SKU price watch on retail sites.' },
      { name: 'social-monitor',     what: 'Brand mentions on socials → daily digest.' },
      { name: 'change-detector',    what: 'Pure diff utility — point at any URL pattern.' },
      { name: 'stock-price',        what: 'Read public ticker pages, log to CSV; no broker auth.' },
    ],
  },
  {
    icon: Database, category: 'Data Processing',
    body: 'The boring middle of every pipeline. CSV in, JSON out, with shape.',
    items: [
      { name: 'csv-to-json',     what: 'Type-aware conversion with schema inference.' },
      { name: 'json-to-csv',     what: 'Flattens nested JSON predictably for spreadsheet consumers.' },
      { name: 'api-pipeline',    what: 'Generic GET → transform → POST chain with retries.' },
      { name: 'http-get',        what: 'Single HTTP fetch with header + auth presets.' },
      { name: 'pdf-extract',     what: 'Text + tables out of a PDF, OCR fallback on scans.' },
    ],
  },
  {
    icon: ImagePlus, category: 'Image',
    body: 'Resize, compress, convert, OCR — pre-wired with sane defaults.',
    items: [
      { name: 'image-compress', what: 'Lossy/lossless compress with size or quality target.' },
      { name: 'image-resize',   what: 'Single dimension or aspect-locked, batched.' },
      { name: 'image-convert',  what: 'Between PNG, JPEG, WebP, AVIF.' },
      { name: 'ocr',            what: 'Tesseract under the hood; per-page or whole-doc.' },
      { name: 'visual-snapshot',what: 'Headed browser → consistent screenshot for visual regression.' },
    ],
  },
  {
    icon: Wrench, category: 'DevOps',
    body: 'Operational scripts you used to write in bash. In YAML now, version controlled.',
    items: [
      { name: 'docker-ps',     what: 'Inspect running containers across a list of hosts.' },
      { name: 'port-scan',     what: 'TCP/UDP scan of internal targets — staging only, not for hostile use.' },
      { name: 'whois',         what: 'Bulk WHOIS lookup with cache.' },
      { name: 'git-changelog', what: 'Generate a release changelog from commit history.' },
      { name: 'github-issue',  what: 'File a GitHub issue from any workflow result.' },
    ],
  },
  {
    icon: FileInput, category: 'Forms',
    body: 'Form filling without recording — schema-driven inputs.',
    items: [
      { name: 'form-fill',         what: 'Read a YAML mapping, drive a browser form, submit.' },
      { name: 'form-fill-review',  what: 'Same, but pauses at submit for human approval.' },
    ],
  },
  {
    icon: FileOutput, category: 'Output',
    body: 'Get the result somewhere a human will actually find it.',
    items: [
      { name: 'page-to-pdf',      what: 'Full-page archival PDF, fonts embedded.' },
      { name: 'screenshot',       what: 'Headless screenshot with viewport presets.' },
      { name: 'webpage-archive',  what: 'HTML + assets snapshot — replayable offline.' },
      { name: 'scrape-to-slack',  what: 'Combined recipe: scrape pattern + Slack digest.' },
    ],
  },
];

export default async function CloudRecipesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const total = GROUPS.reduce((s, g) => s + g.items.length, 0);

  return (
    <article className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mb-16 max-w-3xl">
        <span className="label-mono">RECIPES</span>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,80px)]">
          {total} ready-to-run workflows.
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">
          Every recipe is a YAML file that ships with the Flyto2 runtime. Install the CLI,
          run <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[14px]">flyto run &lt;recipe&gt;</code>,
          point it at your inputs. No setup; modify the YAML to make it yours; commit it to your repo.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {GROUPS.map((g) => {
          const Icon = g.icon;
          return (
            <section
              key={g.category}
              className="rounded-3xl border border-[var(--color-line)] bg-ink-800/40 p-7"
            >
              <header className="flex items-center gap-3">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-violet-300">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold tracking-tight text-bone-100">
                    {g.category}
                  </h2>
                  <p className="mt-0.5 text-[12.5px] text-bone-200/80">{g.body}</p>
                </div>
              </header>

              <ul className="mt-5 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
                {g.items.map((it) => (
                  <li key={it.name} className="py-3">
                    <div className="font-mono text-[12px] tracking-wide text-cyan-200">
                      flyto run {it.name}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-bone-200">{it.what}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
