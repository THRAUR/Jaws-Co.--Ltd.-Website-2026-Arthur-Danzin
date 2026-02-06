/**
 * i18n Configuration
 * Language definitions and constants
 */

export type LanguageCode = 'en' | 'zh-TW' | 'zh-CN' | 'ja' | 'it' | 'fr' | 'es' | 'de';

export interface LanguageConfig {
  code: LanguageCode;
  label: string;      // Short label for switcher (e.g., "Eng", "繁中")
  name: string;       // Full language name
  deepLCode: string;  // DeepL API language code
  htmlLang: string;   // HTML lang attribute value
}

export const LANGUAGES: Record<LanguageCode, LanguageConfig> = {
  'en': {
    code: 'en',
    label: 'Eng',
    name: 'English',
    deepLCode: 'EN',
    htmlLang: 'en',
  },
  'zh-TW': {
    code: 'zh-TW',
    label: '繁中',
    name: '繁體中文',
    deepLCode: 'ZH',
    htmlLang: 'zh-TW',
  },
  'zh-CN': {
    code: 'zh-CN',
    label: '简中',
    name: '简体中文',
    deepLCode: 'ZH',
    htmlLang: 'zh-CN',
  },
  'ja': {
    code: 'ja',
    label: '日本語',
    name: '日本語',
    deepLCode: 'JA',
    htmlLang: 'ja',
  },
  'it': {
    code: 'it',
    label: 'IT',
    name: 'Italiano',
    deepLCode: 'IT',
    htmlLang: 'it',
  },
  'fr': {
    code: 'fr',
    label: 'FR',
    name: 'Français',
    deepLCode: 'FR',
    htmlLang: 'fr',
  },
  'es': {
    code: 'es',
    label: 'ES',
    name: 'Español',
    deepLCode: 'ES',
    htmlLang: 'es',
  },
  'de': {
    code: 'de',
    label: 'DE',
    name: 'Deutsch',
    deepLCode: 'DE',
    htmlLang: 'de',
  },
};

// Ordered array of language codes (for display in switcher)
export const LANGUAGE_ORDER: LanguageCode[] = [
  'en', 'zh-TW', 'zh-CN', 'ja', 'it', 'fr', 'es', 'de'
];

// Scope-specific language restrictions
export const SCOPE_LANGUAGES: Record<string, LanguageCode[]> = {
  public: ['en', 'zh-TW', 'zh-CN', 'ja', 'it', 'fr', 'es', 'de'],
  dashboard: ['en', 'zh-TW', 'zh-CN', 'ja', 'it', 'fr', 'es', 'de'],
  admin: ['en', 'zh-TW'],
};

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

// Storage keys
export const LANGUAGE_STORAGE_KEY = 'jaws-language';
export const LANGUAGE_COOKIE_NAME = 'jaws-language';
