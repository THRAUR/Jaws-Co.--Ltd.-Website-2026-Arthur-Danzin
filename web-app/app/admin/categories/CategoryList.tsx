'use client';

/**
 * Category List Component
 * Handles CRUD operations for categories with inline editing
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/types/database';
import styles from './page.module.css';

interface CategoryWithCount extends Category {
  product_count: number;
}

interface CategoryListProps {
  initialCategories: CategoryWithCount[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function CategoryList({ initialCategories }: CategoryListProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: newName.trim(),
        slug: slugify(newName),
        description: newDescription.trim() || null,
      })
      .select()
      .single();

    if (error) {
      alert(`Error adding category: ${error.message}`);
    } else if (data) {
      setCategories([...categories, { ...data, product_count: 0 }]);
      setNewName('');
      setNewDescription('');
    }

    setLoading(false);
  };

  const handleEdit = (category: CategoryWithCount) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || '');
  };

  const handleSaveEdit = async (id: string) => {
    const supabase = createClient();

    const { error } = await supabase
      .from('categories')
      .update({
        name: editName.trim(),
        slug: slugify(editName),
        description: editDescription.trim() || null,
      })
      .eq('id', id);

    if (error) {
      alert(`Error updating category: ${error.message}`);
    } else {
      setCategories(
        categories.map((cat) =>
          cat.id === id
            ? { ...cat, name: editName.trim(), slug: slugify(editName), description: editDescription.trim() || null }
            : cat
        )
      );
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string, productCount: number) => {
    if (productCount > 0) {
      alert(`Cannot delete category with ${productCount} products. Remove or reassign products first.`);
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;

    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      alert(`Error deleting category: ${error.message}`);
    } else {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div className={styles.card}>
      <form onSubmit={handleAdd} className={styles.addForm}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className={styles.input}
          placeholder="Category name"
          required
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className={styles.input}
          placeholder="Description (optional)"
        />
        <button type="submit" className={styles.addBtn} disabled={loading}>
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      {categories.length === 0 ? (
        <div className={styles.empty}>
          No categories yet. Add your first category above.
        </div>
      ) : (
        <ul className={styles.list}>
          {categories.map((category) => (
            <li key={category.id} className={styles.item}>
              {editingId === category.id ? (
                <>
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={styles.input}
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className={styles.input}
                      placeholder="Description"
                    />
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => handleSaveEdit(category.id)}
                      className={styles.saveBtn}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{category.name}</div>
                    <div className={styles.itemSlug}>
                      /{category.slug}
                      {category.description && ` • ${category.description}`}
                    </div>
                  </div>
                  <span className={styles.itemCount}>
                    {category.product_count} product{category.product_count !== 1 ? 's' : ''}
                  </span>
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => handleEdit(category)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.product_count)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
