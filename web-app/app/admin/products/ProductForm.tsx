'use client';

/**
 * Product Form Component
 * Reusable form for creating and editing products
 */
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Product, Category } from '@/types/database';
import Link from 'next/link';
import styles from '../components/AdminForm.module.css';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || '');
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [pdfUrl, setPdfUrl] = useState(product?.pdf_url || '');
  const [specs, setSpecs] = useState<string[]>(product?.specs || ['']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditing || slug === slugify(product?.name || '')) {
      setSlug(slugify(value));
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, '']);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index] = value;
    setSpecs(newSpecs);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setImageUrl(publicUrl);
    } catch (err) {
      setError(`Image upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    // Filter out empty specs
    const filteredSpecs = specs.filter((s) => s.trim() !== '');

    const productData = {
      name,
      slug,
      category_id: categoryId || null,
      description: description || null,
      image_url: imageUrl || null,
      pdf_url: pdfUrl || null,
      specs: filteredSpecs,
    };

    try {
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert(productData);

        if (insertError) throw insertError;
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.formError}>{error}</div>}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Product Name <span className={styles.required}>*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={styles.input}
            required
            placeholder="e.g., FP4ZSTxxTT2TSMT"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="slug" className={styles.label}>
            URL Slug <span className={styles.required}>*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={styles.input}
            required
            placeholder="auto-generated-from-name"
          />
          <p className={styles.hint}>Used in product URL: /products/{slug || 'slug'}</p>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={styles.select}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Product Image</label>
        <div
          className={styles.fileUpload}
          onClick={() => imageInputRef.current?.click()}
        >
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <p className={styles.fileUploadText}>
            {imageUploading ? (
              'Uploading...'
            ) : (
              <>
                <strong>Click to upload</strong> or drag and drop
              </>
            )}
          </p>
        </div>
        {imageUrl && (
          <div className={styles.preview}>
            <img src={imageUrl} alt="Preview" className={styles.previewImage} />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className={styles.removeBtn}
              style={{ marginLeft: '1rem' }}
            >
              Remove
            </button>
          </div>
        )}
        <p className={styles.hint}>Or paste an image URL directly:</p>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className={styles.input}
          placeholder="https://example.com/image.jpg"
          style={{ marginTop: '0.5rem' }}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="pdfUrl" className={styles.label}>
          PDF Spec Sheet URL
        </label>
        <input
          id="pdfUrl"
          type="url"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          className={styles.input}
          placeholder="https://example.com/specs.pdf"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Specifications</label>
        <div className={styles.specsList}>
          {specs.map((spec, index) => (
            <div key={index} className={styles.specItem}>
              <input
                type="text"
                value={spec}
                onChange={(e) => handleSpecChange(index, e.target.value)}
                className={styles.input}
                placeholder={`Spec ${index + 1} (e.g., "Voltage: 50V Max.")`}
              />
              {specs.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(index)}
                  className={styles.removeBtn}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddSpec} className={styles.addBtn}>
          + Add Specification
        </button>
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
          placeholder="Optional product description..."
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </button>
        <Link href="/admin/products" className={styles.cancelBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
