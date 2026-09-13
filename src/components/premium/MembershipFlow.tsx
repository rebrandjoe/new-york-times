"use client";

import { useState } from "react";
import { initializePaystackTransaction } from "@/lib/actions/paystack";

export function MembershipFlow({ plans, isSignedIn }: { plans: any[]; isSignedIn: boolean }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      // KES 390 or pull dynamic plan amount if selected
      const data = await initializePaystackTransaction({ amountInKes: 390 });
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to start payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      {/* Remove old static M-Pesa form block and replace with Paystack trigger */}
      <div className="mt-8 rounded-2xl border border-charcoal bg-[#0F0F0F] p-8">
        <div className="text-sm font-bold uppercase tracking-wider text-gray-muted">Monthly Access</div>
        <div className="mt-2 font-serif text-4xl font-extrabold text-white">KES 390</div>
        
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Redirecting to Paystack..." : "Pay KES 390"}
          </button>
          {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
        </div>
        <p className="mt-4 text-xs text-gray-muted">
          Supports M-Pesa, Visa, and Mastercard via Paystack.
        </p>
      </div>
    </div>
  );
}
