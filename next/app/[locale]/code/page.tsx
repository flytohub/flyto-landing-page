import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import {
  Boxes,
  Code2,
  KeyRound,
  ScrollText,
  Bug,
  Crosshair,
  Activity,
  FileCheck2,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { CodeFeatureRows } from '@/components/sections/CodeFeatureRows';
import { ClosedLoop } from '@/components/sections/ClosedLoop';
import { JuiceShopProof } from '@/components/sections/JuiceShopProof';
import { FAQ } from '@/components/sections/FAQ';
import { CTASection } from '@/components/sections/CTASection';
import { cn } from '@/lib/cn';

const ICONS: Record<string, LucideIcon> = {
  Boxes, Code2, KeyRound, ScrollText, Bug, Crosshair, Activity, FileCheck2,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'code' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function CodePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CodeHero />
      <ClosedLoop />
      <JuiceShopProof />
      <CodeScans />
      <CodeFeatureRows />
      <CodeRoadmap />
      <FAQ namespace="code.faq" />
      <CTASection
        namespace="code.cta"
        id="waitlist"
        primaryHref="https://forms.flyto2.com/code-waitlist"
        secondaryHref="https://pypi.org/project/flyto-indexer/"
        primaryIcon="Mail"
        secondaryIcon="CodeIcon"
      />
    </>
  );
}

function CodeHero() {
  const t = useTranslations('code.hero');
  return (
    <section className="relative isolate overflow-hidden">
      <div className="glow-radial" aria-hidden />
      <div className="grid-faint" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-mono">{t('eyebrow')}</span>
          <Tag variant="soon">{t('status')}</Tag>
        </div>

        <h1 className="h-display mt-8 max-w-5xl text-[clamp(48px,10vw,128px)]">
          {t('title')}{' '}
          <span className="bg-gradient-to-br from-cyan-300 via-violet-400 to-violet-300 bg-clip-text text-transparent">
            {t('titleAccent')}
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-bone-200 sm:text-[18px]">
          {t('lede')}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href="#waitlist">{t('ctaPrimary')}</Button>
          <Button href="https://pypi.org/project/flyto-indexer/" variant="secondary">
            {t('ctaSecondary')}
          </Button>
        </div>
      </div>
    </section>
  );
}

interface ScanItem { icon: keyof typeof ICONS; title: string; body: string; }

function CodeScans() {
  const t = useTranslations('code.scans');
  const items = t.raw('items') as ScanItem[];
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-200">{t('subtitle')}</p>
      </header>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          return (
            <article key={it.title} className="group bg-ink-800 p-6 transition-colors hover:bg-ink-700">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-line-strong)] bg-ink-700 text-cyan-400">
                {Icon && <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />}
              </div>
              <h3 className="font-display mt-5 text-[18px] font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-bone-200">{it.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

interface PhaseItem {
  n: string;
  title: string;
  status: 'shipping' | 'next' | 'planned' | string;
  body: string;
}

function CodeRoadmap() {
  const t = useTranslations('code.phases');
  const items = t.raw('items') as PhaseItem[];
  const live = (s: string) => s === 'shipping' || s === '出貨中' || s === 'shipping' || s === '出貨';

  return (
    <section className="mx-auto max-w-6xl border-y border-[var(--color-line)] px-5 py-24 sm:px-8 sm:py-28">
      <header className="mb-12 max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
      </header>

      <ol className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
        {items.map((p) => (
          <li
            key={p.n}
            className={cn(
              'group grid gap-6 py-7 transition-colors sm:grid-cols-12 sm:gap-8 sm:px-2 sm:py-8',
              'hover:bg-violet-500/[0.03]',
            )}
          >
            <div className="sm:col-span-2">
              <span className="num-mono font-display text-5xl font-light text-bone-300/40 sm:text-6xl">
                {p.n}
              </span>
            </div>
            <div className="sm:col-span-7">
              <h3 className="font-display text-2xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-bone-200">{p.body}</p>
            </div>
            <div className="sm:col-span-3 sm:text-right">
              <Tag variant={live(p.status) ? 'live' : 'default'}>{p.status}</Tag>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
