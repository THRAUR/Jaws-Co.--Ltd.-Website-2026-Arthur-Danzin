'use client';

/**
 * Admin Inquiries Header
 * Client component for translated header
 */
import { useTranslation } from '@/lib/i18n/context';
import styles from './page.module.css';

interface InquiriesHeaderProps {
  unreadCount: number;
}

export function InquiriesHeader({ unreadCount }: InquiriesHeaderProps) {
  const t = useTranslation();

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{t('admin.inquiries.title')}</h1>
        <p className={styles.subtitle}>
          {unreadCount > 0 ? (
            <>
              <span className={styles.unreadBadge}>{unreadCount} {t('admin.inquiries.newInquiries')}</span>
            </>
          ) : (
            t('admin.inquiries.subtitle')
          )}
        </p>
      </div>
    </header>
  );
}
