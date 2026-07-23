'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#f8f5ec_0%,#eef7f8_58%,#0d0d12_100%)] text-slate-950">
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:30px_30px] [mask-image:linear-gradient(180deg,black,transparent_78%)]"
      />

      {/* Massive faint wordmark — typographic anchor instead of synthetic visual */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[18%] z-0 select-none text-center"
      >
        <span className="font-display text-[clamp(160px,28vw,360px)] font-semibold leading-none tracking-normal text-slate-900/[0.045]">
          FLYTO2
        </span>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-8 pt-20 text-center sm:px-8 sm:pb-10 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/80 px-3 py-1 text-[12px] tracking-wide text-slate-700 shadow-sm backdrop-blur-md"
        >
          <span className="pulse-dot" />
          <span>{t('eyebrow')}</span>
        </motion.div>

        <motion.h1
          className="h-display mx-auto mt-5 max-w-5xl text-[clamp(38px,5.8vw,72px)] tracking-normal text-slate-950"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          {t('title')}
          <br />
          <span className="text-violet-700">{t('titleAccent')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-slate-700 sm:text-[17px]"
        >
          {t('lede')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[10.5px] tracking-[0.18em] uppercase text-slate-600"
        >
          <span>AI WORKFLOW</span>
          <Dot />
          <span>MCP-NATIVE</span>
          <Dot />
          <span>OPEN CORE</span>
        </motion.div>
      </div>

      {/* Product window — keeps a single visual anchor without lapsing into stock-art */}
      <div className="relative mx-auto max-w-5xl px-5 pb-24 sm:px-8 sm:pb-32">
        <motion.div
          initial={{ y: 32 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white/90 shadow-[0_34px_90px_-46px_rgba(15,23,42,0.72)] backdrop-blur">
            <BrowserChrome />
            <div className="relative aspect-[16/10] w-full bg-slate-950">
              <Image
                src="/assets/img/warroom/01-projects-home-960.webp"
                alt={t('eyebrow')}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 960px, (min-width: 768px) 720px, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-14 inline-flex flex-col items-center gap-1 text-slate-500"
        >
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase">scroll</span>
          <ChevronDown className="h-3 w-3 animate-bounce" strokeWidth={1.5} />
        </motion.div>
      </div>
    </section>
  );
}

function BrowserChrome() {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </div>
      <div className="hidden flex-1 sm:block">
        <div className="mx-auto inline-flex w-full max-w-md items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] tracking-wide text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          warroom.flyto2.com
        </div>
      </div>
      <div className="hidden sm:block sm:w-[58px]" />
    </div>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-slate-500/50" aria-hidden />;
}
