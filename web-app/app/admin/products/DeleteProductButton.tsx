'use client';

/**
 * Delete Product Button Component
 * Handles product deletion with confirmation
 */
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import tableStyles from '../components/AdminTable.module.css';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      alert(`Error deleting product: ${error.message}`);
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
