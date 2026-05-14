'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FeatureRow {
  index: string;
  label: string;
  title: string;
  body: string;
  bullets: string[];
  image: string;
  imageAlt: string;
}

const ROWS: Omit<FeatureRow, 'label' | 'title' | 'body' | 'bullets' | 'imageAlt'>[] = [
  { index: '01', image: '/assets/img/screenshots/dashboard-full.png' },
  { index: '02', image: '/assets/img/screenshots/reachability.png' },
  { index: '03', image: '/assets/img/screenshots/dependencies.png' },
  { index: '04', image: '/assets/img/screenshots/architecture.png' },
  { index: '05', image: '/assets/img/screenshots/api-list.png' },
  { index: '06', image: '/assets/img/screenshots/iac.png' },
  { index: '07', image: '/assets/img/screenshots/pulse.png' },
];

export function CodeFeatureRows() {
  const t = useTranslations('code.features');
  const items = t.raw('items') as Pick<FeatureRow, 'label' | 'title' | 'body' | 'bullets' | 'imageAlt'>[];

  return (
    <section className="relative">
      {/* Section header */}
      <header className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 sm:pt-32">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 max-w-3xl text-[clamp(36px,6vw,72px)]">{t('title')}</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-200">
          {t('subtitle')}
        </p>
      </header>

      {/* Rows */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {items.map((item, i) => {
          const row = ROWS[i];
          if (!row) return null;
          const reverse = i % 2 === 1;
          return (
            <FeatureRowBlock
              key={row.index}
              index={row.index}
              image={row.image}
              imageAlt={item.imageAlt}
              label={item.label}
              title={item.title}
              body={item.body}
              bullets={item.bullets}
              reverse={reverse}
            />
          );
        })}
      </div>
    </section>
  );
}

interface FeatureRowBlockProps {
  index: string;
  image: string;
  imageAlt: string;
  label: string;
  title: string;
  body: string;
  bullets: string[];
  reverse: boolean;
}

function FeatureRowBlock({ index, image, imageAlt, label, title, body, bullets, reverse }: FeatureRowBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'grid items-center gap-10 border-b border-[var(--color-line)] py-20 last:border-b-0 lg:grid-cols-12 lg:gap-16 lg:py-28',
      )}
    >
      {/* Text */}
      <div className={cn('lg:col-span-5', reverse && 'lg:order-2')}>
        <div className="flex items-baseline gap-3">
          <span className="num-mono font-display text-[44px] font-light text-bone-300/30">
            {index}
          </span>
          <span className="label-mono">{label}</span>
        </div>
        <h3 className="h-display mt-4 text-[clamp(28px,4vw,42px)]">{title}</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-bone-200">{body}</p>
        {bullets?.length > 0 && (
          <ul className="mt-6 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[13.5px] text-bone-100/85">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" strokeWidth={2} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Image — embedded in a window-chrome frame */}
      <div className={cn('lg:col-span-7', reverse && 'lg:order-1')}>
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-ink-700/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          {/* window dots */}
          <div className="flex items-center gap-2 border-b border-[var(--color-line)] bg-ink-800/40 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="ml-2 font-mono text-[10px] tracking-[0.16em] uppercase text-bone-300">
              CODE · {label}
            </span>
          </div>
          <div className="relative aspect-[16/10] w-full bg-ink-900">
            <Image
              src={image}
              alt={imageAlt}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-violet-500/[0.06] via-transparent to-cyan-500/[0.04]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
