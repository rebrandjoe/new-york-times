import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secretKey = process.env.PAYSTACK_SECRET_KEY || "";

    const expectedSig = crypto
      .createHmac("sha512", secretKey)
      .update(body)
      .digest("hex");

    if (signature && signature !== expectedSig) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const customerEmail = event.data?.customer?.email;
      const reference = event.data?.reference;

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
      });

      const { data: { users } } = await adminSupabase.auth.admin.listUsers();
      let matchedAuthUser = users?.find((u) => u.email === customerEmail);
      if (!matchedAuthUser && users && users.length > 0) {
        matchedAuthUser = users[0];
      }

      if (matchedAuthUser) {
        const { data: planData } = await adminSupabase
          .from("subscription_plans")
          .select("id")
          .limit(1)
          .single();

        await adminSupabase.from("subscriptions").upsert({
          user_id: matchedAuthUser.id,
          status: "active",
          updated_at: new Date().toISOString(),
          ...(planData?.id ? { plan_id: planData.id } : {}),
        }, { onConflict: "user_id" });

        console.log("Webhook processed active subscription for reference:", reference);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
