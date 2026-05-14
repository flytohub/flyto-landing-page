'use client';

import { useTranslations } from 'next-intl';
import type { Category } from '@/lib/forum';
import { cn } from '@/lib/cn';

const CATS: ('all' | Category)[] = ['all', 'question', 'bug', 'feature', 'discussion'];

export function CategoryFilter({
  value,
  onChange,
}: {
  value: Category | 'all';
  onChange: (v: Category | 'all') => void;
}) {
  const t = useTranslations('forum.categories');
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {CATS.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={cn(
            'rounded-full border px-3 py-1 text-[12px] tracking-wide transition-colors',
            value === c
              ? 'border-violet-400 bg-violet-500/15 text-bone-100'
              : 'border-[var(--color-line)] bg-ink-800 text-bone-200 hover:border-[var(--color-line-strong)] hover:text-bone-100',
          )}
        >
          {t(c)}
        </button>
      ))}
    </div>
  );
}
