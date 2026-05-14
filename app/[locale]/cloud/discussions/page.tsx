import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { DiscussionsView } from '@/components/forum/DiscussionsView';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'forum' });
  return {
    title: t('titleCloud'),
    description: t('subtitleCloud'),
    alternates: pageAlternates('cloud/discussions', locale),
  };
}

export default async function CloudDiscussionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <DiscussionsView product="cloud" />
    </Suspense>
  );
}
