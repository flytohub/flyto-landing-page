'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Zap, ShieldOff, Code2, Globe2, Radar, Crosshair, KeyRound, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Zap, ShieldOff, Code2, Globe2, Radar, Crosshair, KeyRound,
};

interface BenefitItem {
  iconName: keyof typeof ICONS;
  metric: string;
  title: string;
  body: string;
}

export function CoreBenefits() {
  const t = useTranslations('home.benefits');
  const items = t.raw('items') as BenefitItem[];

  return (
    <section className="border-y border-[var(--color-line)] bg-ink-800/30">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[item.iconName];
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="bg-ink-800 p-7 sm:p-8"
              >
                <Icon className="h-5 w-5 text-violet-300" strokeWidth={1.5} />
                <div className="num-mono h-display mt-5 text-4xl text-bone-100">
                  {item.metric}
                </div>
                <h3 className="mt-3 text-[14.5px] font-medium tracking-tight text-bone-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-bone-200">{item.body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
