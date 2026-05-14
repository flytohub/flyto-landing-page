import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { FAQ } from '@/components/sections/FAQ';
import { CTASection } from '@/components/sections/CTASection';
import { cn } from '@/lib/cn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PricingHero />
      <PlanGrid />
      <FAQ namespace="pricing.faq" />
      <CTASection namespace="pricing.cta" />
    </>
  );
}

function PricingHero() {
  const t = useTranslations('pricing.hero');
  return (
    <section className="relative isolate overflow-hidden">
      <div className="glow-radial" aria-hidden />
      <div className="grid-faint" aria-hidden />
      <div className="halo" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-12 text-center sm:px-8 sm:pb-20 sm:pt-16">
        <Tag>{t('eyebrow')}</Tag>
        <h1 className="h-display mx-auto mt-7 max-w-4xl text-[clamp(44px,8vw,108px)]">
          {t('title')}{' '}
          <span className="aurora-text">{t('titleAccent')}</span>
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-[16px] leading-relaxed text-bone-200">
          {t('lede')}
        </p>
      </div>
    </section>
  );
}

interface Plan {
  id: 'free' | 'pro' | 'team';
  popular?: boolean;
  priceMo: string;
  priceLabel?: string;
  ctaHref: string;
  features: string[];
}

const PLANS: Plan[] = [
  { id: 'free', priceMo: '0',  ctaHref: '/cloud/download', features: ['feature1', 'feature2', 'feature3', 'feature4'] },
  { id: 'pro',  priceMo: '9',  ctaHref: '/cloud/download', popular: true, features: ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'] },
  { id: 'team', priceMo: '19', ctaHref: '/cloud/download', features: ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'] },
];

function PlanGrid() {
  const t = useTranslations('pricing');
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} t={t} />
        ))}
      </div>

      <p className="mt-10 text-center font-mono text-[11px] tracking-[0.16em] uppercase text-bone-300">
        {t('priceFootnote')}
      </p>
    </section>
  );
}

function PlanCard({ plan, t }: { plan: Plan; t: ReturnType<typeof useTranslations> }) {
  const ns = `plans.${plan.id}`;
  return (
    <div
      className={cn(
        'lift relative flex flex-col gap-6 overflow-hidden rounded-3xl border p-7 sm:p-8',
        plan.popular
          ? 'grad-border border-transparent bg-gradient-to-b from-violet-500/[0.12] via-ink-700/40 to-ink-800/40'
          : 'border-[var(--color-line)] bg-gradient-to-b from-ink-700/30 to-ink-800/20',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="label-mono">{t(`${ns}.label`)}</span>
        {plan.popular && <Tag variant="live">{t('mostPopular')}</Tag>}
      </div>

      <div>
        <h3 className="font-display text-3xl font-semibold tracking-tight">{t(`${ns}.name`)}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-bone-200">{t(`${ns}.tagline`)}</p>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[16px] text-bone-300">$</span>
        <span className="num-mono h-display text-6xl font-semibold tracking-tight text-bone-100">
          {plan.priceMo}
        </span>
        <span className="ml-1 text-[13px] text-bone-300">{t('perMonth')}</span>
      </div>

      <ul className="space-y-2.5 border-t border-[var(--color-line)] pt-5">
        {plan.features.map((k) => (
          <li key={k} className="flex items-start gap-2.5 text-[13.5px] text-bone-100/85">
            <Check
              className={cn('mt-0.5 h-4 w-4 flex-shrink-0', plan.popular ? 'text-violet-300' : 'text-cyan-400')}
              strokeWidth={2}
            />
            <span>{t(`${ns}.${k}`)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <Button
          href={plan.ctaHref}
          variant={plan.popular ? 'primary' : 'secondary'}
          className="w-full justify-center"
        >
          <span>{t(`${ns}.cta`)}</span>
        </Button>
      </div>
    </div>
  );
}
