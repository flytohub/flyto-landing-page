import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  FileText,
  Mail,
  Database,
  ShoppingCart,
  Search,
  Calendar,
  Bell,
  Receipt,
  ArrowUpRight,
  GitFork,
  type LucideIcon,
} from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { CTASection } from '@/components/sections/CTASection';
import { pageAlternates } from '@/lib/seo';
import { templates } from '@/lib/templates';
import { defaultLocale } from '@/lib/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'templates' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: pageAlternates('cloud/templates', locale),
  };
}

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cloudHref = locale === defaultLocale ? '/cloud/' : `/${locale}/cloud/`;
  const hubHref =
    locale === defaultLocale ? '/cloud/templates/' : `/${locale}/cloud/templates/`;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Cloud', item: `https://flyto2.com${cloudHref}` },
      { '@type': 'ListItem', position: 2, name: 'Templates', item: `https://flyto2.com${hubHref}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TemplatesHero />
      <TemplatesGrid />
      <CommunityTemplatesGrid locale={locale} />
      <CTASection
        namespace="templates.cta"
        primaryHref="https://github.com/flytohub/flyto2/discussions"
        secondaryHref="https://docs.flyto2.com"
        primaryIcon="Mail"
        secondaryIcon="BookOpen"
      />
    </>
  );
}

function TemplatesHero() {
  const t = useTranslations('templates.hero');
  return (
    <section className="relative isolate overflow-hidden">
      <div className="glow-radial" aria-hidden />
      <div className="grid-faint" aria-hidden />
      <div className="halo" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-12 text-center sm:px-8 sm:pb-20 sm:pt-16">
        <Tag variant="soon">{t('eyebrow')}</Tag>
        <h1 className="h-display mx-auto mt-7 max-w-4xl text-[clamp(44px,8vw,108px)]">
          {t('title')}{' '}
          <span className="aurora-text">{t('titleAccent')}</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-[16px] leading-relaxed text-bone-200">
          {t('lede')}
        </p>
      </div>
    </section>
  );
}

const ICONS: Record<string, LucideIcon> = {
  FileText, Mail, Database, ShoppingCart, Search, Calendar, Bell, Receipt,
};

interface TemplateItem {
  iconName: keyof typeof ICONS;
  category: string;
  title: string;
  body: string;
}

function TemplatesGrid() {
  const t = useTranslations('templates');
  const items = t.raw('items') as TemplateItem[];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
      <header className="mb-10 max-w-2xl">
        <span className="label-mono">{t('gridLabel')}</span>
        <h2 className="h-display mt-4 text-[clamp(32px,5vw,52px)]">{t('gridTitle')}</h2>
        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-bone-200">
          {t('gridSubtitle')}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[item.iconName];
          return (
            <article
              key={i}
              className="lift group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-[var(--color-line)] bg-gradient-to-b from-ink-700/40 to-ink-800/20 p-6"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-900 text-violet-300 transition-colors group-hover:border-violet-400 group-hover:text-violet-200">
                  {Icon && <Icon className="h-5 w-5" strokeWidth={1.5} />}
                </span>
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-bone-300">
                  {item.category}
                </span>
              </div>
              <h3 className="font-display text-[18px] font-semibold leading-tight tracking-tight">
                {item.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-bone-200">{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CommunityTemplatesGrid({ locale }: { locale: string }) {
  // Only primary templates — alias entries (canonicalSlug) redirect, so they
  // would clutter the grid with duplicates.
  const primaryTemplates = templates.filter((tpl) => !tpl.canonicalSlug);
  const prefix = locale === defaultLocale ? '' : `/${locale}`;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
      <header className="mb-10 max-w-2xl">
        <span className="label-mono">COMMUNITY · {primaryTemplates.length} TEMPLATES</span>
        <h2 className="h-display mt-4 text-[clamp(28px,4.5vw,44px)]">
          Open-source workflows from the community
        </h2>
        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-bone-200">
          Production-tested templates contributed by Flyto2 users. Fork, customize, and ship.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {primaryTemplates.map((tpl) => {
          const Icon = ICONS[tpl.iconName] ?? FileText;
          return (
            <Link
              key={tpl.slug}
              href={`${prefix}/cloud/templates/${tpl.slug}/`}
              className="lift group flex flex-col gap-3 rounded-2xl border border-[var(--color-line)] bg-ink-700/30 p-5 transition-colors hover:border-violet-400/60"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-line-strong)] bg-ink-900 text-violet-300 transition-colors group-hover:text-violet-200">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <ArrowUpRight
                  className="h-4 w-4 text-bone-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone-100"
                  strokeWidth={1.5}
                />
              </div>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-bone-300">
                {tpl.category}
              </span>
              <h3 className="font-display text-[15.5px] font-semibold leading-tight tracking-tight text-bone-100">
                {tpl.title}
              </h3>
              <p className="text-[12.5px] leading-relaxed text-bone-200 line-clamp-3">
                {tpl.lede}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        <Link
          href="https://github.com/flytohub"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-ink-700/30 px-5 py-3 text-[13px] tracking-wide text-bone-100 transition-all hover:border-violet-400 hover:bg-violet-500/10"
        >
          <GitFork className="h-4 w-4" strokeWidth={1.75} />
          <span>Contribute on GitHub</span>
          <ArrowUpRight
            className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </section>
  );
}
