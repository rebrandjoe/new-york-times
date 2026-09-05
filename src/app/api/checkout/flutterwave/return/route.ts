import { NextResponse, type NextRequest } from "next/server";
import { verifyAndActivateFlutterwave } from "@/lib/premium/verify";
import { createServiceClient } from "@/lib/supabase/service";

function getSiteUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
}

/** Flutterwave redirects here after a hosted (card) checkout. The status
 * and tx_ref query params are a hint only — the real answer comes from
 * re-verifying the transaction id against Flutterwave's API. */
export async function GET(request: NextRequest) {
  const txRef = request.nextUrl.searchParams.get("tx_ref");
  const transactionId = request.nextUrl.searchParams.get("transaction_id");
  const site = getSiteUrl(request);

  if (!txRef || !transactionId) {
    return NextResponse.redirect(`${site}/premium/confirm?result=failure`);
  }

  const supabase = createServiceClient();
  const { data: payment } = await supabase
    .from("payments")
    .select("id")
    .eq("provider_reference", txRef)
    .maybeSingle();

  if (!payment) {
    return NextResponse.redirect(`${site}/premium/confirm?result=failure`);
  }

  const result = await verifyAndActivateFlutterwave({ paymentId: payment.id, transactionId });

  return NextResponse.redirect(
    `${site}/premium/confirm?payment_id=${payment.id}&result=${result.activated ? "success" : "failure"}`
  );
}
