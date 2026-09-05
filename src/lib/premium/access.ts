import { createClient } from "@/lib/supabase/server";
import type { MySubscription, PaymentHistoryItem } from "./types";

/**
 * The single source of truth for premium access. Article rendering and
 * anything else that needs to know "can this reader see premium content"
 * must call this — never re-implement the check inline.
 */
export async function hasActivePremiumAccess(userId: string | null): Promise<boolean> {
  if (!userId) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .in("status", ["active", "trial"])
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return false;
  if (!data.current_period_end) return true;
  return new Date(data.current_period_end).getTime() > Date.now();
}

export function isSubscriptionCurrentlyActive(subscription: MySubscription | null): boolean {
  if (!subscription) return false;
  if (subscription.status !== "active" && subscription.status !== "trial") return false;
  if (!subscription.currentPeriodEnd) return true;
  return new Date(subscription.currentPeriodEnd).getTime() > Date.now();
}

export async function getMySubscription(userId: string): Promise<MySubscription | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select(
      "id, status, provider, current_period_start, current_period_end, cancel_at_period_end, plan:subscription_plans(name, billing_interval, price_usd, price_kes)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  const plan = data.plan as unknown as {
    name: string;
    billing_interval: string;
    price_usd: number;
    price_kes: number;
  } | null;

  return {
    id: data.id,
    status: data.status as MySubscription["status"],
    provider: data.provider as MySubscription["provider"],
    currentPeriodStart: data.current_period_start,
    currentPeriodEnd: data.current_period_end,
    cancelAtPeriodEnd: data.cancel_at_period_end,
    plan: {
      name: plan?.name ?? "—",
      billingInterval: (plan?.billing_interval as "monthly" | "annual") ?? "monthly",
      priceUsd: plan?.price_usd ?? 0,
      priceKes: plan?.price_kes ?? 0,
    },
  };
}

export async function getMyPaymentHistory(userId: string): Promise<PaymentHistoryItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("id, provider, method, amount, currency, status, created_at, provider_reference")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(25);

  return (data ?? []).map((row) => ({
    id: row.id,
    provider: row.provider as PaymentHistoryItem["provider"],
    method: row.method as PaymentHistoryItem["method"],
    amount: row.amount,
    currency: row.currency,
    status: row.status as PaymentHistoryItem["status"],
    createdAt: row.created_at,
    providerReference: row.provider_reference,
  }));
}
