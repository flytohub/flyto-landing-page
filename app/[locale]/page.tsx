import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { ProductPicker } from '@/components/sections/ProductPicker';
import { CoreBenefits } from '@/components/sections/CoreBenefits';
import { FAQ } from '@/components/sections/FAQ';
import { CTASection } from '@/components/sections/CTASection';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: pageAlternates(''),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ProductPicker />
      <CoreBenefits />
      <FAQ namespace="home.faq" />
      <CTASection
        primaryHref="/cloud"
        secondaryHref="/code"
        primaryIcon="Download"
        secondaryIcon="CodeIcon"
      />
    </>
  );
}
