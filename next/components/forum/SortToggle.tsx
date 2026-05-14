'use client';

import { useTranslations } from 'next-intl';
import type { Sort } from '@/lib/forum';
import { cn } from '@/lib/cn';

const SORTS: Sort[] = ['new', 'hot', 'top'];

export function SortToggle({
  value,
  onChange,
}: {
  value: Sort;
  onChange: (v: Sort) => void;
}) {
  const t = useTranslations('forum.sort');
  return (
    <div className="inline-flex items-center gap-px rounded-full border border-[var(--color-line)] bg-ink-800 p-0.5">
      {SORTS.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={cn(
            'rounded-full px-3 py-1 text-[11.5px] font-mono tracking-[0.14em] uppercase transition-colors',
            value === s ? 'bg-violet-500/20 text-bone-100' : 'text-bone-300 hover:text-bone-100',
          )}
        >
          {t(s)}
        </button>
      ))}
    </div>
  );
}
