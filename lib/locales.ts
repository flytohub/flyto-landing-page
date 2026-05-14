export const locales = [
  'en',
  'zh',   // Traditional Chinese
  'cn',   // Simplified Chinese
  'ja',
  'ko',
  'de',
  'es',
  'fr',
  'it',
  'pt',   // Brazilian Portuguese
  'hi',
  'id',
  'pl',
  'th',
  'tr',
  'vi',
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { native: string; english: string; region: string }> = {
  en: { native: 'English',     english: 'English',             region: 'us' },
  zh: { native: '繁體中文',     english: 'Traditional Chinese', region: 'tw' },
  cn: { native: '简体中文',     english: 'Simplified Chinese',  region: 'cn' },
  ja: { native: '日本語',       english: 'Japanese',            region: 'jp' },
  ko: { native: '한국어',        english: 'Korean',              region: 'kr' },
  de: { native: 'Deutsch',     english: 'German',              region: 'de' },
  es: { native: 'Español',     english: 'Spanish',             region: 'es' },
  fr: { native: 'Français',    english: 'French',              region: 'fr' },
  it: { native: 'Italiano',    english: 'Italian',             region: 'it' },
  pt: { native: 'Português',   english: 'Portuguese (Brazil)', region: 'br' },
  hi: { native: 'हिन्दी',         english: 'Hindi',               region: 'in' },
  id: { native: 'Indonesia',   english: 'Indonesian',          region: 'id' },
  pl: { native: 'Polski',      english: 'Polish',              region: 'pl' },
  th: { native: 'ไทย',          english: 'Thai',                region: 'th' },
  tr: { native: 'Türkçe',      english: 'Turkish',             region: 'tr' },
  vi: { native: 'Tiếng Việt',  english: 'Vietnamese',          region: 'vn' },
};

/** Resolve a flag SVG URL for a locale. Flags live at public/flags/{region}.svg. */
export function localeFlagUrl(locale: Locale): string {
  return `/flags/${localeMeta[locale].region}.svg`;
}
