/**
 * Database types for Supabase PostgreSQL schema
 * Matches the architecture blueprint tables
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  specs: string[];
  image_url: string | null;
  pdf_url: string | null;
  description: string | null;
  original_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category: Category | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  inquiry_type: 'rfq' | 'sample' | 'oem' | 'technical';
  message: string;
  created_at: string;
  is_read: boolean;
}

/**
 * Form input types for creating/updating records
 */
export interface ProductInput {
  name: string;
  slug: string;
  category_id: string;
  specs: string[];
  image_url?: string | null;
  pdf_url?: string | null;
  description?: string | null;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string | null;
}

export interface NewsArticleInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  is_published: boolean;
  published_at?: string | null;
}

export interface InquiryInput {
  name: string;
  email: string;
  inquiry_type: 'rfq' | 'sample' | 'oem' | 'technical';
  message: string;
}

/**
 * Supabase Database type definition
 * Required format for typed Supabase client
 */
export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'> & { id?: string };
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
        Relationships: [];
      };
      news: {
        Row: NewsArticle;
        Insert: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      inquiries: {
        Row: Inquiry;
        Insert: Omit<Inquiry, 'id' | 'created_at' | 'is_read'> & { id?: string; is_read?: boolean };
        Update: Partial<Omit<Inquiry, 'id' | 'created_at'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
