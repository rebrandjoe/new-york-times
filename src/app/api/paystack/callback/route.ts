import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyAndActivatePaystack } from "@/lib/premium/verify";

/**
 * Paystack browser redirect callback.
 * This is NOT proof of payment. We only use the reference to look up our
 * payments row and re-verify server-to-server against Paystack, then activate
 * via the shared verifyAndActivatePaystack path (same as the webhook).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(new URL("/premium?payment=error", request.url));
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.error("[paystack callback] missing PAYSTACK_SECRET_KEY");
    return NextResponse.redirect(new URL("/premium?payment=error", request.url));
  }

  try {
    const supabase = createServiceClient();
    const { data: payment } = await supabase
      .from("payments")
      .select("id")
      .eq("provider_reference", reference)
      .eq("provider", "paystack")
      .maybeSingle();

    if (!payment) {
      // No matching payment — do not invent a subscription or user.
      return NextResponse.redirect(new URL("/premium?payment=error", request.url));
    }

    const result = await verifyAndActivatePaystack({
      paymentId: payment.id,
      reference,
    });

    if (result.activated) {
      return NextResponse.redirect(new URL("/premium?payment=success", request.url));
    }

    if (result.status === "failed") {
      return NextResponse.redirect(new URL("/premium?payment=failed", request.url));
    }

    return NextResponse.redirect(new URL("/premium?payment=error", request.url));
  } catch (err) {
    console.error("[paystack callback] exception");
    return NextResponse.redirect(new URL("/premium?payment=error", request.url));
  }
}
