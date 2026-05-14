export const locales = [
  'en',
  'zh',
  'cn',
  'ja',
  'ko',
  'de',
  'es',
  'fr',
  'it',
  'pt',
  'vi',
  'th',
  'id',
  'tr',
  'pl',
  'hi',
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { native: string; english: string; flag: string }> = {
  en: { native: 'English',     english: 'English',             flag: '🇺🇸' },
  zh: { native: '繁體中文',    english: 'Traditional Chinese', flag: '🇹🇼' },
  cn: { native: '简体中文',    english: 'Simplified Chinese',  flag: '🇨🇳' },
  ja: { native: '日本語',      english: 'Japanese',            flag: '🇯🇵' },
  ko: { native: '한국어',       english: 'Korean',              flag: '🇰🇷' },
  de: { native: 'Deutsch',     english: 'German',              flag: '🇩🇪' },
  es: { native: 'Español',     english: 'Spanish',             flag: '🇪🇸' },
  fr: { native: 'Français',    english: 'French',              flag: '🇫🇷' },
  it: { native: 'Italiano',    english: 'Italian',             flag: '🇮🇹' },
  pt: { native: 'Português',   english: 'Portuguese',          flag: '🇧🇷' },
  vi: { native: 'Tiếng Việt',  english: 'Vietnamese',          flag: '🇻🇳' },
  th: { native: 'ไทย',          english: 'Thai',                flag: '🇹🇭' },
  id: { native: 'Indonesia',   english: 'Indonesian',          flag: '🇮🇩' },
  tr: { native: 'Türkçe',      english: 'Turkish',             flag: '🇹🇷' },
  pl: { native: 'Polski',      english: 'Polish',              flag: '🇵🇱' },
  hi: { native: 'हिन्दी',         english: 'Hindi',               flag: '🇮🇳' },
};
