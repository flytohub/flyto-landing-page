'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Bug, ChevronRight } from 'lucide-react';

interface ChainStep {
  vector: string;
  finding: string;
}

interface ProofData {
  metric: { value: string; label: string }[];
  chain: ChainStep[];
}

export function JuiceShopProof() {
  const t = useTranslations('code.proof');
  const data = t.raw('data') as ProofData;

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-bone-200">{t('subtitle')}</p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Metric panel */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-[var(--color-line)] bg-ink-800 p-7 lg:col-span-4 sm:p-8"
        >
          <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase text-bone-300">
            <Bug className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>TARGET · OWASP JUICE SHOP</span>
          </div>
          <ul className="mt-7 grid grid-cols-2 gap-x-5 gap-y-7">
            {data.metric.map((m) => (
              <li key={m.label}>
                <div className="num-mono h-display text-4xl text-bone-100 sm:text-5xl">
                  {m.value}
                </div>
                <div className="mt-2 text-[12px] leading-relaxed text-bone-200">{m.label}</div>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-[var(--color-line)] pt-5 text-[12.5px] leading-relaxed text-bone-200">
            {t('caption')}
          </p>
        </motion.div>

        {/* Attack chain */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-ink-800 lg:col-span-8"
        >
          <div className="border-b border-[var(--color-line)] bg-ink-900/40 px-6 py-3 font-mono text-[10.5px] tracking-[0.16em] uppercase text-bone-300">
            ATTACK CHAIN · {data.chain.length} HOPS
          </div>
          <ol className="divide-y divide-[var(--color-line)]">
            {data.chain.map((step, i) => (
              <li key={i} className="grid grid-cols-[40px_1fr] items-center gap-4 px-6 py-5 sm:grid-cols-[60px_180px_1fr]">
                <span className="num-mono font-display text-2xl text-bone-300/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[11.5px] tracking-wide uppercase text-cyan-300/90">
                  {step.vector}
                </span>
                <span className="col-span-2 text-[13.5px] leading-relaxed text-bone-100 sm:col-span-1">
                  <ChevronRight className="-ml-1 mr-1 inline-block h-3.5 w-3.5 text-bone-300/60 align-text-top sm:hidden" strokeWidth={2} />
                  {step.finding}
                </span>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
