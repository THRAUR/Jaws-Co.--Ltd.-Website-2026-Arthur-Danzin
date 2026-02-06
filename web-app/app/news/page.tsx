/**
 * Public News Page
 * Lists all published news articles
 */
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from './page.module.css';

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

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1>News & Updates</h1>
        <p>Stay informed about our latest products, company milestones, and industry insights.</p>
      </header>

      <main className={styles.content}>
        {error ? (
          <div className={styles.error}>
            Error loading articles. Please try again later.
          </div>
        ) : !articles?.length ? (
          <div className={styles.empty}>
            <h2>Coming Soon</h2>
            <p>We're working on exciting news to share with you. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className={styles.card}
              >
                {article.cover_image_url ? (
                  <div className={styles.cardImage}>
                    <img src={article.cover_image_url} alt={article.title} />
                  </div>
                ) : (
                  <div className={styles.cardPlaceholder}>
                    <span>NEWS</span>
                  </div>
                )}

                <div className={styles.cardContent}>
                  <time className={styles.date}>
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Recently'}
                  </time>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  {article.excerpt && (
                    <p className={styles.excerpt}>{article.excerpt}</p>
                  )}
                  <span className={styles.readMore}>Read Article →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
