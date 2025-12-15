import { createBrowserClient } from "@supabase/ssr";

// Fallback values for build time (will be replaced at runtime)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

/**
 * Creates a Supabase client for use in the browser (Client Components)
 * This client handles session persistence automatically via cookies
 * 
 * Note: Uses placeholder values during build time to prevent errors.
 * Real values are used at runtime when env vars are available.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
