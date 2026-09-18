"use client";

import { useState, useEffect } from "react";
import { initializePaystackTransaction } from "@/lib/actions/paystack";

type Props = {
  /** Existing plan slug from subscription_plans — server loads authoritative price. */
  planSlug: string;
  /** Display-only KES amount for the button label. Never sent as the charge amount. */
  displayAmountKes?: number;
};

export function PaystackCheckoutButton({ planSlug, displayAmountKes }: Props) {
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
      const result = await initializePaystackTransaction({ planSlug });

      if ("error" in result) {
        if (result.error === "not_authenticated") {
          setErrorMsg("Please sign in to continue.");
          return;
        }
        if (result.error === "plan_not_found") {
          setErrorMsg("That plan is not available.");
          return;
        }
        setErrorMsg(result.message || "Could not start payment.");
        return;
      }

      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(message);
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

  const label =
    displayAmountKes != null && displayAmountKes > 0
      ? `Pay KES ${displayAmountKes.toLocaleString("en-KE")}`
      : "Pay with Paystack";

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !planSlug}
        className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? "Redirecting to Paystack..." : label}
      </button>
      {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
    </div>
  );
}
