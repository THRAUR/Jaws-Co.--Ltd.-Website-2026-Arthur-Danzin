/**
 * Admin Dashboard Home
 * Overview of website statistics and quick actions
 */
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from './page.module.css';

async function getStats() {
  const supabase = await createClient();

  const [products, categories, news, inquiries] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('news').select('id', { count: 'exact', head: true }),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('is_read', false),
  ]);

  return {
    products: products.count || 0,
    categories: categories.count || 0,
    news: news.count || 0,
    unreadInquiries: inquiries.count || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: 'Products', value: stats.products, href: '/admin/products', color: 'gold' },
    { label: 'Categories', value: stats.categories, href: '/admin/categories', color: 'blue' },
    { label: 'News Articles', value: stats.news, href: '/admin/news', color: 'green' },
    { label: 'New Inquiries', value: stats.unreadInquiries, href: '/admin/inquiries', color: 'red' },
  ];

  const quickActions = [
    { label: 'Add New Product', href: '/admin/products/new', primary: true },
    { label: 'Write News Article', href: '/admin/news/new', primary: false },
    { label: 'Manage Categories', href: '/admin/categories', primary: false },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome to the Jaws Co., Ltd. admin panel</p>
      </header>

      <section className={styles.stats}>
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className={`${styles.statCard} ${styles[stat.color]}`}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </Link>
        ))}
      </section>

      <section className={styles.actions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${styles.actionCard} ${action.primary ? styles.primary : ''}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.info}>
        <h2 className={styles.sectionTitle}>Getting Started</h2>
        <div className={styles.infoCard}>
          <h3>Product Management</h3>
          <p>Add, edit, and organize your FFC/FPC connector products. Upload images and PDF spec sheets directly.</p>
        </div>
        <div className={styles.infoCard}>
          <h3>News & Updates</h3>
          <p>Publish company news, product announcements, and industry updates to keep customers informed.</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Customer Inquiries</h3>
          <p>View and manage incoming RFQ requests, sample inquiries, and technical support messages.</p>
        </div>
      </section>
    </div>
  );
}
