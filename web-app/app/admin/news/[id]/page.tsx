/**
 * Edit Article Page
 */
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NewsForm } from '../NewsForm';
import styles from '../page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticle({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <nav style={{ marginBottom: '0.5rem' }}>
            <Link href="/admin/news" style={{ color: '#666', fontSize: '0.9rem' }}>
              ← Back to News
            </Link>
          </nav>
          <h1 className={styles.title}>Edit Article</h1>
          <p className={styles.subtitle}>{article.title}</p>
        </div>
      </header>

      <NewsForm article={article} />
    </div>
  );
}
