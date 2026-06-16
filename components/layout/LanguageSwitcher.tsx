'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ChevronDown, Search, Check } from 'lucide-react';
import { locales, localeMeta, localeFlagUrl, type Locale } from '@/lib/locales';
import { cn } from '@/lib/cn';

/**
 * Language switcher — flag image trigger, portal-rendered dropdown with
 * search. Mirrors the LocalePicker pattern from flyto-code.
 */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus + reposition when opening
  useEffect(() => {
    if (!open) return;
    setQuery('');
    updatePos();
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open, updatePos]);

  // Reposition on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [open, updatePos]);

  const stripLocale = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    if (parts[0] && (locales as readonly string[]).includes(parts[0])) {
      return '/' + parts.slice(1).join('/');
    }
    return path;
  };

  const buildHref = (target: Locale) => {
    const stripped = stripLocale(pathname);
    return target === 'en' ? stripped || '/' : `/${target}${stripped === '/' ? '' : stripped}`;
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return locales;
    const q = query.toLowerCase().trim();
    return locales.filter((l) => {
      const m = localeMeta[l];
      return (
        l.toLowerCase().includes(q) ||
        m.native.toLowerCase().includes(q) ||
        m.english.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const dropdown = open && mounted ? (
    <div
      ref={dropdownRef}
      role="listbox"
      style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 99999 }}
      className="w-72 overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-ink-800/95 shadow-[var(--shadow-card)] backdrop-blur-xl animate-[lp-in_0.18s_ease-out]"
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-line)] px-3 py-2.5">
        <Search className="h-3.5 w-3.5 shrink-0 text-bone-100/40" strokeWidth={1.5} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full bg-transparent text-[13px] text-bone-100 outline-none placeholder:text-bone-100/30"
        />
      </div>
      <div className="max-h-72 overflow-y-auto py-1.5">
        {filtered.length === 0 ? (
          <div className="px-3 py-6 text-center text-[12px] text-bone-100/40">No results</div>
        ) : (
          filtered.map((l) => {
            const m = localeMeta[l];
            const active = l === locale;
            return (
              <Link
                key={l}
                href={buildHref(l)}
                onClick={() => {
                  document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; SameSite=Lax`;
                  setOpen(false);
                }}
                role="option"
                aria-selected={active}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-[13px] transition-colors',
                  active
                    ? 'bg-violet-500/10 text-bone-100'
                    : 'text-bone-100/70 hover:bg-white/5 hover:text-bone-100',
                )}
              >
                <img
                  src={localeFlagUrl(l)}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="flex flex-1 flex-col leading-tight">
                  <span className="font-medium text-bone-100">{m.native}</span>
                  {m.native !== m.english && (
                    <span className="text-[11px] text-bone-100/40">{m.english}</span>
                  )}
                </div>
                {active && <Check className="h-3.5 w-3.5 shrink-0 text-violet-300" strokeWidth={2} />}
              </Link>
            );
          })
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line-strong)] px-2.5 py-1.5 text-[12px] tracking-wide text-bone-100/80 transition-colors hover:border-violet-400 hover:text-bone-100',
          open && 'border-violet-400 text-bone-100',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${localeMeta[locale].native}`}
      >
        <img
          src={localeFlagUrl(locale)}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 shrink-0 rounded-full object-cover"
        />
        <ChevronDown
          className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
          strokeWidth={1.5}
        />
      </button>

      {mounted && dropdown && createPortal(dropdown, document.body)}

      <style jsx global>{`
        @keyframes lp-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
