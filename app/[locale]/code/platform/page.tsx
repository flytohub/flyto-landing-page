import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import {
  Boxes,
  Code2,
  KeyRound,
  Crosshair,
  Bug,
  Container,
  Radar,
  Fingerprint,
  Swords,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { CTASection } from '@/components/sections/CTASection';
import { pageAlternates } from '@/lib/seo';

const ICONS: Record<string, LucideIcon> = {
  Boxes, Code2, KeyRound, Crosshair, Bug, Container, Radar, Fingerprint, Swords,
};

const WHITEPAPER_MSSP = '/whitepaper/mssp-warroom';
const WHITEPAPER_BYO = '/byo-integration';
const WHITEPAPER_SURFACES = '/security-surfaces';
const DOCS_WARROOM = 'https://docs.flyto2.com/warroom';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'code.platform' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: pageAlternates('code/platform', locale),
  };
}

export default async function CodePlatformPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PlatformHero />
      <PlatformThesis />
      <PlatformSurfaces />
      <PlatformByo />
      <PlatformLoop />
      <PlatformSubstrate />
      <CTASection
        namespace="code.platform.cta"
        id="warroom"
        primaryHref={WHITEPAPER_MSSP}
        secondaryHref={WHITEPAPER_BYO}
        primaryIcon="Mail"
        secondaryIcon="CodeIcon"
      />
    </>
  );
}

function PlatformHero() {
  const t = useTranslations('code.platform.hero');
  return (
    <section className="relative isolate overflow-hidden">
      <div className="glow-radial" aria-hidden />
      <div className="grid-faint" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-mono">{t('eyebrow')}</span>
          <Tag variant="beta">{t('status')}</Tag>
        </div>

        <h1 className="h-display mt-8 max-w-5xl text-[clamp(44px,9vw,112px)]">
          {t('title')}{' '}
          <span className="bg-gradient-to-br from-cyan-300 via-violet-400 to-violet-300 bg-clip-text text-transparent">
            {t('titleAccent')}
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-[16px] leading-relaxed text-bone-200 sm:text-[18px]">
          {t('lede')}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href={WHITEPAPER_MSSP}>{t('ctaPrimary')}</Button>
          <Button href={WHITEPAPER_BYO} variant="secondary">
            {t('ctaSecondary')}
          </Button>
          <a
            href={DOCS_WARROOM}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/[0.04] px-4 py-2 text-[13px] tracking-wide text-bone-100 transition-all hover:-translate-y-px hover:border-cyan-300/70 hover:bg-cyan-400/10"
          >
            <span>{t('ctaDocs')}</span>
            <ArrowRight className="h-3.5 w-3.5 text-cyan-300 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </section>
  );
}

function PlatformThesis() {
  const t = useTranslations('code.platform.thesis');
  return (
    <section className="mx-auto max-w-6xl border-y border-[var(--color-line)] px-5 py-20 sm:px-8 sm:py-28">
      <div className="max-w-4xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-5 text-[clamp(30px,5vw,56px)] leading-[1.05]">{t('title')}</h2>
        <p className="mt-7 max-w-3xl text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">
          {t('body')}
        </p>
      </div>
    </section>
  );
}

interface SurfaceItem { icon: keyof typeof ICONS; name: string; value: string; }

function PlatformSurfaces() {
  const t = useTranslations('code.platform.surfaces');
  const items = t.raw('items') as SurfaceItem[];
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(32px,6vw,60px)]">{t('title')}</h2>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-bone-200">{t('subtitle')}</p>
      </header>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          return (
            <article key={it.name} className="group bg-ink-800 p-6 transition-colors hover:bg-ink-700">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-line-strong)] bg-ink-700 text-cyan-400">
                {Icon && <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />}
              </div>
              <h3 className="font-display mt-5 text-[17px] font-semibold tracking-tight">{it.name}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-bone-200">{it.value}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-8">
        <a
          href={WHITEPAPER_SURFACES}
          className="group inline-flex items-center gap-2 text-[13.5px] tracking-wide text-cyan-200 transition-colors hover:text-cyan-100"
        >
          <span>Read the nine security surfaces in detail</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
        </a>
      </div>
    </section>
  );
}

interface ByoStep { n: string; title: string; body: string; }

function PlatformByo() {
  const t = useTranslations('code.platform.byo');
  const steps = t.raw('steps') as ByoStep[];
  return (
    <section className="mx-auto max-w-6xl border-y border-[var(--color-line)] px-5 py-24 sm:px-8 sm:py-28">
      <header className="mb-12 max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(32px,6vw,60px)]">{t('title')}</h2>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-bone-200">{t('subtitle')}</p>
      </header>

      <ol className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
        {steps.map((s) => (
          <li
            key={s.n}
            className="group grid gap-6 py-7 transition-colors hover:bg-violet-500/[0.03] sm:grid-cols-12 sm:gap-8 sm:px-2 sm:py-8"
          >
            <div className="sm:col-span-2">
              <span className="num-mono font-display text-5xl font-light text-bone-300/40 sm:text-6xl">
                {s.n}
              </span>
            </div>
            <div className="sm:col-span-3">
              <h3 className="font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
            </div>
            <div className="sm:col-span-7">
              <p className="max-w-2xl text-[14.5px] leading-relaxed text-bone-200">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PlatformLoop() {
  const t = useTranslations('code.platform.loop');
  const stages = t.raw('stages') as string[];
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-3xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(30px,5vw,56px)] leading-[1.06]">{t('title')}</h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">{t('body')}</p>
      </header>

      <div className="mt-12 rounded-3xl border border-[var(--color-line)] bg-ink-800/40 p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
          {stages.map((stage, i) => (
            <div key={stage} className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-[var(--color-line-strong)] bg-ink-700 px-3.5 py-1.5 font-mono text-[11.5px] tracking-wide text-bone-100">
                {stage}
              </span>
              {i < stages.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 flex-none text-cyan-300/70" strokeWidth={1.75} />
              )}
            </div>
          ))}
          <ArrowRight className="h-3.5 w-3.5 flex-none rotate-180 text-violet-300/50" strokeWidth={1.75} aria-hidden />
          <span className="font-mono text-[10.5px] tracking-[0.18em] text-violet-300/60 uppercase">loop</span>
        </div>
      </div>
    </section>
  );
}

function PlatformSubstrate() {
  const t = useTranslations('code.platform.substrate');
  return (
    <section className="mx-auto max-w-6xl border-t border-[var(--color-line)] px-5 py-24 sm:px-8 sm:py-28">
      <div className="max-w-4xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-5 text-[clamp(30px,5vw,56px)] leading-[1.05]">{t('title')}</h2>
        <p className="mt-7 max-w-3xl text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">{t('body')}</p>
        <div className="mt-9">
          <Button href="/cloud" variant="secondary">{t('automationCta')}</Button>
        </div>
      </div>
    </section>
  );
}
