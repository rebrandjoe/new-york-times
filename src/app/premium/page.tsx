import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { PaystackCheckoutButton } from "@/components/PaystackCheckoutButton";

export const dynamic = "force-dynamic"; // Forces dynamic server-side rendering for auth/cookies

export const metadata: Metadata = {
  title: "Premium Membership",
  description: "Join JOSEPH MMWA — full access to in-depth health and medical journalism.",
  alternates: { canonical: "/premium" },
};

export default async function PremiumPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <Suspense fallback={<div className="py-20 text-center text-white">Loading membership options...</div>}>
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-charcoal bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Member Access
        </div>

        <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
          Unlock Full Investigative Health Reports
        </h1>

        <p className="mt-4 text-sm text-gray-secondary-light leading-relaxed">
          Get unrestricted access to global medical research breakdowns, exclusive archive reports, and zero ads.
        </p>

        <div className="mt-8 rounded-2xl border border-charcoal bg-[#0F0F0F] p-8">
          <div className="text-sm font-bold uppercase tracking-wider text-gray-muted">Monthly Access</div>
          <div className="mt-2 font-serif text-4xl font-extrabold text-white">KES 390</div>
          
          <div className="mt-6 flex flex-col items-center">
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
