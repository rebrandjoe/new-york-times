"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { createServiceClient, isServiceRoleConfigured } from "@/lib/supabase/service";
import type { PaymentStatus, SubscriptionStatus } from "@/lib/premium/types";

export interface AdminSubscriptionRow {
  id: string;
  userId: string;
  userEmail: string;
  planName: string;
  status: SubscriptionStatus;
  provider: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

async function lookupEmails(userIds: string[]): Promise<Map<string, string>> {
  const service = createServiceClient();
  const unique = [...new Set(userIds)];
  const results = await Promise.all(
    unique.map(async (id) => {
      const { data } = await service.auth.admin.getUserById(id);
      return [id, data.user?.email ?? "—"] as const;
    })
  );
  return new Map(results);
}

export async function getSubscriptionStats() {
  await requireAdmin();

  if (!isServiceRoleConfigured()) {
    return {
      configured: false,
      active: 0,
      expired: 0,
      cancelled: 0,
      pendingPayments: 0,
      failedPayments: 0,
      revenueByCurrency: {} as Record<string, number>,
    };
  }

  const service = createServiceClient();

  const [active, expired, cancelled, pendingPayments, failedPayments, revenue] = await Promise.all([
    service.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    service.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "expired"),
    service.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "cancelled"),
    service.from("payments").select("id", { count: "exact", head: true }).in("status", ["pending", "processing"]),
    service.from("payments").select("id", { count: "exact", head: true }).eq("status", "failed"),
    service.from("payments").select("amount, currency").eq("status", "successful"),
  ]);

  const revenueByCurrency = new Map<string, number>();
  for (const row of revenue.data ?? []) {
    revenueByCurrency.set(row.currency, (revenueByCurrency.get(row.currency) ?? 0) + Number(row.amount));
  }

  return {
    configured: true,
    active: active.count ?? 0,
    expired: expired.count ?? 0,
    cancelled: cancelled.count ?? 0,
    pendingPayments: pendingPayments.count ?? 0,
    failedPayments: failedPayments.count ?? 0,
    revenueByCurrency: Object.fromEntries(revenueByCurrency),
  };
}

export async function listSubscriptionsAdmin(filters: { status?: string; search?: string } = {}): Promise<
  AdminSubscriptionRow[]
> {
  await requireAdmin();
  if (!isServiceRoleConfigured()) return [];

  const service = createServiceClient();

  let query = service
    .from("subscriptions")
    .select("id, user_id, status, provider, current_period_end, cancel_at_period_end, created_at, plan:subscription_plans(name)")
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);

  const { data } = await query;
  const rows = data ?? [];

  const emails = await lookupEmails(rows.map((r) => r.user_id));

  const mapped: AdminSubscriptionRow[] = rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    userEmail: emails.get(row.user_id) ?? "—",
    planName: (row.plan as unknown as { name: string } | null)?.name ?? "—",
    status: row.status as SubscriptionStatus,
    provider: row.provider,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end,
    createdAt: row.created_at,
  }));

  if (filters.search) {
    const term = filters.search.toLowerCase();
    return mapped.filter((row) => row.userEmail.toLowerCase().includes(term));
  }

  return mapped;
}

export interface AdminSubscriptionDetail extends AdminSubscriptionRow {
  currentPeriodStart: string | null;
  payments: {
    id: string;
    provider: string;
    method: string | null;
    amount: number;
    currency: string;
    status: PaymentStatus;
    providerReference: string;
    createdAt: string;
  }[];
  history: {
    id: string;
    event: string;
    previousStatus: string | null;
    newStatus: string | null;
    note: string | null;
    actor: string;
    createdAt: string;
  }[];
}

export async function getSubscriptionDetail(subscriptionId: string): Promise<AdminSubscriptionDetail | null> {
  await requireAdmin();
  if (!isServiceRoleConfigured()) return null;

  const service = createServiceClient();

  const { data: subscription } = await service
    .from("subscriptions")
    .select(
      "id, user_id, status, provider, current_period_start, current_period_end, cancel_at_period_end, created_at, plan:subscription_plans(name)"
    )
    .eq("id", subscriptionId)
    .maybeSingle();

  if (!subscription) return null;

  const [{ data: payments }, { data: history }, emails] = await Promise.all([
    service
      .from("payments")
      .select("id, provider, method, amount, currency, status, provider_reference, created_at")
      .eq("subscription_id", subscriptionId)
      .order("created_at", { ascending: false }),
    service
      .from("subscription_history")
      .select("id, event, previous_status, new_status, note, actor, created_at")
      .eq("subscription_id", subscriptionId)
      .order("created_at", { ascending: false }),
    lookupEmails([subscription.user_id]),
  ]);

  return {
    id: subscription.id,
    userId: subscription.user_id,
    userEmail: emails.get(subscription.user_id) ?? "—",
    planName: (subscription.plan as unknown as { name: string } | null)?.name ?? "—",
    status: subscription.status as SubscriptionStatus,
    provider: subscription.provider,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    createdAt: subscription.created_at,
    payments: (payments ?? []).map((p) => ({
      id: p.id,
      provider: p.provider,
      method: p.method,
      amount: p.amount,
      currency: p.currency,
      status: p.status as PaymentStatus,
      providerReference: p.provider_reference,
      createdAt: p.created_at,
    })),
    history: (history ?? []).map((h) => ({
      id: h.id,
      event: h.event,
      previousStatus: h.previous_status,
      newStatus: h.new_status,
      note: h.note,
      actor: h.actor,
      createdAt: h.created_at,
    })),
  };
}

export async function adjustSubscriptionStatus(
  subscriptionId: string,
  newStatus: SubscriptionStatus,
  reason: string
): Promise<{ ok: true } | { error: string }> {
  const { user } = await requireAdmin();
  if (!reason.trim()) return { error: "A reason is required for every manual adjustment." };
  if (!isServiceRoleConfigured()) return { error: "Payments aren't fully set up yet." };

  const service = createServiceClient();
  const { data: current } = await service
    .from("subscriptions")
    .select("status, user_id")
    .eq("id", subscriptionId)
    .maybeSingle();

  if (!current) return { error: "Subscription not found." };

  await service
    .from("subscriptions")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", subscriptionId);

  await service.from("subscription_history").insert({
    subscription_id: subscriptionId,
    user_id: current.user_id,
    event: "admin_adjusted",
    previous_status: current.status,
    new_status: newStatus,
    note: reason,
    actor: user.email ?? "admin",
  });

  await service.from("admin_audit_log").insert({
    admin_email: user.email ?? "admin",
    action: "adjust_subscription_status",
    target_table: "subscriptions",
    target_id: subscriptionId,
    reason,
    metadata: { previous_status: current.status, new_status: newStatus },
  });

  revalidatePath("/admin/subscriptions");
  revalidatePath(`/admin/subscriptions/${subscriptionId}`);
  return { ok: true };
}
