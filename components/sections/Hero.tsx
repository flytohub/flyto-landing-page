'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative isolate flex min-h-[min(720px,calc(100svh-48px))] items-center overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden
        className="absolute inset-0 grid grid-rows-[70%_30%] sm:grid-cols-2 sm:grid-rows-1"
      >
        <div className="relative overflow-hidden">
          <Image
            src="/assets/img/flow-mcp-studio.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/assets/img/warroom/01-projects-home.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.56)_0%,rgba(2,6,23,0.78)_55%,rgba(2,6,23,0.96)_100%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[12px] tracking-wide text-white/85 backdrop-blur-md"
        >
          <span className="pulse-dot" />
          <span>{t('eyebrow')}</span>
        </motion.div>

        <motion.h1
          className="h-display mx-auto mt-5 max-w-5xl text-[clamp(52px,9vw,104px)] tracking-normal text-white"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          Flyto2
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-display mx-auto mt-4 max-w-4xl text-[clamp(24px,4vw,46px)] font-semibold leading-tight tracking-normal text-white"
        >
          {t('title')} <span className="text-cyan-200">{t('titleAccent')}</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-slate-200 sm:text-[17px]"
        >
          {t('lede')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[10.5px] tracking-[0.18em] uppercase text-white/70"
        >
          <span>FLYTO2 FLOW</span>
          <Dot />
          <span>AI AUTOMATION</span>
          <Dot />
          <span>FLYTO2 WARROOM</span>
          <Dot />
          <span>SECURITY OPERATIONS</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 inline-flex flex-col items-center gap-1 text-white/60"
        >
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase">scroll</span>
          <ChevronDown className="h-3 w-3 animate-bounce" strokeWidth={1.5} />
        </motion.div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />;
}
