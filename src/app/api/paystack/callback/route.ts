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
      await supabase.from("subscriptions").upsert({
        user_id: user.id,
        status: "active",
        updated_at: new Date().toISOString(),
        // Store reference in metadata or remove if column doesn't exist:
        metadata: { paystack_reference: reference },
      } as any);
    }

    return NextResponse.redirect(new URL("/?payment=success", request.url));
  }

  return NextResponse.redirect(new URL("/?payment=failed", request.url));
}
