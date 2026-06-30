import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/locales';

const localePattern = new RegExp(`^/(${locales.join('|')})(/|$)`);
const defaultLocalePattern = new RegExp(`^/${defaultLocale}(/|$)`);
const internalLocaleRewriteHeader = 'x-flyto-internal-locale-rewrite';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch?.[1] ?? defaultLocale;
  const headers = new Headers(request.headers);
  headers.set('X-NEXT-INTL-LOCALE', locale);

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
  matcher: ['/((?!api(?:/|$)|_next|_vercel|assets|.*\\..*).*)'],
};
