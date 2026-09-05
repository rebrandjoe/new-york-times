import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getMySubscription, isSubscriptionCurrentlyActive } from "@/lib/premium/access";
import { getActivePlans } from "@/lib/premium/plans";
import { AlreadyMember } from "@/components/premium/AlreadyMember";
import { MembershipFlow } from "@/components/premium/MembershipFlow";

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
      <MembershipFlow plans={plans} isSignedIn={!!user} />
    </Suspense>
  );
}
