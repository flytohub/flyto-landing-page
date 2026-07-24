'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

const VIDEOS = {
  full: {
    id: 'x3NCA01xKSc',
    name: 'Why Is Website Automation So Complicated?',
    description:
      'A Flyto2 browser automation walkthrough showing a recorded workflow, an edited step, and replay.',
    duration: 'PT47S',
    durationLabel: '0:47',
    uploadDate: '2026-03-15T22:57:59-07:00',
  },
  short: {
    id: 'dFchXNdpHMI',
    name: 'Copy. Paste. Click. Repeat. Still Doing This by Hand?',
    description:
      'A short Flyto2 demonstration of repetitive form work handled through browser automation.',
    duration: 'PT52S',
    durationLabel: '0:52',
    uploadDate: '2026-03-15T23:59:38-07:00',
  },
} as const;

interface VideoFrameProps {
  videoId: string;
  title: string;
  ratio: 'wide' | 'short';
  badge: string;
  duration: string;
  className?: string;
}

function VideoFrame({ videoId, title, ratio, badge, duration, className }: VideoFrameProps) {
  const [playing, setPlaying] = useState(false);
  const aspect = ratio === 'wide' ? 'aspect-video' : 'aspect-[9/16]';
  // hqdefault is always available; maxresdefault is missing for some uploads
  const thumbBase = 'hqdefault';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-ink-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]',
        aspect,
        className,
      )}
    >
      {playing ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group relative h-full w-full"
          aria-label={`Play ${title}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/${thumbBase}.jpg`}
            alt={title}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/15 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                'grid place-items-center rounded-full bg-bone-100 shadow-[0_20px_60px_-10px_rgba(139,92,246,0.5)] transition-transform duration-300 group-hover:scale-110',
                ratio === 'wide' ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-12 w-12 sm:h-16 sm:w-16',
              )}
            >
              <Play
                className={cn(
                  'ml-1 text-ink-900',
                  ratio === 'wide' ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-5 w-5 sm:h-6 sm:w-6',
                )}
                strokeWidth={1.5}
                fill="currentColor"
              />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-bone-200">
            <span className="font-mono uppercase tracking-[0.16em]">▶ {badge}</span>
            <span className="font-mono uppercase tracking-[0.16em]">{duration}</span>
          </div>
        </button>
      )}
    </motion.div>
  );
}

export function VideoDemo() {
  const t = useTranslations('home.video');
  const videoJsonLd = {
    '@context': 'https://schema.org',
    '@graph': Object.values(VIDEOS).map((video) => ({
      '@type': 'VideoObject',
      '@id': `https://flyto2.com/#youtube-${video.id}`,
      name: video.name,
      description: video.description,
      thumbnailUrl: [`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`],
      uploadDate: video.uploadDate,
      duration: video.duration,
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
      contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
      publisher: { '@id': 'https://flyto2.com/#organization' },
    })),
  };

  return (
    <section
      id="flow-demo-videos"
      aria-labelledby="flow-demo-videos-title"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <header className="mx-auto max-w-2xl text-center">
        <span className="label-mono">{t('label')}</span>
        <h2 id="flow-demo-videos-title" className="h-display mt-4 text-[clamp(36px,6vw,64px)]">
          {t('title')}{' '}
          <span className="bg-gradient-to-br from-violet-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
            {t('titleAccent')}
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-bone-200">
          {t('subtitle')}
        </p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Long-form demo */}
        <div className="lg:col-span-8">
          <div className="mb-3 flex items-baseline">
            <span className="label-mono">{t('longLabel')}</span>
          </div>
          <VideoFrame
            videoId={VIDEOS.full.id}
            title={t('longTitle')}
            ratio="wide"
            badge="DEMO"
            duration={VIDEOS.full.durationLabel}
          />
          <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-bone-200">
            {t('longBody')}
          </p>
        </div>

        {/* 60-second short */}
        <div className="lg:col-span-4">
          <div className="mb-3 flex items-baseline">
            <span className="label-mono">{t('shortLabel')}</span>
          </div>
          <div className="mx-auto max-w-[280px] lg:max-w-none">
            <VideoFrame
              videoId={VIDEOS.short.id}
              title={t('shortTitle')}
              ratio="short"
              badge="QUICK"
              duration={VIDEOS.short.durationLabel}
            />
          </div>
          <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-bone-200">
            {t('shortBody')}
          </p>
        </div>
      </div>

      <p className="mt-10 text-center">
        <a
          href="https://www.youtube.com/@Flyto2"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[13.5px] tracking-wide text-bone-200 transition-colors hover:text-bone-100"
        >
          <span>{t('moreOnYoutube')}</span>
          <span className="font-mono text-[11px] tracking-[0.18em] text-violet-300">→</span>
        </a>
      </p>
    </section>
  );
}
