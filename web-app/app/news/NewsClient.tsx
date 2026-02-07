'use client';

/**
 * News Page Client Component
 * Handles translations for the news page
 */
import Link from 'next/link';
import { useTranslation, useLanguage } from '@/lib/i18n/context';
import styles from './page.module.css';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
}

interface NewsClientProps {
  articles: Article[] | null;
  error: boolean;
}

export default function NewsClient({ articles, error }: NewsClientProps) {
  const t = useTranslation();
  const { language } = useLanguage();

  // Get locale for date formatting
  const getLocale = () => {
    const localeMap: Record<string, string> = {
      en: 'en-US',
      'zh-TW': 'zh-TW',
      'zh-CN': 'zh-CN',
      ja: 'ja-JP',
      it: 'it-IT',
      fr: 'fr-FR',
      es: 'es-ES',
      de: 'de-DE',
    };
    return localeMap[language] || 'en-US';
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1>{t('news.title')}</h1>
        <p>{t('news.description')}</p>
      </header>

      <main className={styles.content}>
        {error ? (
          <div className={styles.error}>
            {t('news.error')}
          </div>
        ) : !articles?.length ? (
          <div className={styles.empty}>
            <h2>{t('news.comingSoon')}</h2>
            <p>{t('news.comingSoonDesc')}</p>
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
                      ? new Date(article.published_at).toLocaleDateString(getLocale(), {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : t('news.recently')}
                  </time>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  {article.excerpt && (
                    <p className={styles.excerpt}>{article.excerpt}</p>
                  )}
                  <span className={styles.readMore}>{t('news.readMore')} →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
