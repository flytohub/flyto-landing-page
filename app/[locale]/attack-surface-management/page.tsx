import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SecurityProductPage } from '@/components/sections/SecurityProductPage';
import { pageAlternates } from '@/lib/seo';
import { securityPages } from '@/lib/security-pages';

const page = securityPages['attack-surface-management'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: pageAlternates(page.slug, locale),
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://flyto2.com/${page.slug}/`,
      type: 'website',
      images: [{ url: page.image }],
    },
  };
}

export default async function AttackSurfaceManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SecurityProductPage page={page} />;
}
