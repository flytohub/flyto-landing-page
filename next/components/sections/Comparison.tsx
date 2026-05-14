'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

type Cell = 'yes' | 'no' | 'partial' | string;

interface Row {
  feature: string;
  values: Cell[]; // ordered to match columns
}

const COLS = ['Flyto2', 'Zapier', 'Make', 'Selenium'] as const;

interface CompData {
  rows: Row[];
}

export function Comparison() {
  const t = useTranslations('cloud.comparison');
  const data = t.raw('data') as CompData;

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(32px,5vw,56px)]">{t('title')}</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-200">
          {t('subtitle')}
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 overflow-x-auto rounded-2xl border border-[var(--color-line)]"
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-ink-800/40">
              <th className="px-5 py-4 text-[12px] font-medium tracking-wide text-bone-300 sm:px-6">
                {t('featureHeader')}
              </th>
              {COLS.map((col, i) => (
                <th
                  key={col}
                  className={cn(
                    'px-4 py-4 text-center text-[13px] font-medium tracking-tight sm:px-6',
                    i === 0 ? 'text-violet-300' : 'text-bone-200',
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr
                key={row.feature}
                className={cn(
                  'border-b border-[var(--color-line)] transition-colors last:border-b-0 hover:bg-ink-800/30',
                  ri % 2 === 1 && 'bg-ink-800/15',
                )}
              >
                <td className="px-5 py-4 text-[13.5px] text-bone-100 sm:px-6">{row.feature}</td>
                {row.values.map((v, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      'px-4 py-4 text-center sm:px-6',
                      ci === 0 && 'bg-violet-500/[0.04]',
                    )}
                  >
                    <CellMark value={v} highlight={ci === 0} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}

function CellMark({ value, highlight }: { value: Cell; highlight: boolean }) {
  if (value === 'yes') {
    return (
      <Check
        className={cn('mx-auto h-5 w-5', highlight ? 'text-violet-300' : 'text-emerald-400')}
        strokeWidth={2}
      />
    );
  }
  if (value === 'no') {
    return <X className="mx-auto h-5 w-5 text-bone-300/50" strokeWidth={2} />;
  }
  if (value === 'partial') {
    return <Minus className="mx-auto h-5 w-5 text-amber-400/80" strokeWidth={2} />;
  }
  return <span className="text-[12.5px] text-bone-200">{value}</span>;
}
