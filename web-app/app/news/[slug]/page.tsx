/**
 * News Article Detail Page
 * Displays full article content
 */
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('news')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.title} | Jaws Co., Ltd.`,
    description: article.excerpt || 'News and updates from Jaws Co., Ltd.',
  };
}

export default async function NewsArticle({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !article) {
    notFound();
  }

  // Get recent articles for sidebar
  const { data: recentArticles } = await supabase
    .from('news')
    .select('id, title, slug, published_at')
    .eq('is_published', true)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(5);

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/news">News</Link>
          <span>/</span>
          <span className={styles.current}>{article.title}</span>
        </nav>

        {article.cover_image_url && (
          <div className={styles.coverImage}>
            <img src={article.cover_image_url} alt={article.title} />
          </div>
        )}

        <header className={styles.header}>
          <time className={styles.date}>
            {article.published_at
              ? new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Recently Published'}
          </time>
          <h1 className={styles.title}>{article.title}</h1>
        </header>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className={styles.footer}>
          <Link href="/news" className={styles.backLink}>
            ← Back to News
          </Link>
          <Link href="/contact" className={styles.contactLink}>
            Contact Us
          </Link>
        </footer>
      </article>

      {recentArticles && recentArticles.length > 0 && (
        <aside className={styles.sidebar}>
          <h3>Recent Articles</h3>
          <ul className={styles.recentList}>
            {recentArticles.map((recent) => (
              <li key={recent.id}>
                <Link href={`/news/${recent.slug}`}>
                  <span className={styles.recentTitle}>{recent.title}</span>
                  <time>
                    {recent.published_at
                      ? new Date(recent.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
