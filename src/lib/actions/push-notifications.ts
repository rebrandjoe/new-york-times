"use server";

import { createPublicClient } from "@/lib/supabase/public";

export async function subscribeToPush(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}): Promise<{ ok: true } | { error: string }> {
  const supabase = createPublicClient();
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    console.error("[push] subscribe failed:", error.message);
    return { error: "Could not save subscription." };
  }
  return { ok: true };
}

export async function unsubscribeFromPush(endpoint: string): Promise<{ ok: true } | { error: string }> {
  const supabase = createPublicClient();
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) {
    console.error("[push] unsubscribe failed:", error.message);
    return { error: "Could not remove subscription." };
  }
  return { ok: true };
}
