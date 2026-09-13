"use server";

import { createClient } from "@/lib/supabase/server";

export async function initializePaystackTransaction({
  amountInKes,
}: {
  amountInKes: number;
}) {
  // 1. Enforce authentication server-side
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    throw new Error("Unauthorized: Please sign in to proceed with payment.");
  }

  // 2. Validate payment amount
  if (typeof amountInKes !== "number" || amountInKes <= 0 || isNaN(amountInKes)) {
    throw new Error("Invalid payment amount.");
  }

  // 3. Verify server-side secret key exists
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Server configuration error: Missing Paystack secret key.");
  }

  // 4. Initialize Paystack transaction securely server-to-server
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://josephmmwa.com";
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: Math.round(amountInKes * 100), // Convert KES to smallest currency unit (cents)
      callback_url: `${siteUrl}/api/paystack/callback`,
      metadata: {
        user_id: user.id,
      },
    }),
  });

  const data = await response.json();
  if (!data.status) {
    throw new Error(data.message || "Failed to initialize Paystack transaction.");
  }

  return data.data; // Contains authorization_url, reference, access_code
}
