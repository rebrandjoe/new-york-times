"use server";

import { randomUUID } from "node:crypto";
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

type PaystackMethod = "mpesa" | "card";

type PaystackInitResult =
  | { error: "not_authenticated" }
  | { error: "plan_not_found" }
  | { error: "provider_error"; message: string }
  | { authorizationUrl: string; reference: string; paymentId: string };

const ALLOWED_METHODS = new Set<PaystackMethod>(["mpesa", "card"]);

/**
 * Initialize a Paystack checkout for an existing subscription plan.
 *
 * Security model:
 * - Client may only send planSlug + optional method (never an amount).
 * - Server loads the active plan from the database and uses its authoritative KES price.
 * - A payments row is created first (pending) so webhook/callback can resolve user + plan.
 * - Paystack is initialized with the DB amount only; client amount is never trusted.
 */
export async function initializePaystackTransaction(params: {
  planSlug: string;
  /** Informational method stored on the payment row. Defaults to mpesa. */
  method?: PaystackMethod;
}): Promise<PaystackInitResult> {
  try {
    if (!params?.planSlug || typeof params.planSlug !== "string") {
      return { error: "plan_not_found" };
    }

    const planSlug = params.planSlug.trim();
    if (!planSlug) return { error: "plan_not_found" };

    const method: PaystackMethod =
      params.method && ALLOWED_METHODS.has(params.method) ? params.method : "mpesa";

    let user;
    try {
      const current = await getCurrentUser();
      user = current.user;
    } catch (err) {
      console.error("[paystack] getCurrentUser failed", err);
      return { error: "not_authenticated" };
    }

    if (!user || !user.email) return { error: "not_authenticated" };

    let plan;
    try {
      plan = await getPlanBySlug(planSlug);
    } catch (err) {
      console.error("[paystack] getPlanBySlug failed", err);
      return {
        error: "provider_error",
        message: "Could not load plans from the database. Check Supabase public keys.",
      };
    }

    if (!plan) return { error: "plan_not_found" };

    const amountKes = Number(plan.priceKes);
    if (!Number.isFinite(amountKes) || amountKes <= 0) {
      console.error("[paystack] invalid plan priceKes", plan.slug, plan.priceKes);
      return {
        error: "provider_error",
        message: "Plan price is invalid in the database (price_kes).",
      };
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();
    if (!secretKey) {
      console.error("[paystack] PAYSTACK_SECRET_KEY is not set (or empty) for this environment");
      return {
        error: "provider_error",
        message:
          "Paystack secret key is missing on the server. Set PAYSTACK_SECRET_KEY for Production in Vercel, then redeploy.",
      };
    }

    let supabase;
    try {
      supabase = createServiceClient();
    } catch (err) {
      console.error("[paystack] service client unavailable", err);
      return {
        error: "provider_error",
        message:
          "Supabase service role is missing on the server. Set SUPABASE_SERVICE_ROLE_KEY for Production in Vercel, then redeploy.",
      };
    }

    const reference = `psk_${randomUUID().replace(/-/g, "")}`;

    const { data: payment, error: insertError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        plan_id: plan.id,
        provider: "paystack",
        method,
        provider_reference: reference,
        amount: amountKes,
        currency: "KES",
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !payment) {
      console.error("[paystack] payment insert failed", insertError?.message, insertError);
      const detail = insertError?.message ? ` (${insertError.message})` : "";
      return {
        error: "provider_error",
        message: `Could not create payment record${detail}. Check payments table / RLS / service role project match.`,
      };
    }

    const siteUrl = getSiteUrl();
    const amountMinor = Math.round(amountKes * 100);

    const channels =
      method === "card" ? ["card", "mobile_money"] : ["mobile_money", "card"];

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
          amount: amountMinor,
          currency: "KES",
          reference,
          channels,
          callback_url: `${siteUrl}/api/paystack/callback`,
          metadata: {
            payment_id: payment.id,
            user_id: user.id,
            plan_id: plan.id,
            plan_slug: plan.slug,
            method,
          },
        }),
      });

      data = await response.json();
    } catch (err) {
      console.error("[paystack] initialize network error", err);
      await supabase.from("payments").update({ status: "failed" }).eq("id", payment.id);
      return {
        error: "provider_error",
        message: "Could not reach Paystack. Check network / Paystack status.",
      };
    }

    if (!data.status || !data.data?.authorization_url) {
      console.error("[paystack] initialize rejected", data?.message ?? data);
      await supabase
        .from("payments")
        .update({ status: "failed", raw_response: toJson(data) })
        .eq("id", payment.id);
      return {
        error: "provider_error",
        message: data.message || "Paystack rejected the transaction. Check secret key and currency.",
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
  } catch (err) {
    console.error("[paystack] unexpected initialize failure", err);
    const hint = err instanceof Error ? err.message : "unknown error";
    return {
      error: "provider_error",
      message: `Unexpected payment error: ${hint}`,
    };
  }
}
