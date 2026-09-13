"use client";

import { useState } from "react";
import { initializePaystackTransaction } from "@/lib/actions/paystack";

export function PaystackCheckoutButton({ amountInKes = 500 }: { amountInKes?: number }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePay = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await initializePaystackTransaction({ amountInKes });
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handlePay}
        disabled={loading}
        className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {loading.valueOf() ? "Redirecting..." : `Pay KES ${amountInKes}`}
      </button>
      {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
    </div>
  );
}
