/**
 * Migration Script: Import products.json into Supabase
 *
 * Usage: npm run migrate
 *
 * Prerequisites:
 * 1. Run supabase-schema.sql in Supabase SQL Editor first
 * 2. Set environment variables in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface OldProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  specs: string[];
  url: string;
}

/**
 * Converts a string to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Normalizes category names (e.g., "0 5  Mm" -> "0.5mm")
 */
function normalizeCategory(category: string): { name: string; slug: string } {
  // Handle the various category formats
  const cleaned = category.trim();

  // Map of old category names to normalized versions
  const categoryMap: Record<string, { name: string; slug: string }> = {
    '0 5  Mm': { name: '0.5mm Pitch', slug: '0-5mm' },
    '1 0  Mm': { name: '1.0mm Pitch', slug: '1-0mm' },
    '1 25  Mm': { name: '1.25mm Pitch', slug: '1-25mm' },
    '1 27  Mm': { name: '1.27mm Pitch', slug: '1-27mm' },
    '1 27X1 27  Mm': { name: '1.27x1.27mm Pitch', slug: '1-27x1-27mm' },
    '1 27X2 54  Mm': { name: '1.27x2.54mm Pitch', slug: '1-27x2-54mm' },
    '1 5  Mm': { name: '1.5mm Pitch', slug: '1-5mm' },
    '2 0  Mm': { name: '2.0mm Pitch', slug: '2-0mm' },
    '2 16  Mm': { name: '2.16mm Pitch', slug: '2-16mm' },
    '2 29  Mm': { name: '2.29mm Pitch', slug: '2-29mm' },
    '2 54  Mm': { name: '2.54mm Pitch', slug: '2-54mm' },
    '2 77  Mm': { name: '2.77mm Pitch', slug: '2-77mm' },
    '3 96  Mm': { name: '3.96mm Pitch', slug: '3-96mm' },
    'FPC / FFC': { name: 'FPC/FFC Connectors', slug: 'fpc-ffc' },
    'Wire To Board Connector(NEW)': { name: 'Wire-to-Board Connectors', slug: 'wire-to-board' },
    'M5': { name: 'M5 Series', slug: 'm5' },
    'M9': { name: 'M9 Series', slug: 'm9' },
    'Mini Usb': { name: 'Mini USB', slug: 'mini-usb' },
    'Usb': { name: 'USB', slug: 'usb' },
  };

  return categoryMap[cleaned] || {
    name: cleaned,
    slug: slugify(cleaned),
  };
}

async function migrate() {
  console.log('Starting migration...\n');

  // Read products.json
  const productsPath = path.join(__dirname, '../data/products.json');
  const productsData = fs.readFileSync(productsPath, 'utf-8');
  const oldProducts: OldProduct[] = JSON.parse(productsData);

  console.log(`Found ${oldProducts.length} products to migrate\n`);

  // Step 1: Extract and insert unique categories
  console.log('Step 1: Migrating categories...');
  const uniqueCategories = [...new Set(oldProducts.map(p => p.category))];
  const categoryMap = new Map<string, string>(); // old name -> new UUID

  for (const oldCategory of uniqueCategories) {
    const normalized = normalizeCategory(oldCategory);

    const { data, error } = await supabase
      .from('categories')
      .upsert(
        {
          name: normalized.name,
          slug: normalized.slug,
          description: `${normalized.name} connector series`,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (error) {
      console.error(`  Error inserting category "${oldCategory}":`, error.message);
    } else {
      categoryMap.set(oldCategory, data.id);
      console.log(`  ✓ ${oldCategory} -> ${normalized.name}`);
    }
  }

  console.log(`\nMigrated ${categoryMap.size} categories\n`);

  // Step 2: Insert products
  console.log('Step 2: Migrating products...');
  let successCount = 0;
  let errorCount = 0;

  for (const product of oldProducts) {
    const categoryId = categoryMap.get(product.category);
    const productSlug = slugify(product.id);

    const { error } = await supabase.from('products').upsert(
      {
        name: product.name,
        slug: productSlug,
        category_id: categoryId || null,
        specs: product.specs,
        image_url: product.image,
        original_id: product.id,
        description: null,
        pdf_url: null,
      },
      { onConflict: 'slug' }
    );

    if (error) {
      console.error(`  ✗ Error inserting "${product.id}":`, error.message);
      errorCount++;
    } else {
      successCount++;
      if (successCount % 20 === 0) {
        console.log(`  Migrated ${successCount} products...`);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Migration Complete!`);
  console.log(`  ✓ Categories: ${categoryMap.size}`);
  console.log(`  ✓ Products: ${successCount}`);
  if (errorCount > 0) {
    console.log(`  ✗ Errors: ${errorCount}`);
  }
  console.log(`========================================\n`);
}

// Run migration
migrate().catch(console.error);
