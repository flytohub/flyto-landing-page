import type { Metadata } from 'next';
import type { PublicRoutePage } from './public-route-pages';
import { OG_LOCALE_BY_LOCALE, localizedUrl, pageAlternates } from './seo';
import { defaultLocale, type Locale } from './locales';

const defaultOgImage = '/assets/img/warroom/01-projects-home.webp';

export function publicRouteMetadata(page: PublicRoutePage, locale: string): Metadata {
  const url = localizedUrl(page.path, locale);
  const supportedLocale = (locale in OG_LOCALE_BY_LOCALE ? locale : defaultLocale) as Locale;

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
      locale: OG_LOCALE_BY_LOCALE[supportedLocale],
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
