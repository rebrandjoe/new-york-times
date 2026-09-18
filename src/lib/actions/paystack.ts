"use server";

import { getCurrentUser } from "@/lib/premium/require-user";
import { getPlanBySlug } from "@/lib/premium/plans";
import { createServiceClient } from "@/lib/supabase/service";
import type { Json } from "@/lib/supabase/database.types";

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

type PaystackInitResult =
  | { error: "not_authenticated" }
  | { error: "plan_not_found" }
  | { error: "provider_error"; message: string }
  | { authorizationUrl: string; reference: string; paymentId: string };

const CONFIG_ERROR_MESSAGE = "Payments aren't fully set up yet. Please try again later.";

/**
 * Initialize a Paystack checkout for an existing subscription plan.
 *
 * Security model:
 * - Client may only send a plan slug (never an amount).
 * - Server loads the active plan from the database and uses its authoritative KES price.
 * - A payments row is created first (pending) so webhook/callback can resolve user + plan.
 * - Paystack is initialized with the DB amount only; client amount is never trusted.
 */
export async function initializePaystackTransaction(params: {
  planSlug: string;
}): Promise<PaystackInitResult> {
  const { user } = await getCurrentUser();
  if (!user || !user.email) return { error: "not_authenticated" };

  const plan = await getPlanBySlug(params.planSlug);
  if (!plan) return { error: "plan_not_found" };

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return { error: "provider_error", message: CONFIG_ERROR_MESSAGE };
  }

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (err) {
    console.error("[paystack] service client unavailable");
    return { error: "provider_error", message: CONFIG_ERROR_MESSAGE };
  }

  // Cryptographically unique reference that maps back to our payment row.
  const reference = `psk_${crypto.randomUUID().replace(/-/g, "")}`;

  const { data: payment, error: insertError } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      plan_id: plan.id,
      provider: "paystack",
      method: "mpesa", // Paystack channels include mobile_money + card; method is informational
      provider_reference: reference,
      amount: plan.priceKes,
      currency: "KES",
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !payment) {
    console.error("[paystack] payment insert failed", insertError?.message);
    return { error: "provider_error", message: "Could not start the payment. Please try again." };
  }

  const siteUrl = getSiteUrl();

  let data: {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string; access_code?: string };
  };

  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(Number(plan.priceKes) * 100), // KES minor units
        currency: "KES",
        reference,
        channels: ["mobile_money", "card"],
        callback_url: `${siteUrl}/api/paystack/callback`,
        metadata: {
          payment_id: payment.id,
          user_id: user.id,
          plan_id: plan.id,
          plan_slug: plan.slug,
        },
      }),
    });

    data = await response.json();
  } catch (err) {
    console.error("[paystack] initialize network error");
    await supabase.from("payments").update({ status: "failed" }).eq("id", payment.id);
    return { error: "provider_error", message: CONFIG_ERROR_MESSAGE };
  }

  if (!data.status || !data.data?.authorization_url) {
    await supabase
      .from("payments")
      .update({ status: "failed", raw_response: toJson(data) })
      .eq("id", payment.id);
    return {
      error: "provider_error",
      message: data.message || "Failed to initialize Paystack transaction.",
    };
  }

  await supabase
    .from("payments")
    .update({ status: "processing", raw_response: toJson(data) })
    .eq("id", payment.id);

  return {
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference ?? reference,
    paymentId: payment.id,
  };
}
