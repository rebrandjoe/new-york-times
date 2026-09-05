import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Service-role client — bypasses RLS entirely. Never import this into any
 * code path reachable directly from a user's own request; use it only
 * after a payment has been independently verified against the provider's
 * own API (webhook handlers, server-verified checkout callbacks). The key
 * must only ever exist as a server-side environment variable.
 */
export function isServiceRoleConfigured(): boolean {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set — required for trusted, server-verified writes (payment activation)."
    );
  }

  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
