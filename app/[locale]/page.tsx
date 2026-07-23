import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { ProductPicker } from '@/components/sections/ProductPicker';
import { CoreBenefits } from '@/components/sections/CoreBenefits';
import { HomeFeatures } from '@/components/sections/HomeFeatures';
import { Stats } from '@/components/sections/Stats';
import { Integrations } from '@/components/sections/Integrations';
import { FAQ } from '@/components/sections/FAQ';
import { CTASection } from '@/components/sections/CTASection';
import {
  FLYTO2_HOME_DESCRIPTION,
  FLYTO2_HOME_FULL_TITLE,
  FLYTO2_HOME_TITLE,
  FLYTO2_SEO_FACTS,
  pageAlternates,
} from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: FLYTO2_HOME_TITLE,
    description: FLYTO2_HOME_DESCRIPTION,
    alternates: pageAlternates('', locale),
    openGraph: {
      title: FLYTO2_HOME_FULL_TITLE,
      description: FLYTO2_HOME_DESCRIPTION,
      url: '/',
      siteName: 'Flyto2',
      type: 'website',
      images: [
        {
          url: '/assets/img/warroom/01-projects-home.webp',
          width: 1200,
          height: 630,
          alt: 'Flyto2 evidence-backed product verification warroom',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: FLYTO2_HOME_FULL_TITLE,
      description: FLYTO2_HOME_DESCRIPTION,
      images: ['/assets/img/warroom/01-projects-home.webp'],
    },
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
        sameAs: [
          'https://docs.flyto2.com',
          'https://blog.flyto2.com',
          'https://github.com/flytohub',
          'https://www.youtube.com/@Flyto2',
        ],
        contactPoint: [
          { '@type': 'ContactPoint', contactType: 'sales', email: 'sales@flyto2.com' },
          { '@type': 'ContactPoint', contactType: 'customer support', email: 'support@flyto2.com' },
          { '@type': 'ContactPoint', contactType: 'security', email: 'security@flyto2.com' },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://flyto2.com/#website',
        name: 'Flyto2',
        url: 'https://flyto2.com',
        publisher: { '@id': 'https://flyto2.com/#organization' },
        about: [
          'Flyto2 Flow',
          'AI workflow automation',
          'visual MCP builder',
          'self-hosted browser automation',
          'Flyto2 Warroom',
          'security validation platform',
          'CTEM platform',
          'Continuous Threat Exposure Management',
          'continuous threat exposure management ctem framework',
          'attack surface management',
          'attack surface management software',
          'attack surface management tools',
          'attack surface management vs vulnerability management',
          'external attack surface management platform',
          'source-available attack surface management',
          'dark web monitoring',
          'security automation platform',
          'MCP security',
          'pentest validation',
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://flyto2.com/#software',
        name: 'Flyto2',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'AI automation and continuous security operations',
        operatingSystem: 'Web',
        url: 'https://flyto2.com',
        description:
          `Flyto2 provides two source-available product lines: Flow for visual AI workflow and MCP automation, and Warroom for CTEM and security validation operations. The open-source flyto-core runtime provides ${FLYTO2_SEO_FACTS.coreRuntimeSummary}.`,
        featureList: [
          'Flyto2 Flow visual workflow and MCP builder',
          'Source-available self-hosted browser automation',
          'Open-source flyto-core runtime with deterministic modules',
          'MCP tools for compatible AI clients',
          'Evidence and replay for automation runs',
          'Flyto2 Warroom CTEM platform',
          'Security validation with evidence and remediation context',
          'Attack surface and EASM correlation',
          'Attack surface management tools and software intake',
          'External attack surface management platform context',
          'Source-available attack surface operations through Warroom CE',
          'Security automation platform workflows',
          'Dark web and threat intelligence correlation',
          'Code intelligence and MCP security context',
          'Pentest validation and red-team simulation',
          `${FLYTO2_SEO_FACTS.moduleCount} registry-backed modules`,
          `${FLYTO2_SEO_FACTS.builtInRecipeCount} built-in recipes`,
        ],
        publisher: { '@id': 'https://flyto2.com/#organization' },
      },
    ],
  };

  return (
    <>
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
        primaryHref="/flow"
        secondaryHref="/warroom"
        primaryIcon="CodeIcon"
        secondaryIcon="BookOpen"
      />
    </>
  );
}
