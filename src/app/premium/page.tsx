import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getMySubscription, isSubscriptionCurrentlyActive } from "@/lib/premium/access";
import { getActivePlans } from "@/lib/premium/plans";
import { AlreadyMember } from "@/components/premium/AlreadyMember";
import { MembershipFlow } from "@/components/premium/MembershipFlow";
import { PaystackCheckoutButton } from "@/components/PaystackCheckoutButton";

export const metadata: Metadata = {
  title: "Premium Membership",
  description: "Join JOSEPH MMWA — full access to in-depth health and medical journalism.",
  alternates: { canonical: "/premium" },
};

export default async function PremiumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const subscription = await getMySubscription(user.id);

    if (isSubscriptionCurrentlyActive(subscription)) {
      return <AlreadyMember />;
    }
  }

  const plans = await getActivePlans();

  return (
    <Suspense>
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <MembershipFlow plans={plans} isSignedIn={!!user} />
        
        {/* Direct Paystack Checkout Fallback/Integration */}
        <div className="mt-8 rounded-2xl border border-charcoal bg-[#0F0F0F] p-8">
          <div className="text-sm font-bold uppercase tracking-wider text-gray-muted">
            Instant Paystack Checkout (M-Pesa / Cards)
          </div>
          <div className="mt-2 font-serif text-4xl font-extrabold text-white">KES 390</div>
          <div className="mt-6 flex justify-center">
            <PaystackCheckoutButton amountInKes={390} />
          </div>
          <p className="mt-4 text-xs text-gray-muted">
            Supports M-Pesa, Visa, and Mastercard via Paystack.
          </p>
        </div>
      </div>
    </Suspense>
  );
}
