'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const home = locale === 'en' ? '/' : `/${locale}`;
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
      <div className="aurora" aria-hidden />
      <div className="grid-overlay" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <div className="label-mono mb-6">SIGNAL LOST · ERR 404</div>
        <h1 className="h-display text-[clamp(80px,18vw,260px)]">404</h1>
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-bone-100/65">
          The page you were looking for has drifted out of orbit.
        </p>
        <Link
          href={home}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-bone-100 px-5 py-3 text-[13px] tracking-wide text-ink-900 transition-transform hover:-translate-y-0.5"
        >
          {t('home')}
        </Link>
      </div>
    </section>
  );
}
