/**
 * Translation Loader
 * Loads and provides access to translation strings
 */

import type { LanguageCode } from './config';

// Import all translation files statically (bundled at build time)
import en from '@/locales/en.json';
import zhTW from '@/locales/zh-TW.json';
import zhCN from '@/locales/zh-CN.json';
import ja from '@/locales/ja.json';
import it from '@/locales/it.json';
import fr from '@/locales/fr.json';
import es from '@/locales/es.json';
import de from '@/locales/de.json';

// Type for nested translation objects
type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

const translations: Record<LanguageCode, Translations> = {
  'en': en as Translations,
  'zh-TW': zhTW as Translations,
  'zh-CN': zhCN as Translations,
  'ja': ja as Translations,
  'it': it as Translations,
  'fr': fr as Translations,
  'es': es as Translations,
  'de': de as Translations,
};

/**
 * Get a translation string by key
 * @param lang - Language code (e.g., 'en', 'zh-TW')
 * @param key - Dot-notation key (e.g., 'nav.home', 'home.heroTitle')
 * @param fallback - Optional fallback string if key not found
 * @returns Translated string or fallback/key if not found
 */
export function getTranslation(
  lang: LanguageCode,
  key: string,
  fallback?: string
): string {
  const keys = key.split('.');

  // Try to get translation from requested language
  let value: TranslationValue | undefined = translations[lang];
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }

  // If found and is a string, return it
  if (typeof value === 'string') {
    return value;
  }

  // Fallback to English
  if (lang !== 'en') {
    let enValue: TranslationValue | undefined = translations['en'];
    for (const k of keys) {
      if (enValue && typeof enValue === 'object' && k in enValue) {
        enValue = enValue[k];
      } else {
        enValue = undefined;
        break;
      }
    }
    if (typeof enValue === 'string') {
      return enValue;
    }
  }

  // Return fallback or key
  return fallback ?? key;
}

/**
 * Get all translations for a specific language
 */
export function getAllTranslations(lang: LanguageCode): Translations {
  return translations[lang] || translations['en'];
}

/**
 * Check if a translation key exists
 */
export function hasTranslation(lang: LanguageCode, key: string): boolean {
  const keys = key.split('.');
  let value: TranslationValue | undefined = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return false;
    }
  }

  return typeof value === 'string';
}
