import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/constants";
import type { Json } from "@/lib/supabase/database.types";

export { ADMIN_EMAIL };

/** Records who did what to which record — required for publish/unpublish/
 * delete, comment moderation, and subscription changes. Uses the admin's
 * own authenticated session (satisfies the admin-only RLS insert policy),
 * not the service role. */
export async function logAdminAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  adminEmail: string,
  action: string,
  targetTable: string,
  targetId: string,
  metadata?: Record<string, unknown>
) {
  await supabase.from("admin_audit_log").insert({
    admin_email: adminEmail,
    action,
    target_table: targetTable,
    target_id: targetId,
    metadata: (metadata ?? null) as Json | null,
  });
}

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
    redirect("/sign-in?redirectTo=/admin");
  }

  return { supabase, user };
}
