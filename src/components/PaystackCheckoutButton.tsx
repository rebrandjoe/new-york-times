"use client";

import { useState, useEffect } from "react";
import { initializePaystackTransaction } from "@/lib/actions/paystack";

export function PaystackCheckoutButton({ amountInKes = 390 }: { amountInKes?: number }) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) {
    return (
      <div className="w-full rounded-full bg-accent/50 px-6 py-3.5 text-center text-sm font-bold text-black">
        Loading payment...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? "Redirecting to Paystack..." : `Pay KES ${amountInKes}`}
      </button>
      {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
    </div>
  );
}
