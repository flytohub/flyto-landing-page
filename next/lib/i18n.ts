import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { AbstractIntlMessages } from 'next-intl';
import { locales, defaultLocale, type Locale } from './locales';

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Deep-merge a localized message object on top of the English fallback so
 * any key missing from a translation silently falls through to en.
 * Arrays are replaced wholesale (not concatenated).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(base: any, over: any): any {
  if (!isPlainObject(base) || !isPlainObject(over)) return over;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (v === undefined) continue;
    if (isPlainObject(v) && isPlainObject(base[k])) {
      out[k] = deepMerge(base[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = (await requestLocale) ?? defaultLocale;
  if (!locales.includes(requested as Locale)) notFound();

  // next-intl's static types reject JSON arrays in messages even though the
  // runtime accepts them — cast through `unknown` to keep this loader honest
  // without fighting the type system at every call site.
  const en = (await import(`../messages/en.json`)).default as unknown as Record<string, unknown>;

  let messages: Record<string, unknown> = en;
  if (requested !== defaultLocale) {
    try {
      const localized = (await import(`../messages/${requested}.json`))
        .default as unknown as Record<string, unknown>;
      messages = deepMerge(en, localized);
    } catch {
      // Locale file doesn't exist yet — fall back to English silently.
      messages = en;
    }
  }

  return {
    locale: requested,
    messages: messages as AbstractIntlMessages,
    // If a single key is still missing after the merge, return the key path
    // instead of throwing. Console-warns so the gap is visible in dev.
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        console.warn('[i18n]', error.message);
      } else {
        console.error('[i18n]', error);
      }
    },
    getMessageFallback({ key, namespace }) {
      return [namespace, key].filter(Boolean).join('.');
    },
  };
});
