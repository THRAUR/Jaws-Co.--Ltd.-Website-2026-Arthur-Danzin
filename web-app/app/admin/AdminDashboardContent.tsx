'use client';

/**
 * Admin Dashboard Content Component
 * Client component for translated dashboard content
 */
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';
import styles from './page.module.css';

interface AdminDashboardContentProps {
  stats: {
    products: number;
    categories: number;
    news: number;
    unreadInquiries: number;
  };
}

export default function AdminDashboardContent({ stats }: AdminDashboardContentProps) {
  const t = useTranslation();

  const statCards = [
    { labelKey: 'admin.dashboard.stats.products', value: stats.products, href: '/admin/products', color: 'gold' },
    { labelKey: 'admin.dashboard.stats.categories', value: stats.categories, href: '/admin/categories', color: 'blue' },
    { labelKey: 'admin.dashboard.stats.newsArticles', value: stats.news, href: '/admin/news', color: 'green' },
    { labelKey: 'admin.dashboard.stats.newInquiries', value: stats.unreadInquiries, href: '/admin/inquiries', color: 'red' },
  ];

  const quickActions = [
    { labelKey: 'admin.dashboard.quickActions.addProduct', href: '/admin/products/new', primary: true },
    { labelKey: 'admin.dashboard.quickActions.writeArticle', href: '/admin/news/new', primary: false },
    { labelKey: 'admin.dashboard.quickActions.manageCategories', href: '/admin/categories', primary: false },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('admin.dashboard.title')}</h1>
        <p className={styles.subtitle}>{t('admin.dashboard.subtitle')}</p>
      </header>

      <section className={styles.stats}>
        {statCards.map((stat) => (
          <Link key={stat.labelKey} href={stat.href} className={`${styles.statCard} ${styles[stat.color]}`}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{t(stat.labelKey)}</span>
          </Link>
        ))}
      </section>

      <section className={styles.actions}>
        <h2 className={styles.sectionTitle}>{t('admin.dashboard.quickActions.title')}</h2>
        <div className={styles.actionGrid}>
          {quickActions.map((action) => (
            <Link
              key={action.labelKey}
              href={action.href}
              className={`${styles.actionCard} ${action.primary ? styles.primary : ''}`}
            >
              {t(action.labelKey)}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.info}>
        <h2 className={styles.sectionTitle}>{t('admin.dashboard.gettingStarted.title')}</h2>
        <div className={styles.infoCard}>
          <h3>{t('admin.dashboard.gettingStarted.productManagement.title')}</h3>
          <p>{t('admin.dashboard.gettingStarted.productManagement.description')}</p>
        </div>
        <div className={styles.infoCard}>
          <h3>{t('admin.dashboard.gettingStarted.newsUpdates.title')}</h3>
          <p>{t('admin.dashboard.gettingStarted.newsUpdates.description')}</p>
        </div>
        <div className={styles.infoCard}>
          <h3>{t('admin.dashboard.gettingStarted.customerInquiries.title')}</h3>
          <p>{t('admin.dashboard.gettingStarted.customerInquiries.description')}</p>
        </div>
      </section>
    </div>
  );
}
