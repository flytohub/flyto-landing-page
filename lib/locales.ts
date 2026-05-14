export const locales = ['en', 'zh', 'ja'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { native: string; english: string; region: string }> = {
  en: { native: 'English',   english: 'English',             region: 'us' },
  zh: { native: '繁體中文',  english: 'Traditional Chinese', region: 'tw' },
  ja: { native: '日本語',    english: 'Japanese',            region: 'jp' },
};

/** Resolve a flag SVG URL for a locale. Flags live at public/flags/{region}.svg. */
export function localeFlagUrl(locale: Locale): string {
  return `/flags/${localeMeta[locale].region}.svg`;
}
