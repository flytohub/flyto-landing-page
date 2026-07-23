import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ProductIntentPage } from '@/components/sections/ProductIntentPage';
import { productIntentMetadata } from '@/lib/public-route-metadata';
import {
  productIntentPage,
  productIntentParams,
} from '@/lib/product-intent-pages';

export const dynamicParams = false;

export function generateStaticParams() {
  return productIntentParams('warroom');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  const page = productIntentPage('warroom', slug);
  if (!page) return {};
  return productIntentMetadata(page, locale);
}

export default async function WarroomProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug = [] } = await params;
  setRequestLocale(locale);
  const page = productIntentPage('warroom', slug);
  if (!page) notFound();
  return <ProductIntentPage page={page} />;
}
