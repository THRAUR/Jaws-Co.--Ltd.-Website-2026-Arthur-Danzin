/**
 * Admin News List Page
 * View and manage news articles
 */
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DeleteNewsButton } from './DeleteNewsButton';
import styles from './page.module.css';
import tableStyles from '../components/AdminTable.module.css';

export default async function AdminNews() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>News & Articles</h1>
          <p className={styles.subtitle}>Manage company news and updates</p>
        </div>
        <Link href="/admin/news/new" className={styles.addBtn}>
          Write Article
        </Link>
      </header>

      <div className={tableStyles.tableContainer}>
        {error ? (
          <div className={tableStyles.empty}>
            Error loading articles: {error.message}
          </div>
        ) : !articles?.length ? (
          <div className={tableStyles.empty}>
            No articles yet.{' '}
            <Link href="/admin/news/new">Write your first article</Link>
          </div>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
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
                      {article.is_published ? 'Published' : 'Draft'}
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
                        Edit
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
