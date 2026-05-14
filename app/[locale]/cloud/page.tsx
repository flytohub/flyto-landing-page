import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import {
  Video,
  Pause,
  ShieldOff,
  Boxes,
  GitBranch,
  Languages,
  Repeat,
  FileText,
  Database,
  Search,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Comparison } from '@/components/sections/Comparison';
import { CodeSample } from '@/components/sections/CodeSample';
import { VideoDemo } from '@/components/sections/VideoDemo';
import { RealExamples } from '@/components/sections/RealExamples';
import { Integrations } from '@/components/sections/Integrations';
import { Recipes } from '@/components/sections/Recipes';
import { FAQ } from '@/components/sections/FAQ';
import { CTASection } from '@/components/sections/CTASection';
import { pageAlternates } from '@/lib/seo';

const ICONS: Record<string, LucideIcon> = {
  Video, Pause, ShieldOff, Boxes, GitBranch, Languages, Repeat,
  FileText, Database, Search, Mail,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cloud' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: pageAlternates('cloud', locale),
  };
}

export default async function CloudPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CloudHero />
      <VideoDemo />
      <CloudHow />
      <Recipes />
      <RealExamples />
      <CloudFeatures />
      <Integrations />
      <CodeSample />
      <Comparison />
      <CloudUseCases />
      <FAQ namespace="cloud.faq" />
      <CTASection namespace="cloud.cta" />
    </>
  );
}

function CloudHero() {
  const t = useTranslations('cloud.hero');
  return (
    <section className="relative isolate overflow-hidden">
      <div className="glow-radial" aria-hidden />
      <div className="grid-faint" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-mono">{t('eyebrow')}</span>
          <Tag variant="live">{t('status')}</Tag>
        </div>

        <h1 className="h-display mt-8 max-w-5xl text-[clamp(48px,10vw,128px)]">
          {t('title')}{' '}
          <span className="bg-gradient-to-br from-violet-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
            {t('titleAccent')}
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-bone-200 sm:text-[18px]">
          {t('lede')}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href="/cloud/download">{t('ctaPrimary')}</Button>
          <Button href="/cloud/templates" variant="secondary">{t('ctaSecondary')}</Button>
        </div>
      </div>
    </section>
  );
}

interface HowItem { step: string; icon: keyof typeof ICONS; title: string; body: string; }

function CloudHow() {
  const t = useTranslations('cloud.how');
  const items = t.raw('items') as HowItem[];
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
      </header>

      <ol className="mt-14 grid gap-5 lg:grid-cols-3">
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          return (
            <li
              key={it.step}
              className="lift relative flex flex-col gap-5 rounded-3xl border border-[var(--color-line)] bg-gradient-to-b from-ink-700/40 to-ink-800/20 p-7 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="num-mono font-display text-5xl text-bone-300/40">{it.step}</span>
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-900 text-violet-300">
                  {Icon && <Icon className="h-5 w-5" strokeWidth={1.5} />}
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">{it.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-bone-200">{it.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

interface FeatureItem { icon: keyof typeof ICONS; title: string; body: string; }

function CloudFeatures() {
  const t = useTranslations('cloud.features');
  const items = t.raw('items') as FeatureItem[];
  return (
    <section className="mx-auto max-w-6xl border-y border-[var(--color-line)] px-5 py-24 sm:px-8 sm:py-28">
      <header className="mb-14 max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
      </header>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          return (
            <article key={it.title} className="group bg-ink-800 p-7 transition-colors hover:bg-ink-700 sm:p-9">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-violet-300 transition-colors group-hover:border-violet-400 group-hover:text-violet-200">
                {Icon && <Icon className="h-5 w-5" strokeWidth={1.5} />}
              </div>
              <h3 className="font-display mt-6 text-[20px] font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-bone-200">{it.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

interface UseCaseItem { icon: keyof typeof ICONS; title: string; body: string; }

function CloudUseCases() {
  const t = useTranslations('cloud.useCases');
  const items = t.raw('items') as UseCaseItem[];
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
      </header>

      <ul className="mt-12 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          return (
            <li key={it.title} className="grid gap-6 py-7 transition-colors hover:bg-violet-500/[0.03] sm:grid-cols-12 sm:gap-8 sm:px-2 sm:py-8">
              <div className="sm:col-span-1">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-violet-300">
                  {Icon && <Icon className="h-5 w-5" strokeWidth={1.5} />}
                </span>
              </div>
              <div className="sm:col-span-11">
                <h3 className="font-display text-2xl font-semibold tracking-tight">{it.title}</h3>
                <p className="mt-2 max-w-3xl text-[14.5px] leading-relaxed text-bone-200">{it.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
