'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';

interface Example {
  src: string;
  category: string;
  title: string;
  body: string;
  metric: string;
}

const EXAMPLES: Omit<Example, 'category' | 'title' | 'body' | 'metric'>[] = [
  { src: '/assets/img/examples/hn_front.png' },
  { src: '/assets/img/examples/github_trending.png' },
  { src: '/assets/img/examples/pagespeed_home.png' },
  { src: '/assets/img/examples/security_headers.png' },
];

export function RealExamples() {
  const t = useTranslations('home.examples');
  const items = t.raw('items') as Pick<Example, 'category' | 'title' | 'body' | 'metric'>[];

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(32px,5vw,56px)]">{t('title')}</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-200">{t('subtitle')}</p>
      </header>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((item, i) => {
          const src = EXAMPLES[i]?.src;
          if (!src) return null;
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="lift group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-ink-800"
            >
              {/* Screenshot */}
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--color-line)] bg-ink-900">
                <Image
                  src={src}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-bone-300">
                    {item.category}
                  </span>
                  <span className="num-mono text-[12px] text-violet-300">{item.metric}</span>
                </div>
                <h3 className="font-display text-[20px] font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-bone-200">{item.body}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[12.5px] tracking-wide text-bone-100/70 transition-all group-hover:gap-2.5 group-hover:text-bone-100">
                  <span>{t('viewWorkflow')}</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                  />
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
