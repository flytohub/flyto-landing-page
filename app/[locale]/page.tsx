import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { ProductPicker } from '@/components/sections/ProductPicker';
import { CoreBenefits } from '@/components/sections/CoreBenefits';
import { HomeFeatures } from '@/components/sections/HomeFeatures';
import { Stats } from '@/components/sections/Stats';
import { Integrations } from '@/components/sections/Integrations';
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
    alternates: pageAlternates('', locale),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://flyto2.com/#organization',
        name: 'Flyto2',
        url: 'https://flyto2.com',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://flyto2.com/#website',
        name: 'Flyto2',
        url: 'https://flyto2.com',
        publisher: { '@id': 'https://flyto2.com/#organization' },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://flyto2.com/#software',
        name: 'Flyto2',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Web',
        url: 'https://flyto2.com',
        description:
          'Flyto2 is a security war room that integrates existing ASM, dark web, code security, pentest, and red-team signals into one evidence-backed CTEM workflow.',
        publisher: { '@id': 'https://flyto2.com/#organization' },
      },
    ],
  };

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/assets/img/warroom/01-projects-home.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Hero />
      <ProductPicker />
      <CoreBenefits />
      <HomeFeatures />
      <Stats />
      <Integrations />
      <FAQ namespace="home.faq" />
      <CTASection
        primaryHref="/ctem"
        secondaryHref="/mssp-platform"
        primaryIcon="BookOpen"
        secondaryIcon="CodeIcon"
      />
    </>
  );
}
