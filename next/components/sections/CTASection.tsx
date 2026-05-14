'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Download, BookOpen, Mail, Code as CodeIcon, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ICONS: Record<string, LucideIcon> = {
  Download,
  BookOpen,
  Mail,
  CodeIcon,
};

interface CTASectionProps {
  namespace?: string;
  id?: string;
  primaryHref?: string;
  secondaryHref?: string;
  primaryIcon?: keyof typeof ICONS;
  secondaryIcon?: keyof typeof ICONS;
}

export function CTASection({
  namespace = 'home.cta',
  id,
  primaryHref = '/cloud/download',
  secondaryHref = 'https://docs.flyto2.com',
  primaryIcon = 'Download',
  secondaryIcon = 'BookOpen',
}: CTASectionProps = {}) {
  const t = useTranslations(namespace);
  const PrimaryIcon = ICONS[primaryIcon];
  const SecondaryIcon = ICONS[secondaryIcon];

  return (
    <section id={id} className="relative isolate overflow-hidden">
      <div className="glow-radial" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-5 py-28 text-center sm:px-8 sm:py-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="label-mono">{t('label')}</span>
          <h2 className="h-display mt-5 text-[clamp(40px,8vw,96px)]">{t('title')}</h2>
          <p className="mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-bone-200">
            {t('body')}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={primaryHref}>
              {PrimaryIcon && <PrimaryIcon className="h-4 w-4" strokeWidth={1.75} />}
              <span>{t('primary')}</span>
            </Button>
            <Button href={secondaryHref} variant="secondary">
              {SecondaryIcon && <SecondaryIcon className="h-4 w-4" strokeWidth={1.75} />}
              <span>{t('secondary')}</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
