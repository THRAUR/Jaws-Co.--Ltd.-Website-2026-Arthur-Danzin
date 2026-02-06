'use client';

/**
 * News Form Component
 * Reusable form for creating and editing news articles
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { NewsArticle } from '@/types/database';
import Link from 'next/link';
import styles from '../components/AdminForm.module.css';

interface NewsFormProps {
  article?: NewsArticle;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function NewsForm({ article }: NewsFormProps) {
  const router = useRouter();
  const isEditing = !!article;

  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [content, setContent] = useState(article?.content || '');
  const [coverImageUrl, setCoverImageUrl] = useState(article?.cover_image_url || '');
  const [isPublished, setIsPublished] = useState(article?.is_published || false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing || slug === slugify(article?.title || '')) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const articleData = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      cover_image_url: coverImageUrl || null,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    try {
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('news')
          .update(articleData)
          .eq('id', article.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('news')
          .insert(articleData);

        if (insertError) throw insertError;
      }

      router.push('/admin/news');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.formError}>{error}</div>}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Title <span className={styles.required}>*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={styles.input}
            required
            placeholder="Article title"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="slug" className={styles.label}>
            URL Slug <span className={styles.required}>*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={styles.input}
            required
            placeholder="article-slug"
          />
          <p className={styles.hint}>/news/{slug || 'slug'}</p>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="excerpt" className={styles.label}>
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={styles.textarea}
          style={{ minHeight: '80px' }}
          placeholder="Brief summary shown in article listings..."
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="coverImage" className={styles.label}>
          Cover Image URL
        </label>
        <input
          id="coverImage"
          type="url"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className={styles.input}
          placeholder="https://example.com/image.jpg"
        />
        {coverImageUrl && (
          <div className={styles.preview}>
            <img src={coverImageUrl} alt="Cover preview" className={styles.previewImage} />
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="content" className={styles.label}>
          Content <span className={styles.required}>*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
          style={{ minHeight: '300px' }}
          required
          placeholder="Write your article content here. HTML is supported."
        />
        <p className={styles.hint}>HTML formatting is supported.</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          Publish article
        </label>
        <p className={styles.hint}>
          {isPublished
            ? 'Article will be visible on the public news page'
            : 'Article will be saved as draft (not visible publicly)'}
        </p>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading
            ? 'Saving...'
            : isEditing
            ? 'Update Article'
            : isPublished
            ? 'Publish Article'
            : 'Save Draft'}
        </button>
        <Link href="/admin/news" className={styles.cancelBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
