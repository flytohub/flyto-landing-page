import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/locales';
import { isEnglishOnlyRoute, normalizeLocalizationRoute } from './lib/route-localization';

const localePattern = new RegExp(`^/(${locales.join('|')})(/|$)`);
const defaultLocalePattern = new RegExp(`^/${defaultLocale}(/|$)`);
const internalLocaleRewriteHeader = 'x-flyto-internal-locale-rewrite';
const legacyHtmlRedirects: Record<string, string> = {
  about: '/',
  app: '/cloud/download/',
  contact: '/',
  dashboard: '/code/',
  download: '/cloud/download/',
  features: '/cloud/',
  pricing: '/cloud/pricing/',
  security: '/code/security/',
};

function cleanLegacyHtmlPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return null;

  const possibleLocale = segments[0];
  const hasLocale = locales.includes(possibleLocale as (typeof locales)[number]);
  const locale = hasLocale ? possibleLocale : null;
  const legacySegments = hasLocale ? segments.slice(1) : segments;

  if (legacySegments.length !== 1) return null;

  const [fileName] = legacySegments;
  const slug = fileName === 'index.html'
    ? 'index'
    : fileName.endsWith('.html')
      ? fileName.slice(0, -'.html'.length)
      : null;
  if (!slug) return null;

  const targetPath = slug === 'index' ? '/' : legacyHtmlRedirects[slug];
  if (!targetPath) return null;

  if (!locale || locale === defaultLocale) return targetPath;
  return targetPath === '/' ? `/${locale}/` : `/${locale}${targetPath}`;
}

function applyDefaultLocaleCanonical(pathname: string) {
  if (defaultLocalePattern.test(pathname)) {
    return pathname.replace(`/${defaultLocale}`, '') || '/';
  }
  return pathname;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch?.[1] ?? defaultLocale;
  const headers = new Headers(request.headers);
  headers.set('X-NEXT-INTL-LOCALE', locale);

  const cleanPathname = cleanLegacyHtmlPath(pathname);
  if (cleanPathname) {
    const url = request.nextUrl.clone();
    url.pathname = applyDefaultLocaleCanonical(cleanPathname);
    return NextResponse.redirect(url, 308);
  }

  if (localeMatch && locale !== defaultLocale) {
    const route = normalizeLocalizationRoute(pathname.slice(`/${locale}`.length));
    if (isEnglishOnlyRoute(route)) {
      const url = request.nextUrl.clone();
      url.pathname = route ? `/${route}/` : '/';
      return NextResponse.redirect(url, 308);
    }
  }

  if (request.headers.get(internalLocaleRewriteHeader) === '1') {
    return NextResponse.next({ request: { headers } });
  }

  if (defaultLocalePattern.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(`/${defaultLocale}`, '') || '/';
    return NextResponse.redirect(url);
  }

  if (!localeMatch) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${defaultLocale}/` : `/${defaultLocale}${pathname}`;
    headers.set(internalLocaleRewriteHeader, '1');
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    '/((?!api(?:/|$)|_next|_vercel|assets).+\\.html)',
    '/((?!api(?:/|$)|_next|_vercel|assets|.*\\..*).*)',
  ],
};
