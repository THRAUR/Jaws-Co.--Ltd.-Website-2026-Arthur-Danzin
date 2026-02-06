'use client';

/**
 * Delete News Button Component
 */
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import tableStyles from '../components/AdminTable.module.css';

interface DeleteNewsButtonProps {
  articleId: string;
  articleTitle: string;
}

export function DeleteNewsButton({ articleId, articleTitle }: DeleteNewsButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${articleTitle}"?`)) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from('news').delete().eq('id', articleId);

    if (error) {
      alert(`Error deleting article: ${error.message}`);
      return;
    }

    router.refresh();
  };

  return (
    <button onClick={handleDelete} className={tableStyles.deleteBtn}>
      Delete
    </button>
  );
}
