'use client';

/**
 * Admin Sidebar Navigation Component
 * Provides navigation links and logout functionality
 */
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  userEmail: string;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '/' },
  { href: '/admin/products', label: 'Products', icon: 'P' },
  { href: '/admin/categories', label: 'Categories', icon: 'C' },
  { href: '/admin/news', label: 'News', icon: 'N' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: 'I' },
];

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Link href="/admin">
          <h1 className={styles.logo}>
            JAWS <span className={styles.gold}>Admin</span>
          </h1>
        </Link>
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
        <div className={styles.user}>
          <span className={styles.userIcon}>U</span>
          <span className={styles.userEmail}>{userEmail}</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
        <Link href="/" className={styles.viewSite}>
          View Live Site
        </Link>
      </div>
    </aside>
  );
}
