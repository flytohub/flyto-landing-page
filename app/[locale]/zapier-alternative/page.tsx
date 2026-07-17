import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PublicRoutePage } from '@/components/sections/PublicRoutePage';
import { publicRouteMetadata } from '@/lib/public-route-metadata';
import { publicRoutePages } from '@/lib/public-route-pages';

const page = publicRoutePages['zapier-alternative'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return publicRouteMetadata(page, locale);
}

export default async function ZapierAlternativePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PublicRoutePage page={page} />;
}
