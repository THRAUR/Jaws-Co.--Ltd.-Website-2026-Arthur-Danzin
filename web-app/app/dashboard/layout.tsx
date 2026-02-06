/**
 * Client Dashboard Layout
 * Provides sidebar navigation and authentication check
 */
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from './components/DashboardSidebar';
import styles from './layout.module.css';

export const metadata = {
  title: 'My Dashboard | Jaws Co., Ltd.',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If admin, redirect to admin dashboard
  if (profile?.role === 'admin') {
    redirect('/admin');
  }

  return (
    <div className={styles.layout}>
      <DashboardSidebar
        userName={profile?.full_name || user.email || ''}
        userEmail={user.email || ''}
        companyName={profile?.company_name || ''}
      />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
