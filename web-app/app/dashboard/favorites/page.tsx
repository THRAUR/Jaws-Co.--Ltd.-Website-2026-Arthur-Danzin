/**
 * Favorites Page
 * View and manage favorite products
 */
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from '../page.module.css';
import FavoritesList from './FavoritesList';

export const metadata = {
  title: 'My Favorites | Jaws Co., Ltd.',
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: rawFavorites } = await supabase
    .from('favorites')
    .select(`
      id,
      product_id,
      created_at,
      product:products(id, name, slug, image_url, specs, category:categories(name, slug))
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Transform data to handle Supabase array return format
  const favorites = rawFavorites?.map((fav) => ({
    ...fav,
    product: Array.isArray(fav.product) ? fav.product[0] : fav.product,
  }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>My Favorites</h1>
        <p>Products you&apos;ve saved for quick access</p>
      </header>

      {favorites && favorites.length > 0 ? (
        <FavoritesList favorites={favorites as any} />
      ) : (
        <div className={styles.section}>
          <div className={styles.emptyState}>
            <p>You haven&apos;t saved any products yet.</p>
            <Link href="/products" className={styles.ctaBtn}>
              Browse Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
