'use client';

/**
 * Client Dashboard Sidebar
 * Navigation and user info for client area
 */
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import styles from './DashboardSidebar.module.css';

interface DashboardSidebarProps {
  userName: string;
  userEmail: string;
  companyName: string;
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: 'O' },
  { href: '/dashboard/inquiries', label: 'My Inquiries', icon: 'I' },
  { href: '/dashboard/favorites', label: 'Favorites', icon: 'F' },
  { href: '/dashboard/orders', label: 'Orders', icon: 'R' },
  { href: '/dashboard/profile', label: 'Profile', icon: 'P' },
];

export default function DashboardSidebar({
  userName,
  userEmail,
  companyName,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
      </div>

      <div className={styles.userCard}>
        <div className={styles.avatar}>{initials || 'U'}</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{userName}</span>
          {companyName && <span className={styles.companyName}>{companyName}</span>}
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
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
          + New Quote Request
        </Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
        <Link href="/" className={styles.viewSite}>
          Back to Website
        </Link>
      </div>
    </aside>
  );
}
