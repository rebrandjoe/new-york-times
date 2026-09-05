import { createPublicClient } from "@/lib/supabase/public";
import type { SubscriptionPlan } from "./types";

interface RawPlanRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_usd: number;
  price_kes: number;
  billing_interval: string;
  benefits: unknown;
  discount_label: string | null;
  sort_order: number;
}

function mapPlan(row: RawPlanRow): SubscriptionPlan {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceUsd: row.price_usd,
    priceKes: row.price_kes,
    billingInterval: row.billing_interval as "monthly" | "annual",
    benefits: Array.isArray(row.benefits) ? (row.benefits as string[]) : [],
    discountLabel: row.discount_label,
    sortOrder: row.sort_order,
  };
}

export async function getActivePlans(): Promise<SubscriptionPlan[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("subscription_plans")
    .select("id, slug, name, description, price_usd, price_kes, billing_interval, benefits, discount_label, sort_order")
    .eq("is_active", true)
    .order("sort_order");

  return (data ?? []).map(mapPlan);
}

export async function getPlanBySlug(slug: string): Promise<SubscriptionPlan | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("subscription_plans")
    .select("id, slug, name, description, price_usd, price_kes, billing_interval, benefits, discount_label, sort_order")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  return data ? mapPlan(data) : null;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
}
