import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { templates } from '@/lib/templates';
import { locales, defaultLocale } from '@/lib/locales';
import { pageAlternates } from '@/lib/seo';

export function generateStaticParams() {
  return templates.flatMap((tpl) =>
    locales.map((locale) => ({ locale, slug: tpl.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tpl = templates.find((t) => t.slug === slug);
  if (!tpl) return {};

  const canonicalSlug = tpl.canonicalSlug ?? tpl.slug;
  const primary = templates.find((t) => t.slug === canonicalSlug) ?? tpl;

  return {
    title: `${primary.title} — Flyto2 Cloud Template`,
    description: primary.metaDescription,
    alternates: pageAlternates(`cloud/templates/${canonicalSlug}`, locale),
    openGraph: {
      title: `${primary.title} — Flyto2 Cloud Template`,
      description: primary.metaDescription,
      type: 'website',
    },
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tpl = templates.find((t) => t.slug === slug);
  if (!tpl) notFound();

  if (tpl.canonicalSlug) {
    const prefix = locale === defaultLocale ? '' : `/${locale}`;
    redirect(`${prefix}/cloud/templates/${tpl.canonicalSlug}/`);
  }

  setRequestLocale(locale);

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tpl.title,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform (cloud)',
    description: tpl.metaDescription,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    softwareHelp: 'https://docs.flyto2.com',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tpl.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const hubHref =
    locale === defaultLocale ? '/cloud/templates/' : `/${locale}/cloud/templates/`;
  const cloudHref = locale === defaultLocale ? '/cloud/' : `/${locale}/cloud/`;

  return (
    <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="mb-10">
        <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-violet-300">
          Template · {tpl.category}
        </span>
        <h1 className="h-display mt-4 text-[clamp(36px,6vw,64px)] leading-tight">
          {tpl.title}
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-bone-200">{tpl.lede}</p>
      </header>

      <section className="space-y-5">
        <h2 className="font-display text-[24px] font-semibold tracking-tight text-bone-100 border-b border-[var(--color-line)] pb-2">
          What this template does
        </h2>
        {tpl.whatItDoes.map((para, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-bone-200">
            {para}
          </p>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-[24px] font-semibold tracking-tight text-bone-100 border-b border-[var(--color-line)] pb-2">
          Key features
        </h2>
        <ul className="mt-5 space-y-3">
          {tpl.features.map((f, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-bone-200">
              <Check className="mt-1 h-4 w-4 flex-none text-violet-400" strokeWidth={2} />
              <span dangerouslySetInnerHTML={{ __html: renderInlineBold(f) }} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-[24px] font-semibold tracking-tight text-bone-100 border-b border-[var(--color-line)] pb-2">
          Typical use cases
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-bone-200">
          {tpl.useCases.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-[24px] font-semibold tracking-tight text-bone-100 border-b border-[var(--color-line)] pb-2">
          How it works
        </h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-bone-200">
          {tpl.howItWorks.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-[24px] font-semibold tracking-tight text-bone-100 border-b border-[var(--color-line)] pb-2">
          Works with
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {tpl.integrations.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-[var(--color-line-strong)] bg-ink-700/40 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-bone-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-[24px] font-semibold tracking-tight text-bone-100 border-b border-[var(--color-line)] pb-2">
          Quick start
        </h2>
        <pre className="mt-5 overflow-x-auto rounded-xl border border-[var(--color-line)] bg-ink-900/60 p-5 text-[13px] leading-relaxed text-bone-100">
          <code>{tpl.quickStart}</code>
        </pre>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-[24px] font-semibold tracking-tight text-bone-100 border-b border-[var(--color-line)] pb-2">
          Best practices
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-bone-200">
          {tpl.bestPractices.map((bp, i) => (
            <li key={i}>{bp}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-[24px] font-semibold tracking-tight text-bone-100 border-b border-[var(--color-line)] pb-2">
          Frequently asked questions
        </h2>
        <dl className="mt-5 space-y-6">
          {tpl.faqs.map((f, i) => (
            <div key={i}>
              <dt className="font-display text-[17px] font-semibold text-bone-100">{f.q}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-bone-200">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-14 flex flex-wrap items-center gap-3">
        <Link
          href={hubHref}
          className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-3 text-[13.5px] font-medium text-white transition-colors hover:bg-violet-600"
        >
          Browse all templates
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
        <Link
          href={cloudHref}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-ink-700/30 px-5 py-3 text-[13.5px] text-bone-100 transition-colors hover:border-violet-400 hover:bg-violet-500/10"
        >
          Try Flyto2 Cloud
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>

      <footer className="mt-14 border-t border-[var(--color-line)] pt-6 text-[13px] text-bone-300">
        Part of the{' '}
        <Link href={hubHref} className="text-violet-300 hover:text-violet-200">
          Flyto2 Cloud template library
        </Link>
        . View the source on{' '}
        <a
          href="https://github.com/flytohub"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-300 hover:text-violet-200"
        >
          GitHub
        </a>
        .
      </footer>
    </article>
  );
}

function renderInlineBold(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-bone-100">$1</strong>');
}
