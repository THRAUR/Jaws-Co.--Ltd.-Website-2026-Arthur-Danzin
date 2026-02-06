/**
 * Create New Article Page
 */
import Link from 'next/link';
import { NewsForm } from '../NewsForm';
import styles from '../page.module.css';

export default function NewArticle() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <nav style={{ marginBottom: '0.5rem' }}>
            <Link href="/admin/news" style={{ color: '#666', fontSize: '0.9rem' }}>
              ← Back to News
            </Link>
          </nav>
          <h1 className={styles.title}>Write New Article</h1>
          <p className={styles.subtitle}>Create a news article or company update</p>
        </div>
      </header>

      <NewsForm />
    </div>
  );
}
