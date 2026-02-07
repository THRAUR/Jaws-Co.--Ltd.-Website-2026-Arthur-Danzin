/**
 * Admin News List Page
 * View and manage news articles
 */
import { createClient } from '@/lib/supabase/server';
import NewsPageContent from './NewsPageContent';

export default async function AdminNews() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <NewsPageContent
      articles={articles}
      error={error?.message || null}
    />
  );
}
