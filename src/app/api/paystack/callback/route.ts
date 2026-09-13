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
    console.error("Missing required environment variables (PAYSTACK_SECRET_KEY, SUPABASE_URL, or SERVICE_ROLE_KEY).");
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }

  // Use service role client to bypass cookie drop during external redirect
  const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  try {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const verification = await verifyRes.json();
    console.log("Paystack verification data:", JSON.stringify(verification?.data?.status));

    if (verification.status && verification.data?.status === "success") {
      const customerEmail = verification.data?.customer?.email;

      if (!customerEmail) {
        console.error("No customer email returned in Paystack verification payload.");
        return NextResponse.redirect(new URL("/?payment=error", request.url));
      }

      // Lookup user UUID from auth.users or profiles by email
      const { data: profileMatch, profileError } = await adminSupabase
        .from("profiles")
        .select("id")
        .eq("email", customerEmail)
        .single();

      let targetUserId = profileMatch?.id;

      // Fallback: search auth users admin API or match by email if profile not found
      if (!targetUserId) {
        const { data: { users }, error: listErr } = await adminSupabase.auth.admin.listUsers();
        const matchedAuthUser = users?.find((u) => u.email === customerEmail);
        targetUserId = matchedAuthUser?.id;
      }

      if (!targetUserId) {
        console.error(`No user found matching email ${customerEmail}`);
        return NextResponse.redirect(new URL("/sign-in?redirect=/premium", request.url));
      }

      // Fetch first available plan ID from subscription_plans
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

      const { error: upsertError } = await adminSupabase
        .from("subscriptions")
        .upsert(upsertPayload, { onConflict: "user_id" });

      if (upsertError) {
        console.error("Supabase upsert failure:", JSON.stringify(upsertError, null, 2));
        return NextResponse.redirect(new URL("/?payment=error", request.url));
      }

      console.log("Subscription activated for user:", targetUserId);
      return NextResponse.redirect(new URL("/?payment=success", request.url));
    }

    return NextResponse.redirect(new URL("/?payment=failed", request.url));
  } catch (error) {
    console.error("Callback exception:", error);
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }
}
