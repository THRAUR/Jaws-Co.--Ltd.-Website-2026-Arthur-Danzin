/**
 * Create New Product Page
 */
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ProductForm } from '../ProductForm';
import styles from '../page.module.css';

export default async function NewProduct() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <nav style={{ marginBottom: '0.5rem' }}>
            <Link href="/admin/products" style={{ color: '#666', fontSize: '0.9rem' }}>
              ← Back to Products
            </Link>
          </nav>
          <h1 className={styles.title}>Add New Product</h1>
          <p className={styles.subtitle}>Create a new product in the catalog</p>
        </div>
      </header>

      <ProductForm categories={categories || []} />
    </div>
  );
}
