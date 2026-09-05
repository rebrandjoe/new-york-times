"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/premium/require-user";
import { getPlanBySlug } from "@/lib/premium/plans";
import { createServiceClient } from "@/lib/supabase/service";
import type { Json } from "@/lib/supabase/database.types";
import { initiateMpesaCharge, createStandardCheckout } from "@/lib/payments/flutterwave";
import { createOrder } from "@/lib/payments/paypal";

// Provider SDK response shapes are plain JSON-serializable objects but don't
// structurally satisfy Supabase's generated Json index-signature type.
function toJson(value: unknown): Json {
  return value as Json;
}

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

function txRefFor(userId: string) {
  return `sub_${userId.slice(0, 8)}_${Date.now()}`;
}

type CheckoutResult =
  | { error: "not_authenticated" }
  | { error: "plan_not_found" }
  | { error: "provider_error"; message: string }
  | { paymentId: string; status: "pending" | "processing" }
  | { paymentId: string; checkoutUrl: string };

const CONFIG_ERROR_MESSAGE = "Payments aren't fully set up yet. Please try again later.";

export async function initiateMpesaCheckout(planSlug: string, phoneNumber: string): Promise<CheckoutResult> {
  const { user } = await getCurrentUser();
  if (!user) return { error: "not_authenticated" };

  const plan = await getPlanBySlug(planSlug);
  if (!plan) return { error: "plan_not_found" };

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (err) {
    console.error(err);
    return { error: "provider_error", message: CONFIG_ERROR_MESSAGE };
  }

  const txRef = txRefFor(user.id);

  const { data: payment, error: insertError } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      plan_id: plan.id,
      provider: "flutterwave",
      method: "mpesa",
      provider_reference: txRef,
      amount: plan.priceKes,
      currency: "KES",
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !payment) {
    return { error: "provider_error", message: "Could not start the payment. Please try again." };
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined)?.trim() || user.email?.split("@")[0] || "Member";

  let charge;
  try {
    charge = await initiateMpesaCharge({
      txRef,
      amountKes: plan.priceKes,
      email: user.email ?? "",
      phoneNumber,
      fullName,
    });
  } catch (err) {
    console.error(err);
    await supabase.from("payments").update({ status: "failed" }).eq("id", payment.id);
    return { error: "provider_error", message: CONFIG_ERROR_MESSAGE };
  }

  if (charge.status !== "success") {
    await supabase.from("payments").update({ status: "failed", raw_response: toJson(charge) }).eq("id", payment.id);
    return { error: "provider_error", message: charge.message || "M-Pesa could not be reached. Please try again." };
  }

  await supabase.from("payments").update({ status: "processing", raw_response: toJson(charge) }).eq("id", payment.id);
  return { paymentId: payment.id, status: "processing" };
}

export async function initiateCardCheckout(planSlug: string): Promise<CheckoutResult> {
  const { user } = await getCurrentUser();
  if (!user) return { error: "not_authenticated" };

  const plan = await getPlanBySlug(planSlug);
  if (!plan) return { error: "plan_not_found" };

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (err) {
    console.error(err);
    return { error: "provider_error", message: CONFIG_ERROR_MESSAGE };
  }

  const txRef = txRefFor(user.id);

  const { data: payment, error: insertError } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      plan_id: plan.id,
      provider: "flutterwave",
      method: "card",
      provider_reference: txRef,
      amount: plan.priceUsd,
      currency: "USD",
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !payment) {
    return { error: "provider_error", message: "Could not start the payment. Please try again." };
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined)?.trim() || user.email?.split("@")[0] || "Member";

  let checkout;
  try {
    checkout = await createStandardCheckout({
      txRef,
      amountUsd: plan.priceUsd,
      email: user.email ?? "",
      fullName,
      redirectUrl: `${getSiteUrl()}/api/checkout/flutterwave/return`,
    });
  } catch (err) {
    console.error(err);
    await supabase.from("payments").update({ status: "failed" }).eq("id", payment.id);
    return { error: "provider_error", message: CONFIG_ERROR_MESSAGE };
  }

  if (checkout.status !== "success" || !checkout.data?.link) {
    await supabase.from("payments").update({ status: "failed", raw_response: toJson(checkout) }).eq("id", payment.id);
    return { error: "provider_error", message: checkout.message || "Card checkout could not be started." };
  }

  return { paymentId: payment.id, checkoutUrl: checkout.data.link };
}

export async function initiatePaypalCheckout(planSlug: string): Promise<CheckoutResult> {
  const { user } = await getCurrentUser();
  if (!user) return { error: "not_authenticated" };

  const plan = await getPlanBySlug(planSlug);
  if (!plan) return { error: "plan_not_found" };

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (err) {
    console.error(err);
    return { error: "provider_error", message: CONFIG_ERROR_MESSAGE };
  }

  const { data: payment, error: insertError } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      plan_id: plan.id,
      provider: "paypal",
      method: "paypal",
      provider_reference: `pending_${crypto.randomUUID()}`,
      amount: plan.priceUsd,
      currency: "USD",
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !payment) {
    return { error: "provider_error", message: "Could not start the payment. Please try again." };
  }

  let order;
  try {
    order = await createOrder({
      referenceId: payment.id,
      amountUsd: plan.priceUsd,
      returnUrl: `${getSiteUrl()}/api/checkout/paypal/return?payment_id=${payment.id}`,
      cancelUrl: `${getSiteUrl()}/premium?cancelled=1`,
    });
  } catch (err) {
    console.error(err);
    await supabase.from("payments").update({ status: "failed" }).eq("id", payment.id);
    return { error: "provider_error", message: CONFIG_ERROR_MESSAGE };
  }

  const approveLink = order.links?.find((link) => link.rel === "approve")?.href;
  if (!order.id || !approveLink) {
    await supabase.from("payments").update({ status: "failed", raw_response: toJson(order) }).eq("id", payment.id);
    return { error: "provider_error", message: "PayPal checkout could not be started." };
  }

  await supabase.from("payments").update({ provider_reference: order.id }).eq("id", payment.id);
  return { paymentId: payment.id, checkoutUrl: approveLink };
}

export async function checkPaymentStatus(paymentId: string) {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: "not_authenticated" as const };

  const { data } = await supabase
    .from("payments")
    .select("status, subscription_id")
    .eq("id", paymentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return { error: "not_found" as const };
  return { status: data.status, activated: !!data.subscription_id };
}

export async function cancelRenewal(): Promise<{ ok: true } | { error: string }> {
  const { user, supabase: readClient } = await getCurrentUser();
  if (!user) return { error: "You need to sign in first." };

  const { data: subscription } = await readClient
    .from("subscriptions")
    .select("id, user_id, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!subscription || subscription.user_id !== user.id) {
    return { error: "No active subscription found." };
  }

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (err) {
    console.error(err);
    return { error: CONFIG_ERROR_MESSAGE };
  }

  await supabase.from("subscriptions").update({ cancel_at_period_end: true }).eq("id", subscription.id);
  await supabase.from("subscription_history").insert({
    subscription_id: subscription.id,
    user_id: user.id,
    event: "cancelled",
    previous_status: subscription.status,
    new_status: subscription.status,
    note: "Renewal cancelled by member — access continues until the paid period ends.",
    actor: user.email ?? "user",
  });

  revalidatePath("/account");
  return { ok: true };
}
