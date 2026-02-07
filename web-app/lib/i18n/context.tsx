'use client';

/**
 * Language Context Provider
 * Manages language state and provides translation function
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  type LanguageCode,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_COOKIE_NAME,
  SCOPE_LANGUAGES,
} from './config';
import { getTranslation } from './translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  isValidLanguage: (lang: string) => lang is LanguageCode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode;
  allowedLanguages?: LanguageCode[];
}

export function LanguageProvider({
  children,
  initialLanguage,
  allowedLanguages,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(
    initialLanguage || DEFAULT_LANGUAGE
  );
  const [mounted, setMounted] = useState(false);

  // Determine which languages are allowed in this scope
  const allowed = allowedLanguages || SCOPE_LANGUAGES.public;

  // Check if a language code is valid
  const isValidLanguage = useCallback(
    (lang: string): lang is LanguageCode => {
      return lang in LANGUAGES && allowed.includes(lang as LanguageCode);
    },
    [allowed]
  );

  // Load language preference from localStorage on mount
  useEffect(() => {
    setMounted(true);

    let detectedLang: LanguageCode = DEFAULT_LANGUAGE;

    // First, try localStorage
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isValidLanguage(stored)) {
      detectedLang = stored;
    } else {
      // Then, try to detect from browser
      const browserLang = navigator.language.split('-')[0];
      const browserFullLang = navigator.language;

      // Check for exact match (e.g., zh-TW)
      if (isValidLanguage(browserFullLang)) {
        detectedLang = browserFullLang;
      } else {
        // Check for language code match (e.g., zh -> zh-TW)
        for (const code of allowed) {
          if (code.startsWith(browserLang)) {
            detectedLang = code;
            break;
          }
        }
      }
    }

    setLanguageState(detectedLang);

    // Set the HTML lang attribute for CSS targeting
    document.documentElement.lang = LANGUAGES[detectedLang].htmlLang;
  }, [allowed, isValidLanguage]);

  // Set language and persist to storage
  const setLanguage = useCallback(
    (lang: LanguageCode) => {
      if (!isValidLanguage(lang)) {
        console.warn(`Language ${lang} is not allowed in current scope`);
        return;
      }

      setLanguageState(lang);

      // Persist to localStorage
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

      // Set cookie for SSR (1 year expiry)
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=31536000; SameSite=Lax`;

      // Update document lang attribute
      document.documentElement.lang = LANGUAGES[lang].htmlLang;
    },
    [isValidLanguage]
  );

  // Translation function
  const t = useCallback(
    (key: string, fallback?: string): string => {
      return getTranslation(language, key, fallback);
    },
    [language]
  );

  // Avoid hydration mismatch by not rendering until mounted
  // This ensures server and client render the same initial language
  const contextValue: LanguageContextType = {
    language: mounted ? language : (initialLanguage || DEFAULT_LANGUAGE),
    setLanguage,
    t,
    isValidLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Hook to get the translation function only
 */
export function useTranslation(): (key: string, fallback?: string) => string {
  const { t } = useLanguage();
  return t;
}
