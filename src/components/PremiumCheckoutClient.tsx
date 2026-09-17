"use client";

import { useState, useEffect } from "react";
import { PaystackCheckoutButton } from "@/components/PaystackCheckoutButton";

type PaymentGateway = "mpesa" | "card" | "paypal" | null;
type BillingTier = "monthly" | "annual";

export function PremiumCheckoutClient({ userEmail }: { userEmail?: string | null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [tier, setTier] = useState<BillingTier>("monthly");
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("mpesa");
  const [currency, setCurrency] = useState<"KES" | "USD">("KES");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="py-12 text-center text-xs text-gray-muted">Loading secure checkout...</div>;
  }

  const pricing = {
    monthly: { KES: 390, USD: 4, label: "Monthly Access", period: "/ month" },
    annual: { KES: 3900, USD: 39, label: "Annual Access", period: "/ year (Save ~16%)" },
  };

  const amount = pricing[tier][currency];
  const effectiveKesAmount = currency === "KES" ? amount : Math.round(amount * 130);

  return (
    <div className="mt-6">
      {/* Currency & Tier Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <div className="inline-flex rounded-xl border border-charcoal bg-[#0F0F0F] p-1">
          <button
            onClick={() => setCurrency("KES")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              currency === "KES" ? "bg-accent text-black" : "text-gray-muted hover:text-white"
            }`}
          >
            KES
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              currency === "USD" ? "bg-accent text-black" : "text-gray-muted hover:text-white"
            }`}
          >
            USD
          </button>
        </div>

        <div className="inline-flex rounded-xl border border-charcoal bg-[#0F0F0F] p-1">
          <button
            onClick={() => setTier("monthly")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              tier === "monthly" ? "bg-zinc-800 text-white" : "text-gray-muted hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTier("annual")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              tier === "annual" ? "bg-zinc-800 text-white" : "text-gray-muted hover:text-white"
            }`}
          >
            Annual <span className="text-accent">Best Value</span>
          </button>
        </div>
      </div>

      {/* Main Pricing & Payment Selector Card */}
      <div className="rounded-2xl border border-charcoal bg-[#0F0F0F] p-8 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-charcoal pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              {pricing[tier].label}
            </span>
            <p className="mt-1 text-xs text-gray-muted">Full access to clinical & policy reporting</p>
          </div>
          <div className="mt-2 sm:mt-0 text-left sm:text-right">
            <span className="font-serif text-3xl font-extrabold text-white">
              {currency} {amount}
            </span>
            <span className="text-xs text-gray-muted block">{pricing[tier].period}</span>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-muted mb-3">
            Select Payment Method
          </label>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* M-Pesa Option */}
            <button
              type="button"
              onClick={() => setSelectedGateway("mpesa")}
              className={`flex flex-col items-center justify-center rounded-xl border p-4 transition ${
                selectedGateway === "mpesa"
                  ? "border-[#22c55e] bg-[#22c55e]/10 text-white shadow-lg shadow-[#22c55e]/10"
                  : "border-charcoal bg-black/40 text-gray-muted hover:border-zinc-700"
              }`}
            >
              <div className="mb-2 flex h-8 items-center rounded bg-[#41B649] px-2.5 font-sans text-xs font-black tracking-tight text-white">
                M-PESA
              </div>
              <span className="text-[11px] font-medium">STK Push</span>
            </button>

            {/* Visa / Mastercard Option */}
            <button
              type="button"
              onClick={() => setSelectedGateway("card")}
              className={`flex flex-col items-center justify-center rounded-xl border p-4 transition ${
                selectedGateway === "card"
                  ? "border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10"
                  : "border-charcoal bg-black/40 text-gray-muted hover:border-zinc-700"
              }`}
            >
              <div className="mb-2 flex items-center gap-1">
                <span className="rounded bg-[#1A1F71] px-1.5 py-0.5 text-[10px] font-bold text-white">VISA</span>
                <div className="flex -space-x-1">
                  <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
                  <span className="h-4 w-4 rounded-full bg-[#F79E1B]/90" />
                </div>
              </div>
              <span className="text-[11px] font-medium">Card / Paystack</span>
            </button>

            {/* PayPal Option */}
            <button
              type="button"
              onClick={() => setSelectedGateway("paypal")}
              className={`flex flex-col items-center justify-center rounded-xl border p-4 transition ${
                selectedGateway === "paypal"
                  ? "border-[#0070ba] bg-[#0070ba]/10 text-white shadow-lg shadow-[#0070ba]/10"
                  : "border-charcoal bg-black/40 text-gray-muted hover:border-zinc-700"
              }`}
            >
              <div className="mb-2 flex h-8 items-center rounded bg-[#003087] px-2.5 font-serif text-xs font-extrabold italic text-[#0070ba]">
                <span className="text-white">Pay</span><span className="text-[#0079C1]">Pal</span>
              </div>
              <span className="text-[11px] font-medium">International</span>
            </button>
          </div>
        </div>

        {/* Conditional Gateway Action */}
        <div className="mt-8">
          {selectedGateway === "mpesa" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/5 p-3 text-left text-xs text-[#22c55e]">
                ✓ Selected M-Pesa ({currency} {amount}): Instant STK push to your mobile number via Paystack.
              </div>
              <PaystackCheckoutButton amountInKes={effectiveKesAmount} />
            </div>
          )}

          {selectedGateway === "card" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-blue-500/35 bg-blue-500/5 p-3 text-left text-xs text-blue-400">
                ✓ Selected Visa / Mastercard: Secure card gateway via Paystack.
              </div>
              <PaystackCheckoutButton amountInKes={effectiveKesAmount} />
            </div>
          )}

          {selectedGateway === "paypal" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-[#0070ba]/35 bg-[#0070ba]/5 p-3 text-left text-xs text-[#38bdf8]">
                ✓ Selected PayPal: Redirecting to international PayPal checkout.
              </div>
              <a
                href={`/api/checkout/paypal?tier=${tier}&currency=${currency}`}
                className="block w-full rounded-xl bg-[#0070ba] px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#003087]"
              >
                Pay with PayPal ({currency} {amount})
              </a>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-muted">
          Supports M-Pesa, Visa, and Mastercard via Paystack • Instant access activation upon verification.
        </p>
      </div>
    </div>
  );
}
