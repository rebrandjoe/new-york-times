"use client";

import { useState, useEffect } from "react";
import { initializePaystackTransaction } from "@/lib/actions/paystack";

type Props = {
  planSlug: string;
  displayAmountKes?: number;
  displayAmountUsd?: number;
  method?: "mpesa" | "card";
  buttonLabel?: string;
  variant?: "default" | "editorial";
};

function friendlyErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message || "";
    if (/minified React error/i.test(msg) || /digest/i.test(msg)) {
      return "Could not start payment. Please sign in and try again.";
    }
    if (msg.length > 0 && msg.length < 200) return msg;
  }
  return "An unexpected error occurred. Please try again.";
}

export function PaystackCheckoutButton({
  planSlug,
  displayAmountKes,
  displayAmountUsd,
  method = "mpesa",
  buttonLabel,
  variant = "default",
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
      const result = await initializePaystackTransaction({
        planSlug,
        method: method === "card" ? "card" : "mpesa",
      });

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

  const editorial =
    "focus-ring w-full bg-accent px-6 py-3.5 text-center text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
  const defaultClass =
    "w-full rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] disabled:opacity-50";

  if (!isMounted) {
    return (
      <div className={`${variant === "editorial" ? editorial : defaultClass} opacity-60`}>
        Loading payment...
      </div>
    );
  }

  const hasKes = displayAmountKes != null && displayAmountKes > 0;
  const hasUsd = displayAmountUsd != null && displayAmountUsd > 0;

  let label = buttonLabel ?? "Pay with Paystack";
  if (!buttonLabel) {
    if (hasKes && hasUsd) {
      label = `Pay $${displayAmountUsd!.toLocaleString("en-US")} / KES ${displayAmountKes!.toLocaleString("en-KE")}`;
    } else if (hasKes) {
      label = `Pay KES ${displayAmountKes!.toLocaleString("en-KE")}`;
    } else if (hasUsd) {
      label = `Pay $${displayAmountUsd!.toLocaleString("en-US")}`;
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !planSlug}
        className={variant === "editorial" ? editorial : defaultClass}
      >
        {loading ? "Redirecting to Paystack..." : label}
      </button>
      {errorMsg && <p className="text-center text-xs text-red-500">{errorMsg}</p>}
    </div>
  );
}
