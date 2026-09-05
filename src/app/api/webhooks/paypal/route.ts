import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhookSignature, getOrder } from "@/lib/payments/paypal";
import { recordPaymentEventOnce } from "@/lib/premium/activation";
import { verifyAndActivatePaypal } from "@/lib/premium/verify";
import { createServiceClient } from "@/lib/supabase/service";

/** PayPal webhook — a reconciliation backstop for the redirect-return
 * capture path (which activates synchronously when the buyer comes back).
 * This exists for cases like the buyer closing the tab after approving. */
export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const event = JSON.parse(bodyText);

  const verified = await verifyWebhookSignature({
    transmissionId: request.headers.get("paypal-transmission-id") ?? "",
    timestamp: request.headers.get("paypal-transmission-time") ?? "",
    certUrl: request.headers.get("paypal-cert-url") ?? "",
    authAlgo: request.headers.get("paypal-auth-algo") ?? "",
    transmissionSig: request.headers.get("paypal-transmission-sig") ?? "",
    eventBody: event,
  });

  if (!verified) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const eventType: string = event.event_type;
  let orderId: string | undefined;

  if (eventType === "CHECKOUT.ORDER.APPROVED") {
    orderId = event.resource?.id;
  } else if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
    orderId = event.resource?.supplementary_data?.related_ids?.order_id;
  }

  const { alreadyProcessed } = await recordPaymentEventOnce({
    provider: "paypal",
    eventType,
    providerEventId: event.id ?? null,
    payload: event,
  });

  if (alreadyProcessed || !orderId) {
    return NextResponse.json({ ok: true });
  }

  const order = await getOrder(orderId);
  const referenceId = order.purchase_units?.[0]?.reference_id;
  if (!referenceId) return NextResponse.json({ ok: true });

  const supabase = createServiceClient();
  const { data: payment } = await supabase
    .from("payments")
    .select("id")
    .eq("id", referenceId)
    .maybeSingle();

  if (!payment) return NextResponse.json({ ok: true });

  await verifyAndActivatePaypal({ paymentId: payment.id, orderId, alreadyCaptured: true });

  return NextResponse.json({ ok: true });
}
