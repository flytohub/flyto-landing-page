'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Cloud,
  ShieldCheck,
  ArrowUpRight,
  Check,
  Circle,
  MousePointer2,
  Type,
  Database,
  ShieldCheck as Shield,
  Send,
  type LucideIcon,
} from 'lucide-react';
import { Tag } from '@/components/ui/Tag';

interface ProductPaint {
  /** Solid panel background — visible at 100%, not a 3% wash */
  panel: string;
  /** Border tint — slightly stronger than panel */
  border: string;
  /** Icon + check + accent text color */
  accent: string;
  /** Bottom-area background where the product visual sits */
  visualBg: string;
}

interface ProductCardData {
  productKey: 'cloud' | 'warroom';
  href: string;
  IconMark: LucideIcon;
  status: 'live' | 'beta' | 'soon';
  paint: ProductPaint;
}

const CARDS: ProductCardData[] = [
  {
    productKey: 'warroom',
    href: '/open-source',
    IconMark: ShieldCheck,
    status: 'beta',
    paint: {
      panel:    'linear-gradient(180deg, rgba(236, 253, 255, 0.98), rgba(255, 255, 255, 0.94) 72%)',
      border:   'rgba(14, 116, 144, 0.26)',
      accent:   '#0e7490',
      visualBg: '#e9fbff',
    },
  },
  {
    productKey: 'cloud',
    href: '/cloud',
    IconMark: Cloud,
    status: 'live',
    paint: {
      panel:    'linear-gradient(180deg, rgba(245, 240, 255, 0.98), rgba(255, 255, 255, 0.94) 72%)',
      border:   'rgba(109, 40, 217, 0.24)',
      accent:   '#6d28d9',
      visualBg: '#f1ecff',
    },
  },
];

export function ProductPicker() {
  const t = useTranslations('home.products');

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-[#f7f4ed] text-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <header className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-[11px] tracking-[0.16em] text-slate-500 uppercase">
          {t('label')}
        </span>
        <h2 className="h-display mt-4 text-[clamp(34px,5.5vw,60px)] tracking-normal">
          {t('title')}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-slate-700">
          {t('subtitle')}
        </p>
      </header>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {CARDS.map((card, i) => (
          <ProductCard key={card.productKey} card={card} index={i} />
        ))}
      </div>
      </div>
    </section>
  );
}

function ProductCard({ card, index }: { card: ProductCardData; index: number }) {
  const t = useTranslations(`home.products.${card.productKey}`);
  const { IconMark, paint } = card;
  const locale = useLocale();
  const localized = locale === 'en' ? card.href : `/${locale}${card.href}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={localized}
        prefetch={false}
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border shadow-[0_24px_60px_-38px_rgba(15,23,42,0.42)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_72px_-42px_rgba(15,23,42,0.52)]"
        style={{ background: paint.panel, borderColor: paint.border }}
      >
        {/* Top body */}
        <div className="flex flex-col gap-7 p-8 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div
              className="grid h-14 w-14 place-items-center rounded-lg border bg-white"
              style={{ color: paint.accent, borderColor: paint.border }}
            >
              <IconMark className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <Tag
              variant={card.status}
              className="border-slate-300 bg-white/80 text-slate-700"
            >
              {t('statusLabel')}
            </Tag>
          </div>

          <div>
            <h3 className="h-display text-[clamp(32px,4vw,48px)] tracking-normal text-slate-950">
              {t('name')}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{t('tagline')}</p>
          </div>

          <ul className="space-y-2.5">
            {(['point1', 'point2', 'point3'] as const).map((k) => (
              <li
                key={k}
                className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-slate-700"
              >
                <Check className="mt-0.5 h-4 w-4 flex-none" style={{ color: paint.accent }} strokeWidth={2} />
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>

          <div
            className="inline-flex items-center gap-2 text-[14px] font-medium tracking-wide transition-all group-hover:gap-3"
            style={{ color: paint.accent }}
          >
            <span>{t('cta')}</span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </div>
        </div>

        {/* Bottom visual band — distinctive per product */}
        <div
          className="relative mt-auto h-72 overflow-hidden border-t"
          style={{ background: paint.visualBg, borderColor: paint.border }}
        >
          {card.productKey === 'cloud' ? (
            <CloudPreview accent={paint.accent} />
          ) : (
            <WarroomPreview />
          )}
          {/* Bottom fade so the preview "feels" embedded, not screenshot-pasted */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
            style={{
              background: `linear-gradient(180deg, transparent, ${paint.visualBg})`,
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

function CloudPreview({ accent }: { accent: string }) {
  const steps = [
    { Icon: MousePointer2, label: 'Click "Login"' },
    { Icon: Type,          label: 'Fill credentials' },
    { Icon: Database,      label: 'Read 142 rows' },
    { Icon: Shield,        label: 'Validate' },
    { Icon: Send,          label: 'Push to Slack' },
  ];
  return (
    <div className="absolute inset-x-6 top-6 sm:inset-x-10 sm:top-8">
      <div className="overflow-hidden rounded-lg border border-[var(--color-line-strong)] bg-ink-900/80 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-line)] bg-ink-800/50 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="ml-1 font-mono text-[9px] uppercase tracking-[0.16em] text-bone-300">
            checkout-flow
          </span>
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: accent }}>
            <Circle className="h-1.5 w-1.5 fill-current" />
            REC
          </span>
        </div>
        <ul className="divide-y divide-[var(--color-line)]">
          {steps.map(({ Icon, label }, i) => (
            <li key={i} className="flex items-center gap-2.5 px-3 py-2">
              <span className="num-mono w-4 text-[10px] text-bone-300">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="grid h-5 w-5 place-items-center rounded border border-[var(--color-line)] bg-ink-800/60">
                <Icon className="h-2.5 w-2.5" strokeWidth={1.5} style={{ color: accent }} />
              </span>
              <span className="flex-1 text-[11px] text-bone-100">{label}</span>
              <span className="num-mono text-[9px] text-bone-300">+{(i * 0.3).toFixed(1)}s</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WarroomPreview() {
  return (
    <div className="absolute inset-x-6 top-6 sm:inset-x-10 sm:top-8">
      <div className="overflow-hidden rounded-lg border border-[var(--color-line-strong)] bg-ink-900/85 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-line)] bg-ink-800/50 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="ml-1 font-mono text-[9px] uppercase tracking-[0.16em] text-bone-300">
            warroom · health
          </span>
        </div>
        <div className="relative aspect-[16/9] w-full bg-ink-900">
          <Image
            src="/assets/img/warroom/01-projects-home.webp"
            alt="Warroom security health dashboard"
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
