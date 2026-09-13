import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const verification = await verifyRes.json();

  if (verification.status && verification.data?.status === "success") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Optional: fetch a default/monthly plan_id if your schema requires plan_id foreign key
      // If plan_id is nullable in your table, you can omit it or pass null.
      const { data: plans } = await supabase.from("subscription_plans").select("id").limit(1);
      const defaultPlanId = plans?.[0]?.id || null;

      const { error } = await supabase.from("subscriptions").upsert({
        user_id: user.id,
        plan_id: defaultPlanId,
        status: "active",
        updated_at: new Date().toISOString(),
        metadata: { paystack_reference: reference },
      } as any, { onConflict: "user_id" });

      if (error) {
        console.error("Supabase subscription upsert error:", error);
      }
    }

    return NextResponse.redirect(new URL("/?payment=success", request.url));
  }

  return NextResponse.redirect(new URL("/?payment=failed", request.url));
}
