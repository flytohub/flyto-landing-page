import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, FileText, Clock } from 'lucide-react';
import { listWhitepapers } from '@/lib/whitepapers';
import { pageAlternates } from '@/lib/seo';
import { useLocale } from 'next-intl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Whitepapers',
    description:
      'Technical audits of the Flyto2 platform — architecture, modules, runtime, integrations.',
    alternates: pageAlternates('whitepaper', locale),
  };
}

export default async function WhitepaperIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const papers = listWhitepapers();

  return (
    <article className="mx-auto max-w-4xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mb-14 max-w-2xl">
        <span className="label-mono">WHITEPAPERS</span>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,72px)]">
          What ships, in detail.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-bone-200 sm:text-[16px]">
          Self-audits of the Flyto2 platform — what&apos;s actually in the codebase, not what
          the marketing page hints at. Numbers are derived from the source tree at the time of
          writing.
        </p>
      </header>

      <ul className="space-y-4">
        {papers.map((p) => (
          <Card key={p.slug} paper={p} locale={locale} />
        ))}
      </ul>
    </article>
  );
}

function Card({
  paper,
  locale,
}: {
  paper: ReturnType<typeof listWhitepapers>[number];
  locale: string;
}) {
  const href = locale === 'en' ? `/whitepaper/${paper.slug}` : `/${locale}/whitepaper/${paper.slug}`;
  return (
    <li>
      <Link
        href={href}
        className="group block rounded-2xl border border-[var(--color-line)] bg-ink-800/40 p-6 transition-all hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-ink-700/40 sm:p-8"
      >
        <div className="flex items-start gap-5">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-violet-300">
            <FileText className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold tracking-tight text-bone-100 sm:text-2xl">
                {paper.title}
              </h2>
              <ArrowUpRight
                className="h-4 w-4 flex-none text-bone-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone-100"
                strokeWidth={1.5}
              />
            </div>
            <p className="mt-2 text-[14.5px] leading-relaxed text-bone-200">{paper.blurb}</p>
            <div className="mt-4 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase text-bone-300">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              <span>{paper.readingMinutes} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
