'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, ArrowUpRight, Cloud, ShieldCheck } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { products, productNav, detectProduct } from '@/lib/nav';
import { cn } from '@/lib/cn';

const PRODUCT_ICONS = { Cloud, ShieldCheck };

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const localized = (href: string) =>
    href.startsWith('http') || href.startsWith('#')
      ? href
      : locale === 'en'
        ? href
        : `/${locale}${href === '/' ? '' : href}`;

  const product = detectProduct(pathname);
  const subNav = productNav[product];
  const showSubNav = subNav.length > 0;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          scrolled || showSubNav
            ? 'border-b border-[var(--color-line)] bg-ink-900/85 backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        {/* Row 1 — primary: brand + product switcher + controls */}
        <div className="border-b border-[var(--color-line)]/60">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
            <Link href={localized('/')} className="flex items-center" aria-label="Flyto2">
              <Image
                src="/assets/img/white-logo.png"
                alt="Flyto2"
                width={90}
                height={79}
                priority
                className="h-8 w-auto"
              />
            </Link>

            {/* Product tabs — center on desktop, hidden on mobile (mobile menu shows them) */}
            <div className="hidden items-center gap-1 md:flex">
              {products.map((p) => {
                const Icon = PRODUCT_ICONS[p.icon as keyof typeof PRODUCT_ICONS];
                const active = product === p.id;
                return (
                  <Link
                    key={p.id}
                    href={localized(p.href)}
                    className={cn(
                      'group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] tracking-wide transition-all',
                      active
                        ? 'bg-violet-500/15 text-bone-100 ring-1 ring-violet-500/30'
                        : 'text-bone-200 hover:bg-white/5 hover:text-bone-100',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-3.5 w-3.5 transition-colors',
                        active ? 'text-violet-300' : 'text-bone-300',
                      )}
                      strokeWidth={1.75}
                    />
                    <span>{p.name}</span>
                    {p.status === 'soon' && (
                      <span className="rounded-sm border border-amber-400/40 px-1 text-[8.5px] tracking-[0.18em] text-amber-300">
                        {t('soon')}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                href={product === 'code' ? '/code#waitlist' : localized('/cloud/download')}
                className="hidden h-8 items-center rounded-full bg-bone-100 px-3.5 text-[12px] font-medium tracking-wide text-ink-900 transition-all hover:-translate-y-px hover:bg-white sm:inline-flex"
              >
                {product === 'code' ? t('waitlist') : t('download')}
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line-strong)] md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2 — contextual nav for current product (hidden on home) */}
        {showSubNav && (
          <div className="hidden md:block">
            <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
              <div className="flex items-center gap-1">
                <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-bone-300">
                  {product === 'cloud' ? '/ CLOUD' : '/ CODE'}
                </span>
              </div>
              <nav className="flex items-center gap-6">
                {subNav.map((item) => {
                  const href = item.external ? item.href : localized(item.href);
                  const active =
                    !item.external &&
                    !item.href.includes('#') &&
                    (item.href === pathname.replace(/^\/[a-z]{2}/, '') ||
                      item.href === pathname);
                  return (
                    <Link
                      key={item.key}
                      href={href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'group inline-flex items-center gap-1 text-[12.5px] tracking-wide transition-colors',
                        active ? 'text-bone-100' : 'text-bone-200 hover:text-bone-100',
                      )}
                    >
                      {t(item.key)}
                      {item.external && (
                        <ArrowUpRight className="h-3 w-3 opacity-50" strokeWidth={1.5} />
                      )}
                      {active && (
                        <span className="ml-1 inline-block h-1 w-1 rounded-full bg-violet-400" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Spacer matches header height. 48 (row 1) + 40 (row 2 if visible). */}
      <div aria-hidden className={cn(showSubNav ? 'h-[88px] md:h-[88px]' : 'h-12')} />
    </>
  );
}

