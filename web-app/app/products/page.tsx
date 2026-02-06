/**
 * Public Products Page
 * Browse products with category filtering
 * Fetches data from Supabase instead of static JSON
 */
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import styles from './page.module.css';

export const metadata = {
  title: 'Jaws Co., Ltd. - Product Catalog',
  description: 'View our complete catalog of FFC/FPC and Wire-to-Board connectors.',
};

// Category Descriptions Dictionary
const CATEGORY_INFO: Record<string, { title: string; desc: string }> = {
  default: {
    title: 'Product Catalog',
    desc: 'Explore our extensive range of FFC/FPC and Wire-to-Board connectors. Precision manufactured for reliability.',
  },
  'fpc-ffc': {
    title: 'FPC & FFC Connectors',
    desc: 'Flexible Printed Circuit connectors designed for high-density electronic packaging. Featuring Zero Insertion Force (ZIF) and Non-ZIF options.',
  },
  '0-5mm': {
    title: '0.5mm Pitch Connectors',
    desc: 'Our most popular fine-pitch series. Ideal for compact devices requiring high reliability and signal integrity.',
  },
  '1-0mm': {
    title: '1.0mm Pitch Connectors',
    desc: 'Robust standard pitch connectors. Perfect for automotive, industrial, and consumer electronics applications where durability is key.',
  },
  '1-25mm': {
    title: '1.25mm Pitch Connectors',
    desc: 'Wide pitch connectors offering superior mechanical strength and easier manual assembly for larger devices.',
  },
  'wire-to-board': {
    title: 'Wire-to-Board Solutions',
    desc: 'Secure wire-to-board connections with positive locking mechanisms. Designed for high-vibration environments.',
  },
};

interface SearchParams {
  category?: string;
}

interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  specs: string[] | null;
  image_url: string | null;
  category: { name: string; slug: string } | null;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categorySlug = params.category;
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  // Find selected category
  const selectedCategory = categorySlug
    ? categories?.find((c) => c.slug === categorySlug)
    : null;

  // Build products query
  let query = supabase
    .from('products')
    .select('id, name, slug, specs, image_url, category:categories(name, slug)')
    .order('name');

  if (selectedCategory) {
    query = query.eq('category_id', selectedCategory.id);
  }

  const { data: rawProducts, error } = await query;

  // Transform products to handle category as object (not array)
  const products: ProductWithCategory[] | null = rawProducts?.map((p) => ({
    ...p,
    category: Array.isArray(p.category) ? p.category[0] || null : p.category,
  })) || null;

  // Dynamic Header Logic
  const headerInfo = CATEGORY_INFO[categorySlug || ''] || CATEGORY_INFO.default;

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1>{selectedCategory?.name || headerInfo.title}</h1>
        <p>{headerInfo.desc}</p>
      </header>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h3>Categories</h3>
            <Link
              href="/products"
              className={`${styles.filterItem} ${!categorySlug ? styles.active : ''}`}
            >
              All Products
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`${styles.filterItem} ${categorySlug === cat.slug ? styles.active : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </aside>

        <main className={styles.productGrid}>
          {error ? (
            <div className={styles.error}>
              Error loading products. Please try again later.
            </div>
          ) : !products?.length ? (
            <div className={styles.empty}>
              No products found in this category.
            </div>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={styles.productCard}
              >
                {product.image_url ? (
                  <div className={styles.productImage}>
                    <img src={product.image_url} alt={product.name} />
                  </div>
                ) : (
                  <div className={styles.placeholderImg}>
                    <span className={styles.phText}>
                      {product.name}
                      <br />
                      <small style={{ display: 'block', marginTop: '5px', color: '#999' }}>
                        {product.category?.name || 'Connector'}
                      </small>
                    </span>
                  </div>
                )}

                <div className={styles.pInfo}>
                  <h4>{product.name}</h4>
                  {product.category && (
                    <span className={styles.categoryTag}>{product.category.name}</span>
                  )}
                  <div className={styles.pSpecs}>
                    {product.specs?.slice(0, 3).map((spec, i) => (
                      <div key={i}>{spec}</div>
                    ))}
                  </div>
                </div>
                <span className={styles.pAction}>View Details</span>
              </Link>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
