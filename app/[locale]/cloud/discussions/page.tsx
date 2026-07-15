import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { DiscussionsClient } from '@/components/forum/DiscussionsClient';
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
    robots: { index: false, follow: true },
  };
}

export default async function CloudDiscussionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DiscussionsClient product="cloud" />;
}
