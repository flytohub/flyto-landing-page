import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/locales';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|assets|.*\\..*).*)'],
};
