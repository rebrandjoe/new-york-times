import { createServiceClient } from "@/lib/supabase/service";
import type { Json } from "@/lib/supabase/database.types";
import { sendTransactionalEmail } from "@/lib/email/send";
import { subscriptionActivatedEmail } from "@/lib/email/templates";
import type { PaymentProvider } from "./types";

/**
 * Records a provider webhook/event exactly once. Relies on the database's
 * unique (provider, provider_event_id) constraint as the idempotency guard:
 * if the insert conflicts, this event was already handled and must not be
 * processed again (no duplicate activation, no double-extended period).
 */
export async function recordPaymentEventOnce(params: {
  provider: string;
  eventType: string;
  providerEventId: string | null;
  payload: unknown;
  paymentId?: string | null;
}): Promise<{ alreadyProcessed: boolean }> {
  const supabase = createServiceClient();

  if (!params.providerEventId) {
    // No stable id to dedupe on — log it, but treat as new since we can't tell.
    await supabase.from("payment_events").insert({
      provider: params.provider,
      event_type: params.eventType,
      payload: params.payload as Json,
      payment_id: params.paymentId ?? null,
      processed_at: new Date().toISOString(),
    });
    return { alreadyProcessed: false };
  }

  const { error } = await supabase.from("payment_events").insert({
    provider: params.provider,
    event_type: params.eventType,
    provider_event_id: params.providerEventId,
    payload: params.payload as Json,
    payment_id: params.paymentId ?? null,
    processed_at: new Date().toISOString(),
  });

  // Postgres unique_violation
  if (error && error.code === "23505") {
    return { alreadyProcessed: true };
  }
  return { alreadyProcessed: false };
}

function addInterval(from: Date, interval: "monthly" | "annual"): Date {
  const next = new Date(from);
  if (interval === "monthly") next.setMonth(next.getMonth() + 1);
  else next.setFullYear(next.getFullYear() + 1);
  return next;
}

/**
 * Activates or renews the user's subscription after a payment has already
 * been independently verified against the provider's own API. Idempotent
 * per payment: calling this twice for the same payment id is a no-op the
 * second time.
 */
export async function activateSubscriptionForPayment(params: {
  userId: string;
  planId: string;
  billingInterval: "monthly" | "annual";
  provider: PaymentProvider;
  paymentId: string;
}): Promise<string> {
  const supabase = createServiceClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("subscription_id, status")
    .eq("id", params.paymentId)
    .maybeSingle();

  if (payment?.subscription_id) {
    // Already activated by an earlier delivery of this same payment.
    return payment.subscription_id;
  }

  const now = new Date();
  const { data: current } = await supabase
    .from("subscriptions")
    .select("id, status, current_period_end")
    .eq("user_id", params.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const stillWithinPaidPeriod =
    !!current?.current_period_end && new Date(current.current_period_end).getTime() > now.getTime();
  const periodStart = stillWithinPaidPeriod ? new Date(current!.current_period_end!) : now;
  const periodEnd = addInterval(periodStart, params.billingInterval);

  let subscriptionId: string;

  if (current) {
    subscriptionId = current.id;
    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        provider: params.provider,
        plan_id: params.planId,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        updated_at: now.toISOString(),
      })
      .eq("id", subscriptionId);

    await supabase.from("subscription_history").insert({
      subscription_id: subscriptionId,
      user_id: params.userId,
      event: stillWithinPaidPeriod ? "renewed" : "reactivated",
      previous_status: current.status,
      new_status: "active",
      actor: "system",
    });
  } else {
    const { data: created, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: params.userId,
        plan_id: params.planId,
        status: "active",
        provider: params.provider,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
      })
      .select("id")
      .single();

    if (error || !created) {
      throw new Error(`Failed to create subscription: ${error?.message ?? "unknown error"}`);
    }
    subscriptionId = created.id;

    await supabase.from("subscription_history").insert({
      subscription_id: subscriptionId,
      user_id: params.userId,
      event: "created",
      new_status: "active",
      actor: "system",
    });
  }

  await supabase
    .from("payments")
    .update({ subscription_id: subscriptionId, updated_at: now.toISOString() })
    .eq("id", params.paymentId);

  const [{ data: userLookup }, { data: plan }] = await Promise.all([
    supabase.auth.admin.getUserById(params.userId),
    supabase.from("subscription_plans").select("name").eq("id", params.planId).maybeSingle(),
  ]);

  if (userLookup.user?.email) {
    const email = subscriptionActivatedEmail({
      planName: plan?.name ?? "JOSEPH MMWA Premium",
      renewsOn: periodEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    });
    await sendTransactionalEmail({ to: userLookup.user.email, ...email });
  }

  return subscriptionId;
}

export async function notifyPaymentFailed(userId: string, planId: string) {
  const supabase = createServiceClient();
  const [{ data: userLookup }, { data: plan }] = await Promise.all([
    supabase.auth.admin.getUserById(userId),
    supabase.from("subscription_plans").select("name").eq("id", planId).maybeSingle(),
  ]);

  if (!userLookup.user?.email) return;
  const { paymentFailedEmail } = await import("@/lib/email/templates");
  const email = paymentFailedEmail({ planName: plan?.name ?? "JOSEPH MMWA Premium" });
  await sendTransactionalEmail({ to: userLookup.user.email, ...email });
}

export async function markPaymentStatus(
  paymentId: string,
  status: "processing" | "successful" | "failed" | "cancelled" | "expired",
  extra?: { providerTransactionId?: string; rawResponse?: unknown }
) {
  const supabase = createServiceClient();
  await supabase
    .from("payments")
    .update({
      status,
      provider_transaction_id: extra?.providerTransactionId,
      raw_response: (extra?.rawResponse as Json) ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);
}
