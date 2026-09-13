import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey || !supabaseUrl || !serviceRoleKey) {
    console.error("Missing environment variables.");
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  try {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });

    const verification = await verifyRes.json();
    console.log("Paystack Verification Response:", JSON.stringify(verification?.data?.status));

    if (verification.status && verification.data?.status === "success") {
      const txData = verification.data;
      const metadataUserId = txData?.metadata?.user_id || txData?.metadata?.custom_fields?.find((f: any) => f.variable_name === 'user_id')?.value;
      const customerEmail = txData?.customer?.email;

      let targetUserId = metadataUserId;

      // Fallback to email match if metadata user_id wasn't captured on gateway return
      if (!targetUserId && customerEmail) {
        const { data: { users } } = await adminSupabase.auth.admin.listUsers();
        targetUserId = users?.find((u) => u.email === customerEmail)?.id;
      }

      if (!targetUserId) {
        console.error("Could not resolve targetUserId from metadata or email:", { metadataUserId, customerEmail });
        return NextResponse.redirect(new URL("/sign-in?redirect=/premium", request.url));
      }

      // Fetch first active subscription plan or use default uuid check
      const { data: planData } = await adminSupabase
        .from("subscription_plans")
        .select("id")
        .limit(1)
        .single();

      const upsertPayload: Record<string, any> = {
        user_id: targetUserId,
        status: "active",
        updated_at: new Date().toISOString(),
      };

      if (planData?.id) {
        upsertPayload.plan_id = planData.id;
      }

      console.log("Attempting Supabase subscriptions upsert:", upsertPayload);

      const { error: upsertError } = await adminSupabase
        .from("subscriptions")
        .upsert(upsertPayload, { onConflict: "user_id" });

      if (upsertError) {
        console.error("Supabase upsert failure full details:", JSON.stringify(upsertError, null, 2));
        return NextResponse.redirect(new URL("/?payment=error", request.url));
      }

      console.log("Subscription activated successfully for user:", targetUserId);
      return NextResponse.redirect(new URL("/?payment=success", request.url));
    }

    return NextResponse.redirect(new URL("/?payment=failed", request.url));
  } catch (error) {
    console.error("Callback exception:", error);
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }
}
