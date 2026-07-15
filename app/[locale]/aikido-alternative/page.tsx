import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PublicRoutePage } from '@/components/sections/PublicRoutePage';
import { pageAlternates } from '@/lib/seo';
import { publicRoutePages } from '@/lib/public-route-pages';

const page = publicRoutePages['aikido-alternative'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: pageAlternates(page.path, locale),
  };
}

export default async function AikidoAlternativePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PublicRoutePage page={page} />;
}
