'use client';

/**
 * Client Dashboard Sidebar
 * Navigation and user info for client area
 */
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import styles from './DashboardSidebar.module.css';

interface DashboardSidebarProps {
  userName: string;
  userEmail: string;
  companyName: string;
}

export default function DashboardSidebar({
  userName,
  userEmail,
  companyName,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Translated nav items
  const translatedNavItems = [
    { href: '/dashboard', label: t('dashboard.overview'), icon: 'O' },
    { href: '/dashboard/inquiries', label: t('dashboard.inquiries'), icon: 'I' },
    { href: '/dashboard/favorites', label: t('dashboard.favorites'), icon: 'F' },
    { href: '/dashboard/profile', label: t('dashboard.profile'), icon: 'P' },
  ];

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Link href="/">
          <h1 className={styles.logo}>
            JAWS <span className={styles.gold}>Client</span>
          </h1>
        </Link>
        <div className={styles.langSwitcher}>
          <LanguageSwitcher scope="dashboard" />
        </div>
      </div>

      <div className={styles.userCard}>
        <div className={styles.avatar}>{initials || 'U'}</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{userName}</span>
          {companyName && <span className={styles.companyName}>{companyName}</span>}
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
        <Link href="/quote" className={styles.newInquiry}>
          + {t('quote.title')}
        </Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          {t('nav.logout')}
        </button>
        <Link href="/" className={styles.viewSite}>
          {t('nav.home')}
        </Link>
      </div>
    </aside>
  );
}
