'use client';

import { useState } from 'react';
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

type WaitlistStatus = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

interface CTASectionProps {
  namespace?: string;
  id?: string;
  primaryHref?: string;
  secondaryHref?: string;
  primaryIcon?: keyof typeof ICONS;
  secondaryIcon?: keyof typeof ICONS;
  waitlistMode?: boolean;
  waitlistProduct?: string;
}

async function submitWaitlist(email: string, product: string): Promise<WaitlistStatus> {
  const { isFirebaseConfigured, firestore } = await import('@/lib/firebase');
  if (!isFirebaseConfigured()) return 'error';
  const { collection, addDoc, query, where, getDocs, serverTimestamp } = await import('firebase/firestore');
  const db = firestore();
  const ref = collection(db, 'waitlist');
  const snap = await getDocs(query(ref, where('email', '==', email), where('product', '==', product)));
  if (!snap.empty) return 'duplicate';
  await addDoc(ref, { email, product, createdAt: serverTimestamp() });
  return 'success';
}

export function CTASection({
  namespace = 'home.cta',
  id,
  primaryHref = '/cloud/download',
  secondaryHref = 'https://docs.flyto2.com',
  primaryIcon = 'Download',
  secondaryIcon = 'BookOpen',
  waitlistMode = false,
  waitlistProduct = 'code',
}: CTASectionProps = {}) {
  const t = useTranslations(namespace);
  const PrimaryIcon = ICONS[primaryIcon];
  const SecondaryIcon = ICONS[secondaryIcon];

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<WaitlistStatus>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading' || status === 'success') return;
    setStatus('loading');
    try {
      const result = await submitWaitlist(email.trim().toLowerCase(), waitlistProduct);
      setStatus(result);
    } catch {
      setStatus('error');
    }
  }

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

          {waitlistMode ? (
            <div className="mt-10 flex flex-col items-center gap-4">
              {status === 'success' ? (
                <p className="text-[15px] font-medium text-emerald-400">{t('success')}</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    disabled={status === 'loading'}
                    className="flex-1 rounded-lg border border-[var(--color-line-strong)] bg-ink-800 px-4 py-2.5 text-[14px] text-bone-100 placeholder:text-bone-400 focus:border-violet-400/60 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="rounded-lg bg-violet-600 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                  >
                    {status === 'loading' ? '…' : t('primary')}
                  </button>
                </form>
              )}
              {(status === 'duplicate' || status === 'error') && (
                <p className="text-[13px] text-bone-300">
                  {status === 'duplicate' ? t('duplicate') : t('error')}
                </p>
              )}
              <Button href={secondaryHref} variant="secondary">
                {SecondaryIcon && <SecondaryIcon className="h-4 w-4" strokeWidth={1.75} />}
                <span>{t('secondary')}</span>
              </Button>
            </div>
          ) : (
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
          )}
        </motion.div>
      </div>
    </section>
  );
}
