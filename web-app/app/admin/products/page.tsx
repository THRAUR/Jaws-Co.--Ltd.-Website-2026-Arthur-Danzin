/**
 * Admin Products List Page
 * View, search, and manage all products
 */
import { createClient } from '@/lib/supabase/server';
import ProductsPageContent from './ProductsPageContent';

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
    <ProductsPageContent
      products={products}
      categories={categories}
      count={count || 0}
      error={error?.message || null}
      search={search}
      categoryFilter={categoryFilter}
      page={page}
      totalPages={totalPages}
    />
  );
}
