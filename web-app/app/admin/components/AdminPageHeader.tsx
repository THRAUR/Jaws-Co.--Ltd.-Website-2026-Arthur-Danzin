'use client';

/**
 * Admin Page Header Component
 * Reusable translated header for admin pages
 */
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';

interface AdminPageHeaderProps {
  titleKey: string;
  subtitleKey?: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  styles: {
    header: string;
    title: string;
    subtitle: string;
    addBtn?: string;
    unreadBadge?: string;
  };
  unreadCount?: number;
}

export function AdminPageHeader({
  titleKey,
  subtitleKey,
  subtitle,
  actionLabel,
  actionHref,
  styles,
  unreadCount,
}: AdminPageHeaderProps) {
  const t = useTranslation();

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{t(titleKey)}</h1>
        <p className={styles.subtitle}>
          {unreadCount !== undefined && unreadCount > 0 ? (
            <>
              <span className={styles.unreadBadge}>{unreadCount}</span> {t(subtitleKey || '')}
            </>
          ) : (
            subtitle || (subtitleKey ? t(subtitleKey) : '')
          )}
        </p>
      </div>
      {actionLabel && actionHref && styles.addBtn && (
        <Link href={actionHref} className={styles.addBtn}>
          {t(actionLabel)}
        </Link>
      )}
    </header>
  );
}
