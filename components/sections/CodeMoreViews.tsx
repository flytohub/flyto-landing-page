'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

interface ViewItem {
  image: string;
  title: string;
  body: string;
}

const VIEWS: { image: string; key: string }[] = [
  { key: 'autofix',     image: '/assets/img/warroom/06-autofix.png' },
  { key: 'taintFlow',   image: '/assets/img/warroom/20-taint-analysis.png' },
  { key: 'license',     image: '/assets/img/warroom/18-license-compliance.png' },
  { key: 'owasp',       image: '/assets/img/warroom/27-reports-owasp.png' },
  { key: 'queue',       image: '/assets/img/warroom/16-security-queue.png' },
  { key: 'malware',     image: '/assets/img/warroom/19-malware-detection.png' },
  { key: 'complexity',  image: '/assets/img/warroom/13-complexity.png' },
  { key: 'deadCode',    image: '/assets/img/warroom/11-dead-code.png' },
  { key: 'assetMap',    image: '/assets/img/warroom/26-asset-map.png' },
  { key: 'domainSec',   image: '/assets/img/warroom/23-domain-security.png' },
  { key: 'duplicate',   image: '/assets/img/warroom/12-duplicate-code.png' },
  { key: 'reportBuilder', image: '/assets/img/warroom/28-reports-builder.png' },
];

export function CodeMoreViews() {
  const t = useTranslations('code.gallery');
  const items = t.raw('items') as Record<string, Pick<ViewItem, 'title' | 'body'>>;

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <header className="mb-12 max-w-2xl">
          <span className="label-mono">{t('label')}</span>
          <h2 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">{t('title')}</h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-200">{t('subtitle')}</p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIEWS.map((v, i) => {
            const data = items[v.key];
            if (!data) return null;
            return (
              <motion.figure
                key={v.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group overflow-hidden rounded-2xl border border-[var(--color-line)] bg-ink-800/60 transition-colors hover:border-cyan-400/40 hover:bg-ink-700/60"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-900">
                  <Image
                    src={v.image}
                    alt={data.title}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent"
                  />
                </div>
                <figcaption className="p-5">
                  <h3 className="font-display text-[17px] font-semibold tracking-tight text-bone-100">
                    {data.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-bone-200/90">
                    {data.body}
                  </p>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
