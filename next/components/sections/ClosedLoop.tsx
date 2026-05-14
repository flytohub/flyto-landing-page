'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { ScanSearch, Wrench, Play, FileCheck2, ArrowRight } from 'lucide-react';

const STAGES = [
  { iconName: 'ScanSearch',  key: 'find'         },
  { iconName: 'Wrench',      key: 'craft'        },
  { iconName: 'Play',        key: 'run'          },
  { iconName: 'FileCheck2',  key: 'verdictStep'  },
] as const;

const ICONS = { ScanSearch, Wrench, Play, FileCheck2 };

export function ClosedLoop() {
  const t = useTranslations('code.closedLoop');

  return (
    <section className="border-y border-[var(--color-line)] bg-ink-800/30">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <header className="max-w-2xl">
          <span className="label-mono">{t('label')}</span>
          <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-bone-200">
            {t('subtitle')}
          </p>
        </header>

        <motion.ol
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid gap-3 md:grid-cols-7 md:items-stretch"
        >
          {STAGES.map((stage, i) => {
            const Icon = ICONS[stage.iconName];
            return (
              <li key={stage.key} className="contents">
                <article className="md:col-span-1 rounded-xl border border-[var(--color-line)] bg-ink-900/60 p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-line-strong)] bg-ink-700 text-cyan-400">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <span className="num-mono font-display text-2xl text-bone-300/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[16px] font-semibold tracking-tight">
                    {t(`${stage.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-bone-200">
                    {t(`${stage.key}.body`)}
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-400/80">
                    {t(`${stage.key}.signal`)}
                  </p>
                </article>

                {i < STAGES.length - 1 && (
                  <div className="hidden items-center justify-center md:flex">
                    <ArrowRight className="h-4 w-4 text-bone-300/50" strokeWidth={1.5} />
                  </div>
                )}
              </li>
            );
          })}
        </motion.ol>

        {/* Verdict callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid gap-2 sm:grid-cols-3"
        >
          {(['exploitable', 'sanitized', 'unreachable'] as const).map((v) => (
            <div
              key={v}
              className="rounded-lg border border-[var(--color-line)] bg-ink-900/60 p-4"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone-300">
                VERDICT
              </span>
              <div
                className="mt-2 font-display text-[18px] font-semibold tracking-tight"
                style={{
                  color:
                    v === 'exploitable' ? '#ef4444' :
                    v === 'sanitized'   ? '#10b981' :
                                          '#8a8779',
                }}
              >
                {t(`verdict.${v}.title`)}
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-bone-200">
                {t(`verdict.${v}.body`)}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
