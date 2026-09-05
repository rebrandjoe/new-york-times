import { NextResponse, type NextRequest } from "next/server";
import { verifyAndActivatePaypal } from "@/lib/premium/verify";

function getSiteUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
}

/** PayPal redirects here after the buyer approves the order. `token` is
 * PayPal's order id — we capture it server-side ourselves rather than
 * trusting anything about how the buyer arrived here. */
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("token");
  const paymentId = request.nextUrl.searchParams.get("payment_id");
  const site = getSiteUrl(request);

  if (!orderId || !paymentId) {
    return NextResponse.redirect(`${site}/premium/confirm?result=failure`);
  }

  const result = await verifyAndActivatePaypal({ paymentId, orderId });

  return NextResponse.redirect(
    `${site}/premium/confirm?payment_id=${paymentId}&result=${result.activated ? "success" : "failure"}`
  );
}
