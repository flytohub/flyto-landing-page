import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { WhitepaperMarkdown } from '@/components/sections/WhitepaperMarkdown';
import { readWhitepaper, whitepaperSlugs } from '@/lib/whitepapers';
import { pageAlternates } from '@/lib/seo';

export function generateStaticParams() {
  return whitepaperSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paper = readWhitepaper(slug);
  if (!paper) return {};
  return {
    title: paper.meta.title,
    description: paper.meta.blurb,
    alternates: pageAlternates(`whitepaper/${slug}`),
  };
}

export default async function WhitepaperPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const paper = readWhitepaper(slug);
  if (!paper) notFound();

  const indexHref = locale === 'en' ? '/whitepaper' : `/${locale}/whitepaper`;

  return (
    <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <Link
        href={indexHref}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.16em] uppercase text-bone-300 transition-colors hover:text-bone-100"
      >
        <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
        All whitepapers
      </Link>

      <div className="mt-6 flex items-center gap-3 font-mono text-[10.5px] tracking-[0.16em] uppercase text-bone-300">
        <span>WHITEPAPER</span>
        <span className="h-1 w-1 rounded-full bg-bone-300/40" />
        <Clock className="h-3 w-3" strokeWidth={1.5} />
        <span>{paper.meta.readingMinutes} min</span>
      </div>

      <div className="mt-10">
        <WhitepaperMarkdown source={paper.body} />
      </div>
    </article>
  );
}
