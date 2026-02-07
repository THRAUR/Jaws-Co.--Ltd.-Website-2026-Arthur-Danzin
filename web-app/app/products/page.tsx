/**
 * Public Products Page
 * Browse products with category filtering
 * Fetches data from Supabase instead of static JSON
 */
import { createClient } from '@/lib/supabase/server';
import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'Jaws Co., Ltd. - Product Catalog',
  description: 'View our complete catalog of FFC/FPC and Wire-to-Board connectors.',
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

  return (
    <ProductsClient
      categories={categories || null}
      products={products}
      categorySlug={categorySlug}
      selectedCategoryName={selectedCategory?.name}
      error={!!error}
    />
  );
}
