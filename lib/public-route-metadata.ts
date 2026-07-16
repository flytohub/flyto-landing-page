import type { Metadata } from 'next';
import type { PublicRoutePage } from './public-route-pages';
import { localizedUrl, pageAlternates } from './seo';

const defaultOgImage = '/assets/img/warroom/01-projects-home.webp';

export function publicRouteMetadata(page: PublicRoutePage, locale: string): Metadata {
  const url = localizedUrl(page.path, locale);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: pageAlternates(page.path, locale),
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      siteName: 'Flyto2',
      type: 'website',
      images: [{ url: defaultOgImage, alt: `${page.title} - Flyto2` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: [defaultOgImage],
    },
  };
}
