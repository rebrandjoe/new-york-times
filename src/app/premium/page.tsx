"use client";

import { useState, useEffect } from "react";
import { PaystackCheckoutButton } from "@/components/PaystackCheckoutButton";
import { PaypalCheckoutButton } from "@/components/PaypalCheckoutButton";

type PaymentGateway = "mpesa" | "card" | "paypal" | null;
type BillingTier = "monthly" | "annual";

export default function PremiumPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [tier, setTier] = useState<BillingTier>("monthly");
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("mpesa");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center text-white">
        Loading membership options...
      </div>
    );
  }

  // Display-only prices for UI. Server loads authoritative amounts from subscription_plans.
  const pricing = {
    monthly: { KES: 390, USD: 4, label: "Monthly Access", period: "/ month" },
    annual: { KES: 3900, USD: 39, label: "Annual Access", period: "/ year (Save ~16%)" },
  };

  const displayKes = pricing[tier].KES;
  const displayUsd = pricing[tier].USD;
  const planSlug = tier;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-charcoal bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Member Access
      </div>

      <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
        Unlock Premium Health Journalism
      </h1>

      <p className="mt-4 font-serif text-lg font-semibold text-white">Go beyond the headline.</p>

      <p className="mt-3 text-sm text-gray-secondary-light leading-relaxed">
        Gain access to in-depth investigative health reports, original analysis of medical research, and
        selected reports from the JOSEPH MMWA archive.
      </p>

      <p className="mt-3 text-sm text-gray-muted leading-relaxed">
        Premium members also enjoy an uninterrupted, ad-free reading experience across the site.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex rounded-xl border border-charcoal bg-[#0F0F0F] p-1">
          <button
            type="button"
            onClick={() => setTier("monthly")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              tier === "monthly" ? "bg-zinc-800 text-white" : "text-gray-muted hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setTier("annual")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              tier === "annual" ? "bg-zinc-800 text-white" : "text-gray-muted hover:text-white"
            }`}
          >
            Annual <span className="text-accent">Best Value</span>
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-charcoal bg-[#0F0F0F] p-8 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-charcoal pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              {pricing[tier].label}
            </span>
            <div className="mt-3 text-left">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-muted mb-2">
                Premium includes
              </div>
              <ul className="space-y-1.5 text-xs text-gray-secondary-light">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Investigative health reporting
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> In-depth medical research analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Selected archive reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Ad-free reading
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right">
            <span className="font-serif text-3xl font-extrabold text-white">
              ${displayUsd}
            </span>
            <span className="mt-1 block font-serif text-lg font-semibold text-gray-secondary-light">
              KES {displayKes.toLocaleString("en-KE")}
            </span>
            <span className="text-xs text-gray-muted block">{pricing[tier].period}</span>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-muted mb-3">
            Select Payment Method
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              <span className="text-[11px] font-medium">STK Push · KES</span>
            </button>

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
              <span className="text-[11px] font-medium">Card · USD / KES</span>
            </button>

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
                <span className="text-white">Pay</span>
                <span className="text-[#0079C1]">Pal</span>
              </div>
              <span className="text-[11px] font-medium">International · USD</span>
            </button>
          </div>
        </div>

        <div className="mt-8">
          {selectedGateway === "mpesa" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/5 p-3 text-left text-xs text-[#22c55e]">
                ✓ Selected M-Pesa: ${displayUsd} / KES {displayKes.toLocaleString("en-KE")} — STK push via
                Paystack (charged in KES).
              </div>
              <PaystackCheckoutButton
                planSlug={planSlug}
                displayAmountKes={displayKes}
                displayAmountUsd={displayUsd}
                method="mpesa"
              />
            </div>
          )}

          {selectedGateway === "card" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-blue-500/35 bg-blue-500/5 p-3 text-left text-xs text-blue-400">
                ✓ Selected Visa / Mastercard: ${displayUsd} / KES {displayKes.toLocaleString("en-KE")} —
                card checkout via Paystack.
              </div>
              <PaystackCheckoutButton
                planSlug={planSlug}
                displayAmountKes={displayKes}
                displayAmountUsd={displayUsd}
                method="card"
              />
            </div>
          )}

          {selectedGateway === "paypal" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-[#0070ba]/35 bg-[#0070ba]/5 p-3 text-left text-xs text-[#38bdf8]">
                ✓ Selected PayPal: ${displayUsd} / KES {displayKes.toLocaleString("en-KE")} — international
                checkout in USD (charged via PayPal Sandbox/Live).
              </div>
              <PaypalCheckoutButton
                planSlug={planSlug}
                displayAmountUsd={displayUsd}
                displayAmountKes={displayKes}
              />
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-muted">
          Prices shown in USD and KES. M-Pesa and Paystack card settle in KES; PayPal in USD.
        </p>
      </div>
    </div>
  );
}
