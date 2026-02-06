/**
 * Admin Dashboard Layout
 * Provides sidebar navigation and authentication state
 */
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';
import styles from './layout.module.css';

export const metadata = {
  title: 'Admin Dashboard | Jaws Co., Ltd.',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // This layout is also used for login page, so we need to check the path
  // The middleware handles redirects, but we still need conditional rendering
  const isLoginPage = !user;

  if (isLoginPage) {
    // For login page, render without sidebar
    return <>{children}</>;
  }

  // Verify admin role (defense in depth - middleware also checks this)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    // Non-admin users get redirected to client dashboard
    redirect('/dashboard');
  }

  return (
    <div className={styles.layout}>
      <AdminSidebar userEmail={user.email || ''} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
