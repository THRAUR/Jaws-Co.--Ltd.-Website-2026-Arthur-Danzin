'use client';

/**
 * Admin Products Page Content
 * Client component for translated products list
 */
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';
import { DeleteProductButton } from './DeleteProductButton';
import styles from './page.module.css';
import tableStyles from '../components/AdminTable.module.css';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  category: Category | null;
  specs: unknown[] | null;
}

interface ProductsPageContentProps {
  products: Product[] | null;
  categories: Category[] | null;
  count: number;
  error: string | null;
  search: string;
  categoryFilter: string;
  page: number;
  totalPages: number;
}

export default function ProductsPageContent({
  products,
  categories,
  count,
  error,
  search,
  categoryFilter,
  page,
  totalPages,
}: ProductsPageContentProps) {
  const t = useTranslation();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('admin.products.title')}</h1>
          <p className={styles.subtitle}>{count || 0} {t('admin.products.subtitle')}</p>
        </div>
        <Link href="/admin/products/new" className={styles.addBtn}>
          {t('admin.products.addNew')}
        </Link>
      </header>

      <div className={styles.filters}>
        <form className={styles.searchForm}>
          <input
            type="search"
            name="search"
            placeholder={t('admin.products.search')}
            defaultValue={search}
            className={styles.searchInput}
          />
          <select
            name="category"
            defaultValue={categoryFilter}
            className={styles.filterSelect}
          >
            <option value="">{t('admin.products.allCategories')}</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.searchBtn}>
            {t('admin.products.filter')}
          </button>
        </form>
      </div>

      <div className={tableStyles.tableContainer}>
        {error ? (
          <div className={tableStyles.empty}>
            {t('common.error')}: {error}
          </div>
        ) : !products?.length ? (
          <div className={tableStyles.empty}>
            {t('admin.products.empty')}{' '}
            <Link href="/admin/products/new">{t('admin.products.addFirst')}</Link>
          </div>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>{t('admin.products.image')}</th>
                <th>{t('admin.products.name')}</th>
                <th>{t('admin.products.category')}</th>
                <th>{t('admin.products.specs')}</th>
                <th>{t('admin.products.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className={tableStyles.thumbnail}
                      />
                    ) : (
                      <div className={tableStyles.thumbnail} />
                    )}
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{product.slug}</small>
                  </td>
                  <td>
                    {product.category ? (
                      <span className={styles.categoryBadge}>
                        {product.category.name}
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>{t('admin.products.uncategorized')}</span>
                    )}
                  </td>
                  <td>{product.specs?.length || 0} {t('admin.products.specs')}</td>
                  <td>
                    <div className={tableStyles.actions}>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className={tableStyles.editBtn}
                      >
                        {t('admin.products.edit')}
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className={tableStyles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/products?page=${p}${search ? `&search=${search}` : ''}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                className={`${tableStyles.pageBtn} ${p === page ? tableStyles.active : ''}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
