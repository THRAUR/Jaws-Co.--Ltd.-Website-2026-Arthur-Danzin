/**
 * Admin Products List Page
 * View, search, and manage all products
 */
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DeleteProductButton } from './DeleteProductButton';
import styles from './page.module.css';
import tableStyles from '../components/AdminTable.module.css';

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
}

const ITEMS_PER_PAGE = 20;

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const categoryFilter = params.category || '';

  // Build query
  let query = supabase
    .from('products')
    .select('*, category:categories(id, name)', { count: 'exact' });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (categoryFilter) {
    query = query.eq('category_id', categoryFilter);
  }

  // Pagination
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: products, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  // Get categories for filter dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>{count || 0} products in catalog</p>
        </div>
        <Link href="/admin/products/new" className={styles.addBtn}>
          Add Product
        </Link>
      </header>

      <div className={styles.filters}>
        <form className={styles.searchForm}>
          <input
            type="search"
            name="search"
            placeholder="Search products..."
            defaultValue={search}
            className={styles.searchInput}
          />
          <select
            name="category"
            defaultValue={categoryFilter}
            className={styles.filterSelect}
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.searchBtn}>
            Filter
          </button>
        </form>
      </div>

      <div className={tableStyles.tableContainer}>
        {error ? (
          <div className={tableStyles.empty}>
            Error loading products: {error.message}
          </div>
        ) : !products?.length ? (
          <div className={tableStyles.empty}>
            No products found.{' '}
            <Link href="/admin/products/new">Add your first product</Link>
          </div>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Specs</th>
                <th>Actions</th>
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
                      <span style={{ color: '#999' }}>Uncategorized</span>
                    )}
                  </td>
                  <td>{product.specs?.length || 0} specs</td>
                  <td>
                    <div className={tableStyles.actions}>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className={tableStyles.editBtn}
                      >
                        Edit
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
