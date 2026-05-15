'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import type { NavGroup } from '@/lib/nav';

const GROUP_LABELS: Record<NavGroup['key'], string> = {
  product: 'Product',
  resources: 'Resources',
  community: 'Community',
};

export function MegaMenu({
  group,
  localize,
  activePath,
}: {
  group: NavGroup;
  localize: (href: string) => string;
  activePath: string;
}) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  const strippedActivePath = activePath.replace(/^\/[a-z]{2}(\/|$)/, '/');
  const hasActive = group.items.some(
    (item) => !item.external && item.href === strippedActivePath,
  );

  const handleEnter = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'inline-flex items-center gap-1.5 text-[12.5px] tracking-wide transition-colors',
          hasActive ? 'text-bone-100' : 'text-bone-200 hover:text-bone-100',
        )}
      >
        <span>{GROUP_LABELS[group.key]}</span>
        <ChevronDown
          className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
          strokeWidth={1.75}
        />
        {hasActive && (
          <span className="ml-0.5 inline-block h-1 w-1 rounded-full bg-violet-400" />
        )}
      </button>
      {open && (
        <div
          className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-2xl border border-[var(--color-line)] bg-ink-800/95 p-2 shadow-[var(--shadow-card)] backdrop-blur-xl"
          role="menu"
        >
          {group.items.map((item) => {
            const href = item.external ? item.href : localize(item.href);
            const active =
              !item.external && item.href === strippedActivePath;
            return (
              <Link
                key={item.key}
                href={href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                role="menuitem"
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] transition-colors',
                  active
                    ? 'bg-violet-500/15 text-bone-100'
                    : 'text-bone-200 hover:bg-white/5 hover:text-bone-100',
                )}
              >
                <span>{t(item.key)}</span>
                {item.external && (
                  <ArrowUpRight
                    className="h-3 w-3 opacity-50"
                    strokeWidth={1.5}
                  />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
