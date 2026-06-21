/**
 * i18n Configuration for Ramirez Restaurant
 * ==========================================
 * Supported locales: English (en), Hungarian (hu), German (de)
 * Default locale: hu (Hungarian)
 */

export const i18nConfig = {
  defaultLocale: 'hu' as const,
  locales: ['en', 'hu', 'de'] as const,
  localeNames: {
    en: 'English',
    hu: 'Magyar',
    de: 'Deutsch',
  },
  localeFlags: {
    en: '🇬🇧',
    hu: '🇭🇺',
    de: '🇩🇪',
  },
} as const;

export type Locale = (typeof i18nConfig.locales)[number];

/**
 * Load translations for a given locale.
 * In a server component, use this directly.
 * In a client component, use the useTranslations hook.
 */
export async function getTranslations(locale: Locale) {
  try {
    const response = await fetch(`/locales/${locale}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for locale: ${locale}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    // Fallback to default locale
    if (locale !== i18nConfig.defaultLocale) {
      return getTranslations(i18nConfig.defaultLocale);
    }
    throw error;
  }
}

/**
 * Load translations synchronously (for server components).
 * Reads from the public/locales directory.
 */
export function getStaticTranslations(locale: Locale) {
  // This is designed for use in server components via dynamic import
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const translations = require(`../../public/locales/${locale}.json`);
  return translations;
}
