"use client";

import { useState, useEffect } from "react";
import { initializePaystackTransaction } from "@/lib/actions/paystack";

type Props = {
  /** Existing plan slug from subscription_plans — server loads authoritative price. */
  planSlug: string;
  /** Display-only KES amount for the button label. Never sent as the charge amount. */
  displayAmountKes?: number;
};

function friendlyErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message || "";
    // Next/React production digests are useless to end users
    if (/minified React error/i.test(msg) || /digest/i.test(msg)) {
      return "Could not start payment. Please sign in and try again.";
    }
    if (msg.length > 0 && msg.length < 200) return msg;
  }
  return "An unexpected error occurred. Please try again.";
}

export function PaystackCheckoutButton({ planSlug, displayAmountKes }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePay = async () => {
    if (!planSlug) {
      setErrorMsg("That plan is not available.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const result = await initializePaystackTransaction({ planSlug });

      if (!result || typeof result !== "object") {
        setErrorMsg("Could not start payment. Please try again.");
        return;
      }

      if ("error" in result) {
        if (result.error === "not_authenticated") {
          setErrorMsg("Please sign in to continue.");
          return;
        }
        if (result.error === "plan_not_found") {
          setErrorMsg("That plan is not available.");
          return;
        }
        setErrorMsg(
          ("message" in result && result.message) || "Could not start payment."
        );
        return;
      }

      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
        return;
      }

      setErrorMsg("Could not start payment. Please try again.");
    } catch (err: unknown) {
      console.error("[PaystackCheckoutButton]", err);
      setErrorMsg(friendlyErrorMessage(err));
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
      {errorMsg && <p className="text-xs text-red-500 text-center">{errorMsg}</p>}
    </div>
  );
}
