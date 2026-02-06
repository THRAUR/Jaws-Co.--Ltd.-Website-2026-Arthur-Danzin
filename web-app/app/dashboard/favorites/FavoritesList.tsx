'use client';

/**
 * Favorites List Component
 * Handles display and removal of favorite products
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import styles from './FavoritesList.module.css';

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  specs: string[];
  category: { name: string; slug: string } | null;
}

interface Favorite {
  id: string;
  product_id: string;
  created_at: string;
  product: Product | null;
}

interface FavoritesListProps {
  favorites: Favorite[];
}

export default function FavoritesList({ favorites: initialFavorites }: FavoritesListProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = async (favoriteId: string) => {
    setRemoving(favoriteId);
    const supabase = createClient();

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);

    if (!error) {
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    }

    setRemoving(null);
    router.refresh();
  };

  return (
    <div className={styles.grid}>
      {favorites.map((favorite) => {
        const product = favorite.product;
        if (!product) return null;

        return (
          <div key={favorite.id} className={styles.card}>
            <Link href={`/products/${product.slug}`} className={styles.imageLink}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder}>No Image</div>
              )}
            </Link>

            <div className={styles.content}>
              {product.category && (
                <span className={styles.category}>{product.category.name}</span>
              )}
              <Link href={`/products/${product.slug}`}>
                <h3 className={styles.name}>{product.name}</h3>
              </Link>
              {product.specs && product.specs.length > 0 && (
                <p className={styles.specs}>
                  {product.specs.slice(0, 2).join(' • ')}
                </p>
              )}
            </div>

            <div className={styles.actions}>
              <Link href={`/products/${product.slug}`} className={styles.viewBtn}>
                View Product
              </Link>
              <button
                onClick={() => handleRemove(favorite.id)}
                className={styles.removeBtn}
                disabled={removing === favorite.id}
              >
                {removing === favorite.id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
