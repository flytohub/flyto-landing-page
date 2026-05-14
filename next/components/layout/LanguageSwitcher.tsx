'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe, ChevronDown, Search } from 'lucide-react';
import { locales, localeMeta, type Locale } from '@/lib/locales';
import { cn } from '@/lib/cn';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

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

  const filtered = locales.filter((l) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const m = localeMeta[l];
    return (
      l.toLowerCase().includes(q) ||
      m.native.toLowerCase().includes(q) ||
      m.english.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line-strong)] px-3 py-2 text-[12px] tracking-wide text-bone-100/80 transition-colors hover:border-violet-400 hover:text-bone-100"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        <ChevronDown
          className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-ink-800/95 shadow-[var(--shadow-card)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-[var(--color-line)] px-3 py-2.5">
            <Search className="h-3.5 w-3.5 text-bone-100/40" strokeWidth={1.5} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent text-[13px] text-bone-100 outline-none placeholder:text-bone-100/30"
            />
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
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
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-[13px] transition-colors',
                      active
                        ? 'bg-violet-500/10 text-bone-100'
                        : 'text-bone-100/70 hover:bg-white/5 hover:text-bone-100',
                    )}
                  >
                    <span className="text-base">{m.flag}</span>
                    <span className="flex-1">{m.native}</span>
                    <span className="font-mono text-[10px] tracking-[0.16em] text-bone-100/30 uppercase">
                      {l}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
