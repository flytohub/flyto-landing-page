'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  Search,
  Activity,
  Globe,
  Crosshair,
  Camera,
  FileSpreadsheet,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Search, Activity, Globe, Crosshair, Camera, FileSpreadsheet,
};

interface Recipe {
  iconName: keyof typeof ICONS;
  name: string;
  command: string;
  body: string;
  outputs: string[];
}

export function Recipes() {
  const t = useTranslations('cloud.recipes');
  const items = t.raw('items') as Recipe[];

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-200">
          {t('subtitle')}
        </p>
      </header>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((it, i) => {
          const Icon = ICONS[it.iconName];
          return (
            <motion.article
              key={it.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="lift flex flex-col gap-5 rounded-2xl border border-[var(--color-line)] bg-ink-800 p-7"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-line-strong)] bg-ink-700 text-violet-300">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                </span>
                <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-bone-300">
                  RECIPE
                </span>
              </div>

              <div>
                <h3 className="font-display text-[22px] font-semibold tracking-tight">
                  {it.name}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-bone-200">{it.body}</p>
              </div>

              <pre className="overflow-x-auto rounded-md border border-[var(--color-line)] bg-ink-900/70 px-3 py-2.5 font-mono text-[12px] text-bone-100">
                <code>{it.command}</code>
              </pre>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {it.outputs.map((o) => (
                  <span
                    key={o}
                    className="rounded-md border border-[var(--color-line)] bg-ink-900/60 px-2 py-0.5 font-mono text-[10.5px] text-bone-300"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
