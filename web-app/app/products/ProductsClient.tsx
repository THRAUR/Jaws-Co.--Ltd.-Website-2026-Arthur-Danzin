'use client';

/**
 * Products Page Client Component
 * Handles translations for the products page
 */
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import styles from './page.module.css';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  specs: string[] | null;
  image_url: string | null;
  category: { name: string; slug: string } | null;
}

interface ProductsClientProps {
  categories: Category[] | null;
  products: ProductWithCategory[] | null;
  categorySlug: string | undefined;
  selectedCategoryName: string | undefined;
  error: boolean;
}

export default function ProductsClient({
  categories,
  products,
  categorySlug,
  selectedCategoryName,
  error,
}: ProductsClientProps) {
  const t = useTranslation();

  // Get translated category description
  const getCategoryInfo = (slug: string | undefined) => {
    if (!slug) {
      return {
        title: t('products.title'),
        desc: t('products.description'),
      };
    }
    const key = `products.categoryDescriptions.${slug}`;
    const title = t(`${key}.title`);
    const desc = t(`${key}.description`);
    // If translation key not found, return defaults
    if (title === `${key}.title`) {
      return {
        title: selectedCategoryName || t('products.title'),
        desc: t('products.description'),
      };
    }
    return { title, desc };
  };

  const headerInfo = getCategoryInfo(categorySlug);

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1>{selectedCategoryName || headerInfo.title}</h1>
        <p>{headerInfo.desc}</p>
      </header>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h3>{t('products.categories')}</h3>
            <Link
              href="/products"
              className={`${styles.filterItem} ${!categorySlug ? styles.active : ''}`}
            >
              {t('products.allProducts')}
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
              {t('products.error')}
            </div>
          ) : !products?.length ? (
            <div className={styles.empty}>
              {t('products.empty')}
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
                <span className={styles.pAction}>{t('products.viewDetails')}</span>
              </Link>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
