import { ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import type { PublicRoutePage as PublicRoutePageData } from '@/lib/public-route-pages';

export function PublicRoutePage({ page }: { page: PublicRoutePageData }) {
  const pageUrl = `https://flyto2.com/${page.path}/`;
  const orgId = 'https://flyto2.com/#organization';
  const websiteId = 'https://flyto2.com/#website';
  const webpageId = `${pageUrl}#webpage`;
  const softwareId = `${pageUrl}#software`;
  const faqId = `${pageUrl}#faq`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: 'Flyto2',
        url: 'https://flyto2.com',
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'Flyto2',
        url: 'https://flyto2.com',
        publisher: { '@id': orgId },
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: pageUrl,
        name: page.metaTitle,
        description: page.metaDescription,
        isPartOf: { '@id': websiteId },
        publisher: { '@id': orgId },
        mainEntity: { '@id': faqId },
        about: page.sections.map((section) => ({
          '@type': 'Thing',
          name: section.title,
          description: section.body,
        })),
      },
      {
        '@type': 'SoftwareApplication',
        '@id': softwareId,
        name: 'Flyto2',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, Desktop, Self-hosted',
        url: pageUrl,
        description: page.metaDescription,
        publisher: { '@id': orgId },
      },
      {
        '@type': 'FAQPage',
        '@id': faqId,
        mainEntity: page.answers.map((answer) => ({
          '@type': 'Question',
          name: answer.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer.answer,
          },
        })),
      },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate overflow-hidden">
        <div className="glow-radial" aria-hidden />
        <div className="grid-faint" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <Tag>{page.eyebrow}</Tag>
          <h1 className="h-display mt-8 max-w-5xl text-[clamp(42px,7.2vw,96px)] leading-[0.98]">
            {page.title}
          </h1>
          <p className="mt-7 max-w-3xl text-[16px] leading-relaxed text-bone-200 sm:text-[18px]">
            {page.lede}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={page.primaryCta.href}>{page.primaryCta.label}</Button>
            <Button href={page.secondaryCta.href} variant="secondary">
              {page.secondaryCta.label}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] lg:grid-cols-3">
          {page.sections.map((section) => (
            <section key={section.title} className="bg-ink-800 p-7 sm:p-9">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-cyan-300">
                <FileText className="h-5 w-5" strokeWidth={1.6} />
              </div>
              <h2 className="font-display mt-6 text-2xl font-semibold tracking-tight text-bone-100">
                {section.title}
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-bone-200">{section.body}</p>
              <ul className="mt-6 space-y-3">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-bone-100/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-cyan-300" strokeWidth={1.75} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--color-line)] bg-ink-800/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <span className="label-mono">ANSWER BLOCKS</span>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {page.answers.map((answer) => (
              <section key={answer.question} className="rounded-2xl border border-[var(--color-line)] bg-ink-900/55 p-6">
                <h2 className="font-display text-xl font-semibold tracking-tight">{answer.question}</h2>
                <p className="mt-3 text-[14.5px] leading-relaxed text-bone-200">{answer.answer}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <span className="label-mono">RELATED</span>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {page.related.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--color-line)] bg-ink-800/55 px-5 py-4 text-[14px] text-bone-100 transition-colors hover:border-cyan-300/50 hover:bg-cyan-400/[0.05]"
            >
              <span>{link.label}</span>
              <ArrowRight className="h-4 w-4 text-cyan-300 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
