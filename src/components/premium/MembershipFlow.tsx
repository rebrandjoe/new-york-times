"use client";

import { useState } from "react";
import { initializePaystackTransaction } from "@/lib/actions/paystack";
import type { SubscriptionPlan } from "@/lib/premium/types";

export function MembershipFlow({
  plans,
  isSignedIn,
}: {
  plans: SubscriptionPlan[];
  isSignedIn: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Prefer monthly plan when available; fall back to first active plan.
  const plan =
    plans.find((p) => p.billingInterval === "monthly") ?? plans[0] ?? null;
  const planSlug = plan?.slug ?? "monthly";
  const displayKes = plan?.priceKes ?? 390;

  const handleCheckout = async () => {
    if (!isSignedIn) {
      setErrorMsg("Please sign in to continue.");
      return;
    }
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
        setErrorMsg(result.message || "Failed to start payment.");
        return;
      }

      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to start payment.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mt-8 rounded-2xl border border-charcoal bg-[#0F0F0F] p-8">
        <div className="text-sm font-bold uppercase tracking-wider text-gray-muted">
          {plan?.name ?? "Monthly Access"}
        </div>
        <div className="mt-2 font-serif text-4xl font-extrabold text-white">
          KES {displayKes.toLocaleString("en-KE")}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading || !planSlug}
            className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading
              ? "Redirecting to Paystack..."
              : `Pay KES ${displayKes.toLocaleString("en-KE")}`}
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
