/**
 * Edit Product Page
 */
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductForm } from '../ProductForm';
import styles from '../page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProduct({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch product
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch categories
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
          <h1 className={styles.title}>Edit Product</h1>
          <p className={styles.subtitle}>{product.name}</p>
        </div>
      </header>

      <ProductForm product={product} categories={categories || []} />
    </div>
  );
}
