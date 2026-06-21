'use client';

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { i18nConfig, type Locale } from './i18n';
import huTranslations from '../../public/locales/hu.json';

// ── Types ─────────────────────────────────────────────────────────────────────

interface MenuItem {
  name: string;
  price: string;
}

interface MenuCategory {
  name: string;
  slug: string;
  items: MenuItem[];
}

interface Translations {
  meta: {
    locale: string;
    restaurantName: string;
    currency: string;
    lastUpdated: string;
  };
  nav: {
    home: string;
    menu: string;
    about: string;
    contact: string;
    reservation: string;
  };
  menu: {
    pageTitle: string;
    originalMenusTitle?: string;
    disclaimer?: string;
    categories: MenuCategory[];
  };
  hero?: {
    headline: string;
    subtitle: string;
    viewMenu: string;
    bookTable: string;
  };
}

interface I18nContextType {
  locale: Locale;
  translations: Translations | null;
  isLoading: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

// ── Context ───────────────────────────────────────────────────────────────────

const I18nContext = createContext<I18nContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || i18nConfig.defaultLocale
  );
  
  // Preload Hungarian to prevent English fallback on initial load
  const [translations, setTranslations] = useState<Translations | null>(
    (initialLocale || i18nConfig.defaultLocale) === 'hu' ? huTranslations as Translations : null
  );
  const [isLoading, setIsLoading] = useState(
    (initialLocale || i18nConfig.defaultLocale) !== 'hu'
  );

  // Load translations when locale changes
  useEffect(() => {
    setIsLoading(true);
    fetch(`/locales/${locale}.json`)
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data);
        setIsLoading(false);
        // Persist locale preference
        if (typeof window !== 'undefined') {
          localStorage.setItem('ramirez-locale', locale);
          document.documentElement.lang = locale;
        }
      })
      .catch((err) => {
        console.error('Failed to load translations:', err);
        setIsLoading(false);
      });
  }, [locale]);

  // Initialize locale from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('ramirez-locale') as Locale | null;
      if (savedLocale && i18nConfig.locales.includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (i18nConfig.locales.includes(newLocale)) {
      setLocaleState(newLocale);
    }
  }, []);

  /**
   * Simple dot-notation translation accessor.
   * Example: t('nav.menu') → "Menu"
   */
  const t = useCallback(
    (key: string): string => {
      if (!translations) return key;
      const keys = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any = translations;
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return key; // Key not found, return the key itself
        }
      }
      return typeof result === 'string' ? result : key;
    },
    [translations]
  );

  return (
    <I18nContext.Provider value={{ locale, translations, isLoading, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTranslations() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslations must be used within an I18nProvider');
  }
  return context;
}
