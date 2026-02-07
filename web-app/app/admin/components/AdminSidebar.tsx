'use client';

/**
 * Admin Sidebar Navigation Component
 * Provides navigation links and logout functionality
 */
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  // Translated nav items
  const translatedNavItems = [
    { href: '/admin', label: t('admin.sidebar.dashboard'), icon: '/' },
    { href: '/admin/products', label: t('admin.sidebar.products'), icon: 'P' },
    { href: '/admin/categories', label: t('admin.sidebar.categories'), icon: 'C' },
    { href: '/admin/news', label: t('admin.sidebar.news'), icon: 'N' },
    { href: '/admin/inquiries', label: t('admin.sidebar.inquiries'), icon: 'I' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Link href="/admin">
          <h1 className={styles.logo}>
            JAWS <span className={styles.gold}>Admin</span>
          </h1>
        </Link>
        <div className={styles.langSwitcher}>
          <LanguageSwitcher scope="admin" />
        </div>
      </div>

      <nav className={styles.nav}>
        {translatedNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.user}>
          <span className={styles.userIcon}>U</span>
          <span className={styles.userEmail}>{userEmail}</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          {t('admin.sidebar.signOut')}
        </button>
        <Link href="/" className={styles.viewSite}>
          {t('admin.sidebar.viewLiveSite')}
        </Link>
      </div>
    </aside>
  );
}
