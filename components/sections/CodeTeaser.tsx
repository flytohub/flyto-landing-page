'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';

export function CodeTeaser() {
  const t = useTranslations('home.codeTeaser');
  const locale = useLocale();
  const href = locale === 'en' ? '/code' : `/${locale}/code`;

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href={href}
          className="grad-border lift group relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/[0.08] via-ink-700/50 to-violet-500/[0.08] p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-10"
        >
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[var(--color-line-strong)] bg-ink-900">
            <ShieldCheck className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="label-mono">{t('label')}</span>
              <Tag variant="soon">{t('status')}</Tag>
            </div>
            <h2 className="h-display mt-3 text-[clamp(28px,4vw,40px)]">{t('title')}</h2>
            <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-bone-200">
              {t('body')}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start text-[13.5px] text-bone-100 transition-all group-hover:gap-3 sm:self-center">
            <span>{t('cta')}</span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
