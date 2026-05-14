'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  Video,
  Pause,
  ShieldOff,
  Boxes,
  GitBranch,
  Languages,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Video,
  Pause,
  ShieldOff,
  Boxes,
  GitBranch,
  Languages,
};

interface FeatureItem {
  icon: keyof typeof ICONS;
  title: string;
  body: string;
}

export function HomeFeatures() {
  const t = useTranslations('home.features');
  const items = t.raw('items') as FeatureItem[];

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
      </header>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => {
          const Icon = ICONS[it.icon];
          return (
            <motion.article
              key={it.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-ink-800 p-7 transition-colors hover:bg-ink-700 sm:p-9"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-violet-300 transition-all group-hover:border-violet-400 group-hover:text-violet-200">
                {Icon && <Icon className="h-5 w-5" strokeWidth={1.5} />}
              </div>
              <h3 className="font-display mt-6 text-[20px] font-semibold tracking-tight">
                {it.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-bone-200">{it.body}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
