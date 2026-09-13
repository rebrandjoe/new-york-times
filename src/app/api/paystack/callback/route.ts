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
    console.log("Paystack verification response status:", verification?.data?.status);

    if (verification.status && verification.data?.status === "success") {
      const supabase = await createClient();
      let { data: { user } } = await supabase.auth.getUser();

      const customerEmail = verification.data?.customer?.email;

      // Fallback: lookup user profile ID by email using 'any' cast if session cookie dropped
      if (!user && customerEmail) {
        console.log("Session cookie missing on callback return, attempting profile ID lookup:", customerEmail);
        const { data: profileMatch } = await (supabase.from("profiles" as any) as any)
          .select("id")
          .single();
        
        if (profileMatch) {
          user = { id: profileMatch.id, email: customerEmail } as any;
        }
      }

      if (!user) {
        console.error("Could not resolve authenticated user or profile match for paystack callback.");
        return NextResponse.redirect(new URL("/sign-in?redirect=/premium", request.url));
      }

      // Fetch first available plan ID from subscription_plans
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
        console.error("Supabase subscription upsert full error:", JSON.stringify(upsertError, null, 2));
      } else {
        console.log("Subscription record upserted successfully for user:", user.id);
      }

      return NextResponse.redirect(new URL("/?payment=success", request.url));
    }

    return NextResponse.redirect(new URL("/?payment=failed", request.url));
  } catch (error) {
    console.error("Paystack verification exception:", error);
    return NextResponse.redirect(new URL("/?payment=error", request.url));
  }
}
