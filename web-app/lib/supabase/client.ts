/**
 * Supabase browser client
 * Use this in client components for auth and data fetching
 */
import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for browser-side operations
 * Automatically handles cookie-based auth sessions
 *
 * Note: Untyped client for flexibility. Use server client for typed operations.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
