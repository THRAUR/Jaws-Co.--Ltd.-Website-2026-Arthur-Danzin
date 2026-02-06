'use client';

/**
 * Language Switcher Component
 * TSMC-style horizontal language selector
 */

import { useLanguage } from '@/lib/i18n/context';
import {
  LANGUAGES,
  SCOPE_LANGUAGES,
  LANGUAGE_ORDER,
  type LanguageCode,
} from '@/lib/i18n/config';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  scope?: 'public' | 'dashboard' | 'admin';
  className?: string;
}

export default function LanguageSwitcher({
  scope = 'public',
  className = '',
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  // Get allowed languages for this scope, maintaining display order
  const allowedLanguages = SCOPE_LANGUAGES[scope] || SCOPE_LANGUAGES.public;
  const displayLanguages = LANGUAGE_ORDER.filter((code) =>
    allowedLanguages.includes(code)
  );

  // Use sidebar styling for admin and dashboard scopes
  const isSidebar = scope === 'admin' || scope === 'dashboard';

  return (
    <div className={`${styles.switcher} ${isSidebar ? styles.sidebar : ''} ${className}`}>
      {displayLanguages.map((code, index) => {
        const lang = LANGUAGES[code as LanguageCode];
        const isActive = language === code;

        return (
          <span key={code} className={styles.langItem}>
            <button
              onClick={() => setLanguage(code as LanguageCode)}
              className={`${styles.langBtn} ${isActive ? styles.active : ''}`}
              aria-label={`Switch to ${lang.name}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {lang.label}
            </button>
            {index < displayLanguages.length - 1 && (
              <span className={styles.separator} aria-hidden="true" />
            )}
          </span>
        );
      })}
    </div>
  );
}
