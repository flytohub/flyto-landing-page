import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/locales';
import { isEnglishOnlyRoute, normalizeLocalizationRoute } from './lib/route-localization';

const localePattern = new RegExp(`^/(${locales.join('|')})(/|$)`);
const defaultLocalePattern = new RegExp(`^/${defaultLocale}(/|$)`);
const internalLocaleRewriteHeader = 'x-flyto-internal-locale-rewrite';
const openAiAppsChallengePath = '/.well-known/openai-apps-challenge';
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

// Three topics shipped at two URLs each, and every one of the six canonicalised
// to itself, so the site competed with itself for its own keywords. Search
// Console over 90 days (2026-06-04 to 2026-09-03) settled which URL survives —
// impressions and average position, not tidiness:
//
//   /ctem/                              0 clicks   100 impressions  pos 62.2
//   /warroom/ctem/                      0 clicks   400 impressions  pos 52.2  <-
//   /attack-surface-management/         0 clicks   460 impressions  pos 46.4
//   /warroom/attack-surface-management/ 0 clicks   620 impressions  pos 41.4  <-
//   /n8n-alternative/                   0 clicks   290 impressions  pos 47.4  <-
//   /flow/n8n-alternative/              0 clicks    10 impressions  pos 43.0
//
// The first two go to the nested page, which the internal links already
// favoured (174 vs 80 and 95 vs 32). The third goes the OTHER way: the
// top-level page has 29x the impressions despite zero internal links, so the
// structurally tidy answer would have thrown away the only version Google is
// actually showing. Every one of the six has zero clicks, so no ranking traffic
// is at risk in either direction.
const canonicalTopicRedirects: Record<string, string> = {
  '/ctem/': '/warroom/ctem/',
  '/attack-surface-management/': '/warroom/attack-surface-management/',
  '/flow/n8n-alternative/': '/n8n-alternative/',
};

/** Resolve a duplicate topic URL to its canonical home, preserving the locale
 *  prefix so /de/ctem/ lands on /de/warroom/ctem/ rather than the English page. */
function canonicalTopicPath(pathname: string) {
  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch?.[1] ?? null;
  const bare = locale ? pathname.slice(`/${locale}`.length) || '/' : pathname;
  const target = canonicalTopicRedirects[bare];
  if (!target) return null;
  return locale && locale !== defaultLocale ? `/${locale}${target}` : target;
}

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

  if (pathname === openAiAppsChallengePath) {
    return NextResponse.next();
  }
  if (pathname === `${openAiAppsChallengePath}/`) {
    const url = new URL(request.url);
    url.pathname = openAiAppsChallengePath;
    return NextResponse.redirect(url, 308);
  }

  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch?.[1] ?? defaultLocale;
  const headers = new Headers(request.headers);
  headers.set('X-NEXT-INTL-LOCALE', locale);

  const canonicalTopic = canonicalTopicPath(pathname.endsWith('/') ? pathname : `${pathname}/`);
  if (canonicalTopic) {
    const url = request.nextUrl.clone();
    url.pathname = canonicalTopic;
    return NextResponse.redirect(url, 308);
  }

  const cleanPathname = cleanLegacyHtmlPath(pathname);
  if (cleanPathname) {
    const url = request.nextUrl.clone();
    url.pathname = applyDefaultLocaleCanonical(cleanPathname);
    return NextResponse.redirect(url, 308);
  }

  if (pathname !== '/' && !pathname.endsWith('/')) {
    const url = new URL(request.url);
    url.pathname = `${pathname}/`;
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
    '/.well-known/openai-apps-challenge/:path*',
    '/((?!api(?:/|$)|_next|_vercel|assets).+\\.html)',
    '/((?!api(?:/|$)|_next|_vercel|assets|.*\\..*).*)',
  ],
};
