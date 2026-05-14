'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { X, Cloud, ShieldCheck, BookOpen, PenSquare, Mail } from 'lucide-react';
import { cn } from '@/lib/cn';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('nav');
  const locale = useLocale();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const localized = (href: string) =>
    locale === 'en' ? href : `/${locale}${href === '/' ? '' : href}`;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="absolute inset-0 bg-ink-900/80 backdrop-blur-xl"
      />
      <aside
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-[var(--color-line-strong)] bg-ink-800 shadow-[var(--shadow-card)] transition-transform duration-500',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
          <Image
            src="/assets/img/white-logo.png"
            alt="Flyto2"
            width={90}
            height={79}
            className="h-9 w-auto"
          />
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line-strong)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="label-mono mb-4">PRODUCTS</div>
          <div className="grid grid-cols-2 gap-2.5">
            <ProductPill href={localized('/cloud')} icon={<Cloud className="h-4 w-4" strokeWidth={1.5} />} label={t('cloud')} onClose={onClose} />
            <ProductPill
              href={localized('/code')}
              icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.5} />}
              label={t('code')}
              soon={t('soon')}
              onClose={onClose}
            />
          </div>

          <div className="label-mono mb-4 mt-10">NAVIGATE</div>
          <ul className="space-y-1">
            <NavRow href={localized('/')} label={t('home')} onClose={onClose} />
            <NavRow href="https://docs.flyto2.com" external icon={<BookOpen className="h-4 w-4" strokeWidth={1.5} />} label={t('docs')} onClose={onClose} />
            <NavRow href="https://blog.flyto2.com" external icon={<PenSquare className="h-4 w-4" strokeWidth={1.5} />} label={t('blog')} onClose={onClose} />
            <NavRow href={localized('/contact')} icon={<Mail className="h-4 w-4" strokeWidth={1.5} />} label={t('contact')} onClose={onClose} />
          </ul>
        </div>

        <div className="border-t border-[var(--color-line)] px-6 py-5">
          <Link
            href={localized('/cloud/download')}
            onClick={onClose}
            className="block rounded-full bg-bone-100 py-3 text-center text-[13px] font-medium tracking-wide text-ink-900"
          >
            {t('download')}
          </Link>
        </div>
      </aside>
    </div>
  );
}

function ProductPill({
  href,
  icon,
  label,
  soon,
  onClose,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  soon?: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex flex-col gap-3 rounded-2xl border border-[var(--color-line)] bg-ink-700/40 px-4 py-4 transition-colors hover:border-violet-400 hover:bg-violet-500/10"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-line-strong)]">
        {icon}
      </span>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[14px]">{label}</span>
        {soon && (
          <span className="font-mono text-[9px] tracking-[0.18em] text-amber-300 uppercase">
            {soon}
          </span>
        )}
      </div>
    </Link>
  );
}

function NavRow({
  href,
  label,
  icon,
  external,
  onClose,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  external?: boolean;
  onClose: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClose}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-bone-100/80 transition-colors hover:bg-white/5 hover:text-bone-100"
      >
        {icon && <span className="text-bone-100/40">{icon}</span>}
        <span>{label}</span>
      </Link>
    </li>
  );
}
