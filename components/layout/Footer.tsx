'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { GitFork, Video, Mail, ArrowUpRight, Cloud, ShieldCheck } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const localized = (href: string) =>
    locale === 'en' ? href : `/${locale}${href === '/' ? '' : href}`;

  return (
    <footer className="relative mt-24 border-t border-[var(--color-line)] bg-ink-800/40">
      {/* Top strip — product nav */}
      <div className="border-b border-[var(--color-line)]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2">
          <ProductRail
            href={localized('/flow')}
            Icon={Cloud}
            label="Flow"
            tagline={t('cloudTagline')}
            accent="rgba(167, 139, 250, 0.9)"
            border="sm:border-r"
          />
          <ProductRail
            href={localized('/warroom')}
            Icon={ShieldCheck}
            label="Warroom"
            tagline={t('warroomTagline')}
            accent="rgba(34, 211, 238, 0.9)"
          />
        </div>
      </div>

      {/* Body — link columns */}
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-5">
          <Link href={localized('/')} className="inline-block" aria-label="Flyto2">
            <Image
              src="/assets/img/white-logo.webp"
              alt="Flyto2"
              width={90}
              height={79}
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-bone-200">{t('tagline')}</p>
          <div className="mt-6 flex items-center gap-2">
            <SocialIcon href="https://github.com/flytohub"  label="GitHub"><GitFork className="h-4 w-4" strokeWidth={1.5} /></SocialIcon>
            <SocialIcon href="https://www.youtube.com/@Flyto2" label="YouTube"><Video className="h-4 w-4" strokeWidth={1.5} /></SocialIcon>
            <SocialIcon href="mailto:info@flyto2.com" label="Email"><Mail className="h-4 w-4" strokeWidth={1.5} /></SocialIcon>
          </div>
        </div>

        <Column title={t('products')} className="md:col-span-2">
          <FooterLink href={localized('/flow')}>Flyto2 Flow</FooterLink>
          <FooterLink href={localized('/flow/mcp-builder')}>Visual MCP builder</FooterLink>
          <FooterLink href={localized('/flow/browser-automation')}>Browser automation</FooterLink>
          <FooterLink href={localized('/warroom')}>Flyto2 Warroom</FooterLink>
          <FooterLink href={localized('/warroom/ctem')}>CTEM platform</FooterLink>
          <FooterLink href={localized('/pricing')}>{nav('pricing')}</FooterLink>
          <FooterLink href={localized('/enterprise')}>Enterprise</FooterLink>
        </Column>

        <Column title={t('community')} className="md:col-span-2">
          <FooterLink href={localized('/community')}>{nav('community')}</FooterLink>
          <FooterLink href={localized('/whitepaper')}>Whitepapers</FooterLink>
          <FooterLink href="https://docs.flyto2.com/flow/" external>Flow docs</FooterLink>
          <FooterLink href="https://docs.flyto2.com/warroom/" external>Warroom docs</FooterLink>
          <FooterLink href={localized('/api-docs')}>API docs</FooterLink>
          <FooterLink href="https://blog.flyto2.com/flow/" external>Flow articles</FooterLink>
          <FooterLink href="https://blog.flyto2.com/security/" external>Security articles</FooterLink>
          <FooterLink href={localized('/changelog')}>Changelog</FooterLink>
          <FooterLink href={localized('/support')}>Support</FooterLink>
          <FooterLink href={localized('/contact')}>{nav('contact')}</FooterLink>
        </Column>

        <Column title={t('openSource')} className="md:col-span-3">
          <FooterLink href={localized('/flow')}>Flyto2 Flow</FooterLink>
          <FooterLink href={localized('/open-source')}>Flyto2 Warroom</FooterLink>
          <FooterLink href="https://hub.docker.com/r/chesterhsu/flyto-warroom" external>Docker images</FooterLink>
          <FooterLink href="https://github.com/flytohub/flyto-core" external>flyto-core</FooterLink>
          <FooterLink href="https://pypi.org/project/flyto-core/" external>flyto-core on PyPI</FooterLink>
          <FooterLink href="https://pypi.org/project/flyto-indexer/" external>flyto-indexer on PyPI</FooterLink>
          <FooterLink href={localized('/compare')}>Compare</FooterLink>
          <FooterLink href={localized('/airgap')}>Airgap</FooterLink>
          <FooterLink href={localized('/trust')}>Trust</FooterLink>
        </Column>
      </div>

      {/* Bottom strip — legal + status */}
      <div className="border-t border-[var(--color-line)]">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-start justify-between gap-3 px-5 py-5 sm:px-8 md:flex-row md:items-center">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-bone-300">
            {t('copyright')}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-bone-200">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.16em] uppercase text-bone-300">
              <span className="pulse-dot" />
              ALL SYSTEMS NORMAL
            </span>
            <Link href={localized('/support')} prefetch={false} className="hover:text-bone-100">Support</Link>
            <Link href={localized('/privacy')} prefetch={false} className="hover:text-bone-100">{t('privacy')}</Link>
            <Link href={localized('/terms')} prefetch={false} className="hover:text-bone-100">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ProductRail({
  href, Icon, label, tagline, accent, border = '',
}: {
  href: string;
  Icon: typeof Cloud;
  label: string;
  tagline: string;
  accent: string;
  border?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`group flex items-center gap-4 px-5 py-7 transition-colors hover:bg-ink-700/40 sm:px-8 ${border} border-b border-[var(--color-line)] sm:border-b-0`}
    >
      <span
        className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-900"
        style={{ color: accent }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <span className="flex-1">
        <span className="block font-display text-[18px] font-semibold tracking-tight">{label}</span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-bone-200">{tagline}</span>
      </span>
      <ArrowUpRight
        className="h-4 w-4 flex-none text-bone-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone-100"
        strokeWidth={1.75}
      />
    </Link>
  );
}

function Column({
  title, children, className,
}: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-bone-300">{title}</h3>
      <ul className="mt-5 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children, external }: {
  href: string; children: React.ReactNode; external?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        prefetch={external ? undefined : false}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="group inline-flex items-center gap-1 text-[13px] text-bone-200 transition-colors hover:text-bone-100"
      >
        {children}
        {external && (
          <ArrowUpRight
            className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        )}
      </Link>
    </li>
  );
}

function SocialIcon({
  href, label, children,
}: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line-strong)] text-bone-300 transition-all hover:-translate-y-0.5 hover:border-violet-400 hover:text-bone-100"
    >
      {children}
    </Link>
  );
}
