'use client';

/**
 * Categories Page Header
 * Client component for translated page title
 */
import { useTranslation } from '@/lib/i18n/context';
import styles from './page.module.css';

export function CategoriesHeader() {
  const t = useTranslation();

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{t('admin.categories.title')}</h1>
        <p className={styles.subtitle}>{t('admin.categories.subtitle')}</p>
      </div>
    </header>
  );
}
