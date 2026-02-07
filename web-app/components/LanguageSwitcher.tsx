'use client';

/**
 * Language Switcher Component
 * Compact dropdown for public site, horizontal for sidebar
 */

import { useState, useRef, useEffect } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get allowed languages for this scope, maintaining display order
  const allowedLanguages = SCOPE_LANGUAGES[scope] || SCOPE_LANGUAGES.public;
  const displayLanguages = LANGUAGE_ORDER.filter((code) =>
    allowedLanguages.includes(code)
  );

  // Use sidebar styling for admin and dashboard scopes
  const isSidebar = scope === 'admin' || scope === 'dashboard';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const currentLang = LANGUAGES[language as LanguageCode] || LANGUAGES.en;

  // Compact dropdown for public navbar
  if (!isSidebar) {
    return (
      <div ref={dropdownRef} className={`${styles.dropdown} ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.dropdownBtn}
          aria-expanded={isOpen}
          aria-label="Select language"
        >
          <span className={styles.currentLang}>{currentLang.label}</span>
          <span className={styles.arrow}>▾</span>
        </button>
        {isOpen && (
          <div className={styles.dropdownMenu}>
            {displayLanguages.map((code) => {
              const lang = LANGUAGES[code as LanguageCode];
              const isActive = language === code;
              return (
                <button
                  key={code}
                  onClick={() => handleLanguageSelect(code as LanguageCode)}
                  className={`${styles.dropdownItem} ${isActive ? styles.active : ''}`}
                >
                  <span className={styles.langLabel}>{lang.label}</span>
                  <span className={styles.langName}>{lang.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Horizontal layout for sidebar (admin/dashboard)
  return (
    <div className={`${styles.switcher} ${styles.sidebar} ${className}`}>
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
