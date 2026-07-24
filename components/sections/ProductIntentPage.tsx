import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Container } from 'lucide-react';
import type { ProductIntentPage as ProductIntentPageData } from '@/lib/product-intent-pages';

const LICENSES = {
  flow: {
    name: 'PolyForm Shield 1.0.0',
    url: 'https://github.com/flytohub/flyto-flow/blob/main/LICENSE',
  },
  warroom: {
    name: 'PolyForm Noncommercial 1.0.0',
    url: 'https://github.com/flytohub/flyto-warroom/blob/main/LICENSE',
  },
} as const;

function external(href: string) {
  return href.startsWith('http');
}

function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  const className = secondary
    ? 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/45 bg-black/20 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10'
    : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-50';

  if (external(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
      </a>
    );
  }

  return (
    <Link href={href} prefetch={false} className={className}>
      {children}
      <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
    </Link>
  );
}

export function ProductIntentPage({ page }: { page: ProductIntentPageData }) {
  const pageUrl = `https://flyto2.com/${page.path}/`;
  const familyUrl = `https://flyto2.com/${page.family}/`;
  const applicationName = page.family === 'flow' ? 'Flyto2 Flow' : 'Flyto2 Warroom';
  const license = LICENSES[page.family];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: page.metaTitle,
        description: page.metaDescription,
        isPartOf: { '@id': 'https://flyto2.com/#website' },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        mainEntity: { '@id': `${pageUrl}#software` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${pageUrl}#software`,
        name: applicationName,
        applicationCategory:
          page.family === 'flow'
            ? 'BusinessApplication'
            : 'SecurityApplication',
        applicationSubCategory:
          page.family === 'flow'
            ? 'Visual workflow automation and MCP builder'
            : 'CTEM and security validation platform',
        operatingSystem: 'Linux, macOS, Windows, Docker',
        url: familyUrl,
        description: page.metaDescription,
        license: license.url,
        isAccessibleForFree: true,
        ...(page.quickStart
          ? {
              softwareVersion: '0.1.1',
              downloadUrl: 'https://hub.docker.com/r/flyto2/flow',
              installUrl: 'https://docs.flyto2.com/flow/community-edition-docker',
            }
          : {}),
        publisher: { '@id': 'https://flyto2.com/#organization' },
        featureList: page.sections.flatMap((section) => section.bullets),
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: page.answers.map((answer) => ({
          '@type': 'Question',
          name: answer.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Flyto2',
            item: 'https://flyto2.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: applicationName,
            item: familyUrl,
          },
          ...(page.slug.length
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: page.eyebrow,
                  item: pageUrl,
                },
              ]
            : []),
        ],
      },
    ],
  };

  return (
    <article className="bg-[#f6f4ee] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate flex min-h-[min(760px,calc(100svh-48px))] items-end overflow-hidden bg-slate-950">
        <Image
          src={page.screenshot}
          alt={page.screenshotAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-top opacity-65"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.2)_0%,rgba(2,6,23,0.58)_48%,rgba(2,6,23,0.96)_100%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/65"
          >
            <Link href="/">Flyto2</Link>
            <span aria-hidden>/</span>
            {page.slug.length ? (
              <>
                <Link href={`/${page.family}`}>{applicationName}</Link>
                <span aria-hidden>/</span>
              </>
            ) : null}
            <span className="text-white">{page.eyebrow}</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-200">
            {page.eyebrow}
          </p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(40px,7vw,82px)] font-semibold leading-[1.02] tracking-normal text-white">
            {page.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            {page.lede}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionLink href={page.primaryCta.href}>{page.primaryCta.label}</ActionLink>
            <ActionLink href={page.secondaryCta.href} secondary>
              {page.secondaryCta.label}
            </ActionLink>
          </div>
        </div>
      </section>

      {page.quickStart ? (
        <section
          id="community-edition-docker"
          aria-labelledby="community-edition-docker-title"
          className="scroll-mt-24 border-b border-slate-700 bg-slate-950 text-white"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-cyan-200">
                <Container className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                <span>{page.quickStart.eyebrow}</span>
              </div>
              <h2
                id="community-edition-docker-title"
                className="mt-4 max-w-xl font-display text-3xl font-semibold tracking-normal sm:text-4xl"
              >
                {page.quickStart.title}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-300">
                {page.quickStart.body}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {page.quickStart.links.map((link, index) => (
                  <ActionLink key={link.href} href={link.href} secondary={index > 0}>
                    {link.label}
                  </ActionLink>
                ))}
              </div>
            </div>
            <div className="min-w-0">
              <div className="overflow-hidden rounded-md border border-slate-700 bg-black">
                <div className="flex min-h-10 items-center border-b border-slate-800 px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  Docker quick start
                </div>
                <pre className="overflow-x-auto p-4 text-[12px] leading-6 text-cyan-100 sm:p-6 sm:text-[13px]">
                  <code>{page.quickStart.command}</code>
                </pre>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{page.quickStart.note}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-slate-300 bg-white">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-3">
          {page.sections.map((section, index) => (
            <section
              key={section.title}
              className="border-b border-slate-200 px-5 py-12 sm:px-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-16 lg:last:border-r-0"
            >
              <span className="font-mono text-xs text-slate-500">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold tracking-normal text-slate-950">
                {section.title}
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-600">{section.body}</p>
              <ul className="mt-6 space-y-3">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
                    <CheckCircle2
                      className="mt-1 h-4 w-4 flex-none text-cyan-700"
                      strokeWidth={1.8}
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="border-b border-slate-300 bg-[#dff3f1]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <header>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-900">
                Direct answers
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
                Questions teams ask before they deploy.
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-slate-700">
                License, hosting, and product boundaries are stated directly so teams can
                evaluate Flyto2 without relying on ambiguous category claims.
              </p>
            </header>
            <div className="divide-y divide-cyan-900/20 border-y border-cyan-900/20">
              {page.answers.map((answer) => (
                <section key={answer.question} className="py-6">
                  <h2 className="font-display text-xl font-semibold tracking-normal">
                    {answer.question}
                  </h2>
                  <p className="mt-3 text-[15px] leading-7 text-slate-700">{answer.answer}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f4ee]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
                Continue
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal">
                Product, implementation, and evidence.
              </h2>
            </div>
            <a
              href={license.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-700 underline decoration-slate-400 underline-offset-4"
            >
              License: {license.name}
            </a>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {page.related.map((link) => {
              const content = (
                <>
                  <span>{link.label}</span>
                  {external(link.href) ? (
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  )}
                </>
              );
              const className =
                'flex min-h-16 items-center justify-between gap-4 rounded-md border border-slate-300 bg-white px-5 py-4 text-sm font-medium transition-colors hover:border-cyan-700 hover:text-cyan-800';

              return external(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {content}
                </a>
              ) : (
                <Link key={link.href} href={link.href} prefetch={false} className={className}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
}
