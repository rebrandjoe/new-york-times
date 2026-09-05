import { NextResponse, type NextRequest } from "next/server";
import { verifyFlutterwaveWebhookSignature } from "@/lib/payments/flutterwave";
import { recordPaymentEventOnce } from "@/lib/premium/activation";
import { verifyAndActivateFlutterwave } from "@/lib/premium/verify";
import { createServiceClient } from "@/lib/supabase/service";

/** Flutterwave webhook — the primary activation path for M-Pesa charges,
 * and a reconciliation backstop for card checkouts that already activate
 * synchronously at the redirect-return step. Never trusts this payload's
 * own status field; always re-verifies against Flutterwave's API first. */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("verif-hash");
  if (!verifyFlutterwaveWebhookSignature(signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const body = await request.json();
  const eventData = body?.data;
  const txRef: string | undefined = eventData?.tx_ref;
  const transactionId: string | number | undefined = eventData?.id;

  if (!txRef || !transactionId) {
    return NextResponse.json({ error: "malformed payload" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: payment } = await supabase
    .from("payments")
    .select("id")
    .eq("provider_reference", txRef)
    .maybeSingle();

  const { alreadyProcessed } = await recordPaymentEventOnce({
    provider: "flutterwave",
    eventType: body?.event ?? "unknown",
    providerEventId: String(transactionId),
    payload: body,
    paymentId: payment?.id ?? null,
  });

  if (alreadyProcessed || !payment) {
    return NextResponse.json({ ok: true });
  }

  await verifyAndActivateFlutterwave({ paymentId: payment.id, transactionId });

  return NextResponse.json({ ok: true });
}
