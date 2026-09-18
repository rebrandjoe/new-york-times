import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { recordPaymentEventOnce } from "@/lib/premium/activation";
import { verifyAndActivatePaystack } from "@/lib/premium/verify";

function timingSafeEqualHex(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Paystack webhook — primary activation path for charge.success.
 * Never trusts the payload alone: signature is mandatory, then we re-verify
 * against Paystack's API via verifyAndActivatePaystack using the existing
 * payments row (user_id + plan_id + amount + currency).
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("[paystack webhook] missing PAYSTACK_SECRET_KEY");
    return NextResponse.json({ error: "configuration error" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  // Reject missing or invalid signatures — never process without verification.
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 401 });
  }

  const expectedSig = crypto.createHmac("sha512", secretKey).update(body).digest("hex");
  if (!timingSafeEqualHex(signature, expectedSig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: {
      id?: number;
      reference?: string;
      status?: string;
    };
  };

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "malformed payload" }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data?.reference;
  const providerEventId =
    event.data?.id != null ? String(event.data.id) : reference ?? null;

  if (!reference) {
    return NextResponse.json({ error: "malformed payload" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: payment } = await supabase
    .from("payments")
    .select("id")
    .eq("provider_reference", reference)
    .eq("provider", "paystack")
    .maybeSingle();

  const { alreadyProcessed } = await recordPaymentEventOnce({
    provider: "paystack",
    eventType: event.event,
    providerEventId,
    payload: event,
    paymentId: payment?.id ?? null,
  });

  // No payment row → do not invent a user or subscription.
  if (alreadyProcessed || !payment) {
    return NextResponse.json({ ok: true });
  }

  await verifyAndActivatePaystack({
    paymentId: payment.id,
    reference,
  });

  return NextResponse.json({ ok: true });
}
