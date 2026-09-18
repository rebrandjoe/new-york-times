import { createServiceClient } from "@/lib/supabase/service";
import { verifyTransactionById } from "@/lib/payments/flutterwave";
import { captureOrder, getOrder } from "@/lib/payments/paypal";
import { activateSubscriptionForPayment, markPaymentStatus, notifyPaymentFailed } from "./activation";

interface PaymentRow {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  currency: string;
  status: string;
  subscription_id: string | null;
  provider_reference?: string;
}

async function loadPlanInterval(planId: string): Promise<"monthly" | "annual"> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("subscription_plans")
    .select("billing_interval")
    .eq("id", planId)
    .maybeSingle();
  return (data?.billing_interval as "monthly" | "annual") ?? "monthly";
}

/** Re-verifies a Flutterwave transaction server-to-server (via transaction id,
 * never trusting the webhook payload or a redirect's query params alone) and
 * activates the subscription only once the amount/currency genuinely match
 * what we charged for. Safe to call more than once for the same payment. */
export async function verifyAndActivateFlutterwave(params: {
  paymentId: string;
  transactionId: string | number;
}): Promise<{ activated: boolean; status: string }> {
  const supabase = createServiceClient();
  const { data: payment } = await supabase
    .from("payments")
    .select("id, user_id, plan_id, amount, currency, status, subscription_id")
    .eq("id", params.paymentId)
    .maybeSingle<PaymentRow>();

  if (!payment) return { activated: false, status: "not_found" };
  if (payment.subscription_id) return { activated: true, status: "successful" };

  const verification = await verifyTransactionById(params.transactionId);
  const tx = verification.data;

  if (verification.status !== "success" || !tx || tx.status !== "successful") {
    await markPaymentStatus(payment.id, "failed", { rawResponse: verification });
    await notifyPaymentFailed(payment.user_id, payment.plan_id);
    return { activated: false, status: "failed" };
  }

  // Defense in depth: the amount actually charged must match what we asked for.
  const amountMatches = Math.abs(tx.amount - Number(payment.amount)) < 0.01;
  const currencyMatches = tx.currency === payment.currency;
  if (!amountMatches || !currencyMatches) {
    await markPaymentStatus(payment.id, "failed", { rawResponse: verification });
    await notifyPaymentFailed(payment.user_id, payment.plan_id);
    return { activated: false, status: "failed" };
  }

  await markPaymentStatus(payment.id, "successful", {
    providerTransactionId: String(tx.id),
    rawResponse: verification,
  });

  const billingInterval = await loadPlanInterval(payment.plan_id);
  await activateSubscriptionForPayment({
    userId: payment.user_id,
    planId: payment.plan_id,
    billingInterval,
    provider: "flutterwave",
    paymentId: payment.id,
  });

  return { activated: true, status: "successful" };
}

/** Captures (or re-checks) a PayPal order server-side and activates only
 * once PayPal itself confirms the capture completed and the amount matches. */
export async function verifyAndActivatePaypal(params: {
  paymentId: string;
  orderId: string;
  alreadyCaptured?: boolean;
}): Promise<{ activated: boolean; status: string }> {
  const supabase = createServiceClient();
  const { data: payment } = await supabase
    .from("payments")
    .select("id, user_id, plan_id, amount, currency, status, subscription_id")
    .eq("id", params.paymentId)
    .maybeSingle<PaymentRow>();

  if (!payment) return { activated: false, status: "not_found" };
  if (payment.subscription_id) return { activated: true, status: "successful" };

  const order = params.alreadyCaptured ? await getOrder(params.orderId) : await captureOrder(params.orderId);
  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];

  if (order.status !== "COMPLETED" || !capture || capture.status !== "COMPLETED") {
    await markPaymentStatus(payment.id, "failed", { rawResponse: order });
    await notifyPaymentFailed(payment.user_id, payment.plan_id);
    return { activated: false, status: "failed" };
  }

  const amountMatches = Math.abs(Number(capture.amount.value) - Number(payment.amount)) < 0.01;
  const currencyMatches = capture.amount.currency_code === payment.currency;
  if (!amountMatches || !currencyMatches) {
    await markPaymentStatus(payment.id, "failed", { rawResponse: order });
    await notifyPaymentFailed(payment.user_id, payment.plan_id);
    return { activated: false, status: "failed" };
  }

  await markPaymentStatus(payment.id, "successful", {
    providerTransactionId: capture.id,
    rawResponse: order,
  });

  const billingInterval = await loadPlanInterval(payment.plan_id);
  await activateSubscriptionForPayment({
    userId: payment.user_id,
    planId: payment.plan_id,
    billingInterval,
    provider: "paypal",
    paymentId: payment.id,
  });

  return { activated: true, status: "successful" };
}

/**
 * Verifies a Paystack transaction server-to-server by reference and activates
 * the subscription only when amount, currency, and success status match the
 * existing payments row. Safe to call from both webhook and callback; idempotent
 * via payment.subscription_id and activateSubscriptionForPayment.
 */
export async function verifyAndActivatePaystack(params: {
  paymentId: string;
  reference: string;
}): Promise<{ activated: boolean; status: string }> {
  const supabase = createServiceClient();
  const { data: payment } = await supabase
    .from("payments")
    .select("id, user_id, plan_id, amount, currency, status, subscription_id, provider_reference")
    .eq("id", params.paymentId)
    .maybeSingle<PaymentRow>();

  if (!payment) return { activated: false, status: "not_found" };
  if (payment.subscription_id) return { activated: true, status: "successful" };

  // Reference on the payment row is authoritative; reject mismatches.
  if (payment.provider_reference !== params.reference) {
    console.error("[paystack] reference mismatch for payment", payment.id);
    return { activated: false, status: "reference_mismatch" };
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("[paystack] missing PAYSTACK_SECRET_KEY");
    return { activated: false, status: "config_error" };
  }

  let verification: {
    status?: boolean;
    message?: string;
    data?: {
      status?: string;
      reference?: string;
      amount?: number;
      currency?: string;
      id?: number;
    };
  };

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(params.reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      }
    );
    verification = await res.json();
  } catch {
    console.error("[paystack] verify network error");
    return { activated: false, status: "network_error" };
  }

  const tx = verification.data;

  if (!verification.status || !tx || tx.status !== "success") {
    await markPaymentStatus(payment.id, "failed", { rawResponse: verification });
    await notifyPaymentFailed(payment.user_id, payment.plan_id);
    return { activated: false, status: "failed" };
  }

  if (tx.reference !== params.reference) {
    await markPaymentStatus(payment.id, "failed", { rawResponse: verification });
    return { activated: false, status: "reference_mismatch" };
  }

  // Paystack returns amount in the smallest currency unit (kobo/cents).
  const paidMajor = Number(tx.amount) / 100;
  const amountMatches = Math.abs(paidMajor - Number(payment.amount)) < 0.01;
  const currencyMatches =
    typeof tx.currency === "string" &&
    tx.currency.toUpperCase() === String(payment.currency).toUpperCase();

  if (!amountMatches || !currencyMatches) {
    console.error("[paystack] amount/currency mismatch", {
      paymentId: payment.id,
      expectedAmount: payment.amount,
      paidMajor,
      expectedCurrency: payment.currency,
      paidCurrency: tx.currency,
    });
    await markPaymentStatus(payment.id, "failed", { rawResponse: verification });
    await notifyPaymentFailed(payment.user_id, payment.plan_id);
    return { activated: false, status: "failed" };
  }

  await markPaymentStatus(payment.id, "successful", {
    providerTransactionId: tx.id != null ? String(tx.id) : undefined,
    rawResponse: verification,
  });

  const billingInterval = await loadPlanInterval(payment.plan_id);
  await activateSubscriptionForPayment({
    userId: payment.user_id,
    planId: payment.plan_id,
    billingInterval,
    provider: "paystack",
    paymentId: payment.id,
  });

  return { activated: true, status: "successful" };
}
