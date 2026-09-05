import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * A cookie-free client for public, unauthenticated reads (published
 * articles, categories, topics, the live ticker). Unlike the cookie-based
 * server client, this doesn't call cookies() internally, so pages that only
 * need public data can stay statically rendered / ISR instead of being
 * forced into per-request dynamic rendering.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
