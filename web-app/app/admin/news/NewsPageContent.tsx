'use client';

/**
 * Admin News Page Content
 * Client component for translated news list
 */
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';
import { DeleteNewsButton } from './DeleteNewsButton';
import styles from './page.module.css';
import tableStyles from '../components/AdminTable.module.css';

interface Article {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  published_at: string | null;
}

interface NewsPageContentProps {
  articles: Article[] | null;
  error: string | null;
}

export default function NewsPageContent({ articles, error }: NewsPageContentProps) {
  const t = useTranslation();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('admin.news.title')}</h1>
          <p className={styles.subtitle}>{t('admin.news.subtitle')}</p>
        </div>
        <Link href="/admin/news/new" className={styles.addBtn}>
          {t('admin.news.addNew')}
        </Link>
      </header>

      <div className={tableStyles.tableContainer}>
        {error ? (
          <div className={tableStyles.empty}>
            {t('common.error')}: {error}
          </div>
        ) : !articles?.length ? (
          <div className={tableStyles.empty}>
            {t('admin.news.empty')}{' '}
            <Link href="/admin/news/new">{t('admin.news.writeFirst')}</Link>
          </div>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>{t('admin.news.tableTitle')}</th>
                <th>{t('admin.news.status')}</th>
                <th>{t('admin.news.publishedAt')}</th>
                <th>{t('admin.products.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <strong>{article.title}</strong>
                    <br />
                    <small style={{ color: '#666' }}>/news/{article.slug}</small>
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        article.is_published ? styles.published : styles.draft
                      }`}
                    >
                      {article.is_published ? t('admin.news.published') : t('admin.news.draft')}
                    </span>
                  </td>
                  <td>
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString()
                      : '—'}
                  </td>
                  <td>
                    <div className={tableStyles.actions}>
                      <Link
                        href={`/admin/news/${article.id}`}
                        className={tableStyles.editBtn}
                      >
                        {t('admin.news.edit')}
                      </Link>
                      <DeleteNewsButton articleId={article.id} articleTitle={article.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
