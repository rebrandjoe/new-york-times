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
