'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative isolate overflow-hidden">
      {/* Layered background */}
      <div className="hero-glow" aria-hidden />
      <div className="hero-dots" aria-hidden />

      {/* Massive faint wordmark — typographic anchor instead of synthetic visual */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[18%] z-0 select-none text-center"
      >
        <span className="font-display text-[clamp(160px,28vw,360px)] font-semibold leading-none tracking-[-0.06em] text-bone-100/[0.025]">
          FLYTO2
        </span>
      </div>

      <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-28 text-center sm:px-8 sm:pb-32 sm:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-ink-800/70 px-3 py-1 text-[12px] tracking-wide text-bone-200 backdrop-blur-md"
        >
          <span className="pulse-dot" />
          <span>{t('eyebrow')}</span>
        </motion.div>

        <motion.h1
          className="h-display mx-auto mt-8 text-[clamp(52px,10vw,128px)] tracking-[-0.03em]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          {t('title')}
          <br />
          <span className="text-violet-300">{t('titleAccent')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-xl text-[16px] leading-relaxed text-bone-200 sm:text-[17px]"
        >
          {t('lede')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[10.5px] tracking-[0.18em] uppercase text-bone-300"
        >
          <span>OPEN SOURCE</span>
          <Dot />
          <span>NO TELEMETRY</span>
          <Dot />
          <span>YOURS</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 inline-flex flex-col items-center gap-1 text-bone-300"
        >
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase">scroll</span>
          <ChevronDown className="h-3 w-3 animate-bounce" strokeWidth={1.5} />
        </motion.div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-bone-300/50" aria-hidden />;
}
