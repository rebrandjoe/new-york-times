import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/constants";

export { ADMIN_EMAIL };

/**
 * Defense-in-depth on top of RLS: every admin page/action calls this first.
 * RLS is the real authorization boundary (see the "Only the admin can
 * manage ..." policies), this just gives a clean redirect instead of a
 * confusing empty-data or permission-denied state in the UI.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/sign-in");
  }

  return { supabase, user };
}
