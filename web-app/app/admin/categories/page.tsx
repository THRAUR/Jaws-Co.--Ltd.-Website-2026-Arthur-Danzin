/**
 * Admin Categories Page
 * Manage product categories with inline editing
 */
import { createClient } from '@/lib/supabase/server';
import { CategoryList } from './CategoryList';
import styles from './page.module.css';

export default async function AdminCategories() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*, products:products(count)')
    .order('name');

  // Transform to include product count
  const categoriesWithCount = categories?.map((cat) => ({
    ...cat,
    product_count: cat.products?.[0]?.count || 0,
  }));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.subtitle}>Organize your product catalog</p>
        </div>
      </header>

      {error ? (
        <div className={styles.error}>Error loading categories: {error.message}</div>
      ) : (
        <CategoryList initialCategories={categoriesWithCount || []} />
      )}
    </div>
  );
}
