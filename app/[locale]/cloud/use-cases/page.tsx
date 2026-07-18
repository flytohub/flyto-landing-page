import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Briefcase, ShoppingBag, Code2, FlaskConical, type LucideIcon } from 'lucide-react';
import { pageAlternates } from '@/lib/seo';
import { defaultLocale } from '@/lib/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Workflow automation use cases — Flyto2 Cloud',
    description:
      'Workflow automation use cases for ops teams, ecommerce sellers, engineering teams, and researchers using Flyto2 Cloud to ship repeatable browser work.',
    alternates: pageAlternates('cloud/use-cases', locale),
  };
}

interface Persona {
  icon: LucideIcon;
  who: string;
  headline: string;
  pain: string;
  flows: { title: string; body: string }[];
  result: string;
}

const PERSONAS: Persona[] = [
  {
    icon: Briefcase,
    who: 'Ops / Internal Tools',
    headline: 'The team that lives between systems.',
    pain:
      'Half your week is moving data between tools that should talk to each other and don\'t. CRM → spreadsheet → finance → Slack → back to CRM. Every step is a copy, paste, sanity-check, file.',
    flows: [
      {
        title: 'Weekly MRR digest to leadership',
        body: 'Stripe dashboard screenshot + churn numbers from a Notion query + a one-line LLM summary, posted into a private Slack channel Monday 09:00.',
      },
      {
        title: 'New-hire onboarding kit',
        body: 'A workflow that, given a name and start date, creates the Notion page, the Google account, the GitHub invite, the Slack channel adds — and a single confirmation email to HR.',
      },
      {
        title: 'Compliance evidence collection',
        body: 'Screenshots of access-control pages across 8 vendors, dated and filed in a SOC-2 evidence locker. Used to be a quarterly afternoon; now it\'s a 12-step recording.',
      },
    ],
    result: 'Replaced ~12 hours/week of manual operations with workflows that run themselves.',
  },
  {
    icon: ShoppingBag,
    who: 'E-commerce sellers',
    headline: 'The team where the website is the company.',
    pain:
      'Catalog management is fragile because the source-of-truth lives across Shopify, the warehouse spreadsheet, the supplier portal and the marketing copy doc. Pricing tweaks, restocks, sales — every change touches three systems.',
    flows: [
      {
        title: 'Bulk SKU restock from supplier feed',
        body: 'Pull the supplier\'s CSV, match by handle, update Shopify inventory levels, generate a low-stock alert for items below threshold.',
      },
      {
        title: 'Weekend sale kickoff',
        body: 'Schedule a workflow for Saturday 00:00: drop prices by tag, replace homepage hero image, send pre-staged announcement email to subscribers.',
      },
      {
        title: 'Competitor price watch',
        body: 'Daily scrape of 40 competitor SKUs, file into a Sheet with deltas, ping when a competitor undercuts by more than 10%.',
      },
    ],
    result: 'Turn a five-person Monday-morning meeting into a workflow that runs Sunday night.',
  },
  {
    icon: Code2,
    who: 'Engineering teams',
    headline: 'The team that already automates with code — and uses Flyto2 for the bits code is bad at.',
    pain:
      'You write scripts. You\'ve got Python, you\'ve got Playwright, you can shell anything. But half the things ops needs you to automate touch UIs you don\'t own, change weekly, and aren\'t worth a brittle Selenium script you\'ll maintain.',
    flows: [
      {
        title: 'Internal admin tool actions from chat',
        body: 'A Slack slash command that drives an internal admin tool that doesn\'t have an API. Authentication via 1Password CLI; the workflow is in git; the slash command is a webhook.',
      },
      {
        title: 'Pre-deploy smoke test',
        body: 'A 5-step browser workflow that walks the critical login → search → checkout path on staging, run from CI on every deploy. Non-zero exit blocks merge.',
      },
      {
        title: 'On-call investigation aid',
        body: 'When PagerDuty fires, a workflow grabs the relevant Datadog dashboard, the Sentry trace and the recent deploys page, puts them in a Slack thread before the engineer joins the call.',
      },
    ],
    result: 'Stops writing one-off Selenium scripts. Ships ops automation in YAML, reviewed in PR.',
  },
  {
    icon: FlaskConical,
    who: 'Researchers / Analysts',
    headline: 'The team that collects from sites with no API and no goodwill toward scrapers.',
    pain:
      'You need data that lives in a website that won\'t give you an API. You don\'t want to learn Puppeteer; you don\'t want to babysit a flaky cron. You want a notebook that runs reliably every Monday morning and gives you a CSV.',
    flows: [
      {
        title: 'Government / public-records collection',
        body: 'Walk a public records site, extract structured data into rows, file into a Google Sheet your collaborators can read.',
      },
      {
        title: 'Academic-paper monitoring',
        body: 'Watch arXiv / SSRN / preprint pages for your area, summarize each new paper via LLM, dump into Notion.',
      },
      {
        title: 'Survey response triage',
        body: 'Read responses, classify into themes via LLM, file by theme, alert on outliers worth a follow-up.',
      },
    ],
    result: 'Get a reliable data pipeline without writing a single line of Python.',
  },
];

export default async function CloudUseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const pagePath = locale === defaultLocale ? '/cloud/use-cases/' : `/${locale}/cloud/use-cases/`;
  const pageUrl = `https://flyto2.com${pagePath}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#use-cases`,
    url: pageUrl,
    name: 'Workflow automation use cases',
    description:
      'Flyto2 workflow automation use cases for operations, ecommerce, engineering, and research teams that need repeatable browser and data workflows.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: PERSONAS.map((persona, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: persona.who,
        description: persona.result,
      })),
    },
  };

  return (
    <article className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-16 max-w-3xl">
        <span className="label-mono">USE CASES</span>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,80px)]">
          Workflow automation use cases from real teams.
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">
          Four Flyto2 workflow automation use cases, with the concrete workflows teams ship.
          If your team looks like one of these, the install-to-first-workflow timeline is
          measured in minutes, not weeks.
        </p>
      </header>

      <div className="space-y-12">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          return (
            <section
              key={p.who}
              className="rounded-3xl border border-[var(--color-line)] bg-ink-800/40 p-7 sm:p-10"
            >
              <header className="flex items-start gap-5">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-violet-300">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-bone-300">
                    {p.who}
                  </span>
                  <h2 className="font-display mt-1.5 text-2xl font-semibold tracking-tight text-bone-100 sm:text-3xl">
                    {p.headline}
                  </h2>
                </div>
              </header>

              <p className="mt-5 max-w-3xl text-[14.5px] leading-relaxed text-bone-200">{p.pain}</p>

              <ol className="mt-8 grid gap-3 sm:grid-cols-3">
                {p.flows.map((f, i) => (
                  <li
                    key={f.title}
                    className="rounded-2xl border border-[var(--color-line)] bg-ink-900/50 p-5"
                  >
                    <div className="font-mono text-[10.5px] tracking-[0.18em] text-violet-300/80">
                      FLOW {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="font-display mt-2 text-[15px] font-semibold tracking-tight text-bone-100">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-bone-200/90">{f.body}</p>
                  </li>
                ))}
              </ol>

              <p className="mt-7 max-w-3xl rounded-2xl border border-violet-400/25 bg-violet-500/[0.04] p-4 text-[14px] leading-relaxed text-bone-100">
                <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-violet-300/85">
                  Result —
                </span>{' '}
                {p.result}
              </p>
            </section>
          );
        })}
      </div>
    </article>
  );
}
