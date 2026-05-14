'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FAQItem {
  q: string;
  a: string;
}

export function FAQ({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const items = t.raw('items') as FAQItem[];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <header className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
          <span className="label-mono">{t('label')}</span>
          <h2 className="h-display mt-4 text-[clamp(36px,5vw,56px)]">{t('title')}</h2>
          <p className="mt-5 max-w-xs text-[14.5px] leading-relaxed text-bone-200">
            {t('subtitle')}
          </p>
        </header>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {items.map((it, i) => {
              const open = openIdx === i;
              return (
                <li key={i}>
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className={cn(
                      'group flex w-full items-start gap-6 py-6 text-left transition-colors',
                      open ? 'text-bone-100' : 'text-bone-100 hover:text-violet-200',
                    )}
                    aria-expanded={open}
                  >
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-bone-300 mt-1 w-8">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 pr-4 font-display text-[18px] leading-snug tracking-tight sm:text-[22px]">
                      {it.q}
                    </span>
                    <span
                      className={cn(
                        'mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-line-strong)] transition-all',
                        open && 'rotate-45 border-violet-400 bg-violet-500/10',
                      )}
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-[2rem_1fr] gap-6 pb-6 sm:grid-cols-[2rem_1fr_1.75rem]">
                          <span aria-hidden />
                          <p className="max-w-2xl text-[14.5px] leading-relaxed text-bone-200">
                            {it.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
