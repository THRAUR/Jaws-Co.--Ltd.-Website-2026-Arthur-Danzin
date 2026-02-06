/**
 * Client Dashboard Overview Page
 * Shows summary of inquiries, favorites, and recent activity
 */
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from './page.module.css';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get inquiry count
  const { count: inquiryCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('email', user.email);

  // Get favorites count
  const { count: favoritesCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get orders count
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get recent inquiries
  const { data: recentInquiries } = await supabase
    .from('inquiries')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
        <p>Here&apos;s an overview of your account activity</p>
      </header>

      <div className={styles.statsGrid}>
        <Link href="/dashboard/inquiries" className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd' }}>I</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{inquiryCount || 0}</span>
            <span className={styles.statLabel}>Inquiries</span>
          </div>
        </Link>

        <Link href="/dashboard/favorites" className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0' }}>F</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{favoritesCount || 0}</span>
            <span className={styles.statLabel}>Favorites</span>
          </div>
        </Link>

        <Link href="/dashboard/orders" className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9' }}>R</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{ordersCount || 0}</span>
            <span className={styles.statLabel}>Orders</span>
          </div>
        </Link>

        <Link href="/dashboard/profile" className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fce4ec' }}>P</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{profile?.company_name ? '1' : '0'}</span>
            <span className={styles.statLabel}>Profile Complete</span>
          </div>
        </Link>
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Recent Inquiries</h2>
            <Link href="/dashboard/inquiries" className={styles.viewAll}>
              View All
            </Link>
          </div>

          {recentInquiries && recentInquiries.length > 0 ? (
            <div className={styles.inquiryList}>
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className={styles.inquiryItem}>
                  <div className={styles.inquiryType}>
                    {inquiry.inquiry_type.toUpperCase()}
                  </div>
                  <div className={styles.inquiryContent}>
                    <p className={styles.inquiryMessage}>
                      {inquiry.message.slice(0, 100)}
                      {inquiry.message.length > 100 ? '...' : ''}
                    </p>
                    <span className={styles.inquiryDate}>
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div
                    className={`${styles.inquiryStatus} ${
                      inquiry.is_read ? styles.read : styles.unread
                    }`}
                  >
                    {inquiry.is_read ? 'Reviewed' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No inquiries yet</p>
              <Link href="/quote" className={styles.ctaBtn}>
                Request a Quote
              </Link>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Quick Actions</h2>
          </div>
          <div className={styles.quickActions}>
            <Link href="/quote" className={styles.actionCard}>
              <span className={styles.actionIcon}>Q</span>
              <span>Request Quote</span>
            </Link>
            <Link href="/products" className={styles.actionCard}>
              <span className={styles.actionIcon}>P</span>
              <span>Browse Products</span>
            </Link>
            <Link href="/contact" className={styles.actionCard}>
              <span className={styles.actionIcon}>S</span>
              <span>Get Support</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
