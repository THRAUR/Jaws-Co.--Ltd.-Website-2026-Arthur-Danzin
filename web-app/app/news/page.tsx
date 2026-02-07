/**
 * Public News Page
 * Lists all published news articles
 */
import { createClient } from '@/lib/supabase/server';
import NewsClient from './NewsClient';

export const metadata = {
  title: 'News & Updates | Jaws Co., Ltd.',
  description: 'Latest news, product announcements, and company updates from Jaws Co., Ltd.',
};

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('news')
    .select('id, title, slug, excerpt, cover_image_url, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return <NewsClient articles={articles} error={!!error} />;
}
