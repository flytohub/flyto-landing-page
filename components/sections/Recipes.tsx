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
    <section id="recipes" className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(30px,8vw,64px)]">{t('title')}</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-200">
          {t('subtitle')}
        </p>
      </header>

      <div className="mt-8 grid min-w-0 gap-3 sm:mt-12 sm:gap-5 md:grid-cols-2">
        {items.map((it, i) => {
          const Icon = ICONS[it.iconName];
          return (
            <motion.article
              key={it.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="lift mx-auto flex w-full min-w-0 max-w-[28rem] flex-col gap-2.5 rounded-lg border border-[var(--color-line)] bg-ink-800 p-3 sm:gap-5 sm:p-7 md:max-w-none"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-7 w-7 place-items-center rounded-md border border-[var(--color-line-strong)] bg-ink-700 text-violet-300 sm:h-10 sm:w-10 sm:rounded-lg">
                  <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={1.5} />
                </span>
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-bone-300 sm:text-[10.5px] sm:tracking-[0.16em]">
                  RECIPE
                </span>
              </div>

              <div>
                <h3 className="font-display text-[16.5px] font-semibold tracking-tight sm:text-[22px]">
                  {it.name}
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-bone-200 sm:mt-2 sm:text-[13.5px]">{it.body}</p>
              </div>

              <pre className="max-w-full overflow-hidden whitespace-pre-wrap break-all rounded-md border border-[var(--color-line)] bg-ink-900/70 px-2 py-1.5 font-mono text-[9px] leading-relaxed text-bone-100 sm:px-3 sm:py-2.5 sm:text-[12px]">
                <code className="break-all">{it.command}</code>
              </pre>

              <div className="flex min-w-0 flex-wrap gap-1 pt-0.5 sm:gap-1.5 sm:pt-1">
                {it.outputs.map((o) => (
                  <span
                    key={o}
                    className="max-w-full break-all rounded-md border border-[var(--color-line)] bg-ink-900/60 px-1.5 py-0.5 font-mono text-[8.5px] text-bone-300 sm:px-2 sm:text-[10.5px]"
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
