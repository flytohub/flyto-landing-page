export const locales = ['en', 'zh', 'ja'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { native: string; english: string; flag: string }> = {
  en: { native: 'English',   english: 'English',             flag: '🇺🇸' },
  zh: { native: '繁體中文',  english: 'Traditional Chinese', flag: '🇹🇼' },
  ja: { native: '日本語',    english: 'Japanese',            flag: '🇯🇵' },
};
