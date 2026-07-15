'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { useTranslations } from 'next-intl';

interface StatItem {
  value: string;
  label: string;
  body: string;
}

export function Stats() {
  const t = useTranslations('home.stats');
  const items = t.raw('items') as StatItem[];

  return (
    <section className="relative border-y border-[var(--color-line)] bg-ink-800/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid divide-y divide-[var(--color-line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {items.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 px-2 py-8 sm:px-10 sm:py-4"
            >
              <span className="label-mono">{s.label}</span>
              <CountedValue raw={s.value} />
              <span className="text-[14px] leading-relaxed text-bone-200">{s.body}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Parses a value like "451+", "16", "100%" — extracts the number and renders
 * an animated count-up that triggers when scrolled into view. Non-numeric
 * values render as static text.
 */
function CountedValue({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  // Pull the leading numeric portion. "451+" -> 451, "16" -> 16, "100%" -> 100.
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : NaN;
  const suffix = match ? match[2] : '';

  const count = useMotionValue(0);
  const display = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView || isNaN(target)) return;
    const controls = animate(count, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, target, count]);

  if (isNaN(target)) {
    return (
      <span className="num-mono h-display text-[clamp(48px,7vw,84px)] text-bone-100">{raw}</span>
    );
  }

  return (
    <span ref={ref} className="num-mono h-display text-[clamp(48px,7vw,84px)] text-bone-100">
      <motion.span>{display}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
