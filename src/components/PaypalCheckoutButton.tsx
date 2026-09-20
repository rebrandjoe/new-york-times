"use client";

import { useState, useEffect } from "react";
import { initiatePaypalCheckout } from "@/lib/actions/premium";

type Props = {
  /** Plan slug only — server loads authoritative USD price from subscription_plans. */
  planSlug: string;
  /** Display-only amounts for the button label. Never sent as the charge amount. */
  displayAmountUsd?: number;
  displayAmountKes?: number;
};

export function PaypalCheckoutButton({
  planSlug,
  displayAmountUsd,
  displayAmountKes,
}: Props) {
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
      const result = await initiatePaypalCheckout(planSlug);

      if (!result || typeof result !== "object") {
        setErrorMsg("Could not start PayPal checkout. Please try again.");
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
          ("message" in result && result.message) || "Could not start PayPal checkout."
        );
        return;
      }

      if ("checkoutUrl" in result && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      setErrorMsg("Could not start PayPal checkout. Please try again.");
    } catch (err: unknown) {
      console.error("[PaypalCheckoutButton]", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full rounded-xl bg-[#0070ba]/50 px-6 py-3.5 text-center text-sm font-bold text-white">
        Loading PayPal...
      </div>
    );
  }

  const hasUsd = displayAmountUsd != null && displayAmountUsd > 0;
  const hasKes = displayAmountKes != null && displayAmountKes > 0;
  let label = "Pay with PayPal";
  if (hasUsd && hasKes) {
    label = `Pay $${displayAmountUsd!.toLocaleString("en-US")} / KES ${displayAmountKes!.toLocaleString("en-KE")}`;
  } else if (hasUsd) {
    label = `Pay $${displayAmountUsd!.toLocaleString("en-US")}`;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !planSlug}
        className="w-full rounded-xl bg-[#0070ba] px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#003087] disabled:opacity-50"
      >
        {loading ? "Redirecting to PayPal..." : label}
      </button>
      {errorMsg && <p className="text-xs text-red-500 text-center">{errorMsg}</p>}
    </div>
  );
}
