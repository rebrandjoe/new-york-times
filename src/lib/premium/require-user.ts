import { createClient } from "@/lib/supabase/server";

/** Any signed-in user (not admin-restricted) — used by checkout Server
 * Actions, which return an error object instead of redirecting so the
 * client can navigate to sign-in with the intended plan preserved. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}
