import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("Missing PAYSTACK_SECRET_KEY server environment variable.");
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }

  try {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const verification = await verifyRes.json();

    if (verification.status && verification.data?.status === "success") {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("User unauthenticated during paystack callback redirection.");
        return NextResponse.redirect(new URL("/sign-in?redirect=/premium", request.url));
      }

      // Safely query first available plan ID without triggering TS null-assign errors
      const { data: planData } = await supabase
        .from("subscription_plans")
        .select("id")
        .limit(1)
        .single();

      const upsertPayload: Record<string, any> = {
        user_id: user.id,
        status: "active",
        updated_at: new Date().toISOString(),
        metadata: { paystack_reference: reference },
      };

      if (planData?.id) {
        upsertPayload.plan_id = planData.id;
      }

      const { error: upsertError } = await supabase
        .from("subscriptions")
        .upsert(upsertPayload, { onConflict: "user_id" });

      if (upsertError) {
        console.error("Supabase subscription upsert error:", upsertError);
      }

      return NextResponse.redirect(new URL("/?payment=success", request.url));
    }

    return NextResponse.redirect(new URL("/?payment=failed", request.url));
  } catch (error) {
    console.error("Paystack verification exception:", error);
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }
}
