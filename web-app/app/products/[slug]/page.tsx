/**
 * Product Detail Page
 * Displays full product information with specs and PDF link
 */
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('name, specs')
    .eq('slug', slug)
    .single();

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | Jaws Co., Ltd.`,
    description: product.specs?.[0] || 'FFC/FPC and Wire-to-Board connector',
  };
}

export default async function ProductDetail({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*, category:categories(name, slug)')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    notFound();
  }

  // Get related products from same category
  let relatedProducts = null;
  if (product.category_id) {
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, image_url')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(4);
    relatedProducts = data;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link href="/products">Products</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`}>
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className={styles.current}>{product.name}</span>
      </nav>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className={styles.productImage}
            />
          ) : (
            <div className={styles.placeholder}>
              <span>Product Image</span>
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          {product.category && (
            <span className={styles.categoryBadge}>{product.category.name}</span>
          )}

          <h1 className={styles.title}>{product.name}</h1>

          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          {product.specs && product.specs.length > 0 && (
            <div className={styles.specsSection}>
              <h2>Specifications</h2>
              <ul className={styles.specsList}>
                {(product.specs as string[]).map((spec: string, i: number) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.actions}>
            {product.pdf_url && (
              <a
                href={product.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pdfBtn}
              >
                Download Spec Sheet (PDF)
              </a>
            )}
            <Link href="/contact?product={product.slug}" className={styles.inquiryBtn}>
              Request Quote
            </Link>
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <section className={styles.relatedSection}>
          <h2>Related Products</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/products/${related.slug}`}
                className={styles.relatedCard}
              >
                {related.image_url ? (
                  <img src={related.image_url} alt={related.name} />
                ) : (
                  <div className={styles.relatedPlaceholder} />
                )}
                <span>{related.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
