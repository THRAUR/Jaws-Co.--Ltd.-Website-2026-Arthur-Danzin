/**
 * Admin Dashboard Home
 * Overview of website statistics and quick actions
 */
import { createClient } from '@/lib/supabase/server';
import AdminDashboardContent from './AdminDashboardContent';

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

  return <AdminDashboardContent stats={stats} />;
}
