"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PaystackCheckoutButton } from "@/components/PaystackCheckoutButton";
import { PaypalCheckoutButton } from "@/components/PaypalCheckoutButton";

type PaymentGateway = "mpesa" | "card" | "paypal";
type BillingTier = "monthly" | "annual";

const BENEFITS = [
  "In-depth investigative health reporting",
  "Analysis of medical research and its implications",
  "Selected reports from the Joseph Mmwa archive",
  "An ad-free reading experience across the site",
] as const;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PremiumPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [tier, setTier] = useState<BillingTier>("monthly");
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("mpesa");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Display-only prices for UI. Server loads authoritative amounts from subscription_plans.
  // Keep in sync with price_usd / price_kes in Supabase subscription_plans.
  const pricing = {
    monthly: {
      KES: 260,
      USD: 2,
      periodLabel: "/ month",
      kesNote: "Approximately KES 260 per month",
    },
    annual: {
      KES: 1950,
      USD: 15,
      periodLabel: "/ year",
      kesNote: "Approximately KES 1,950 per year",
    },
  } as const;

  const displayKes = pricing[tier].KES;
  const displayUsd = pricing[tier].USD;
  const planSlug = tier;

  const paystackLabel =
    selectedGateway === "mpesa"
      ? `Continue to payment · KES ${displayKes.toLocaleString("en-KE")}`
      : `Continue to payment · $${displayUsd} / KES ${displayKes.toLocaleString("en-KE")}`;

  const paypalLabel = `Continue to payment · $${displayUsd}`;

  if (!isMounted) {
    return (
      <div className="min-h-[60vh] bg-[#FAF8F3] px-4 py-20 text-center text-[#66615A]">
        Loading membership options…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#111111]">
      {/* A. Minimal publication header */}
      <header className="border-b border-[#DCD6CB] bg-[#FAF8F3]">
        <div className="mx-auto flex max-w-3xl items-baseline justify-between px-4 py-5 sm:px-6">
          <div>
            <Link
              href="/"
              className="font-serif text-lg font-extrabold tracking-tight text-[#0B0B0B] sm:text-xl"
            >
              JOSEPH MMWA
            </Link>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#66615A]">
              Health Journalism
            </p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77613D]">
            Membership
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        {/* B. Editorial introduction */}
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#77613D]">
            Member Access
          </p>
          <h1 className="mt-4 font-serif text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#0B0B0B] sm:text-4xl">
            Health journalism beyond the headlines.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#66615A] sm:text-base">
            Independent reporting. Deeper analysis. A clearer understanding of the health
            issues shaping our world.
          </p>
        </div>

        {/* Billing interval */}
        <div className="mx-auto mt-10 flex max-w-[420px] justify-center">
          <div
            className="inline-flex border border-[#DCD6CB] bg-white p-0.5"
            role="group"
            aria-label="Billing period"
          >
            <button
              type="button"
              onClick={() => setTier("monthly")}
              className={`px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                tier === "monthly"
                  ? "bg-[#0B0B0B] text-white"
                  : "bg-transparent text-[#66615A] hover:text-[#111111]"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setTier("annual")}
              className={`px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                tier === "annual"
                  ? "bg-[#0B0B0B] text-white"
                  : "bg-transparent text-[#66615A] hover:text-[#111111]"
              }`}
            >
              Annual
              {tier === "annual" ? null : (
                <span className="ml-1.5 text-[#77613D]">· Save</span>
              )}
            </button>
          </div>
        </div>

        {/* C. Premium membership card */}
        <div className="mx-auto mt-8 max-w-[420px] border border-[#DCD6CB] bg-white">
          <div className="px-6 py-8 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#77613D]">
              Premium membership
            </p>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-serif text-4xl font-extrabold tracking-tight text-[#0B0B0B]">
                ${displayUsd}
              </span>
              <span className="text-sm text-[#66615A]">{pricing[tier].periodLabel}</span>
            </div>
            <p className="mt-1.5 text-sm text-[#66615A]">{pricing[tier].kesNote}</p>

            <div className="my-7 border-t border-[#DCD6CB]" />

            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
              Your membership includes:
            </p>
            <ul className="mt-4 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-snug text-[#66615A]">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#77613D]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="my-7 border-t border-[#DCD6CB]" />

            {/* D. Payment method selection */}
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
              Choose your payment method
            </p>

            <div className="mt-4 flex flex-col gap-2.5" role="radiogroup" aria-label="Payment method">
              {(
                [
                  {
                    id: "mpesa" as const,
                    title: "M-PESA",
                    subtitle: "Secure STK push · Pay in KES",
                  },
                  {
                    id: "card" as const,
                    title: "Credit or debit card",
                    subtitle: "Visa · Currency and final amount shown at checkout",
                  },
                  {
                    id: "paypal" as const,
                    title: "PayPal",
                    subtitle: "International payments · USD",
                  },
                ] as const
              ).map((option) => {
                const selected = selectedGateway === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSelectedGateway(option.id)}
                    className={`flex w-full items-start gap-3 border px-4 py-3.5 text-left transition-colors ${
                      selected
                        ? "border-[#77613D] bg-[#FAF8F3]"
                        : "border-[#DCD6CB] bg-white hover:border-[#c4bbae]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-[#77613D]"
                          : "border-[#DCD6CB]"
                      }`}
                      aria-hidden
                    >
                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-[#77613D]" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#111111]">
                        {option.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-[#66615A]">
                        {option.subtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* E. Primary payment button */}
            <div className="mt-7">
              {selectedGateway === "mpesa" && (
                <PaystackCheckoutButton
                  planSlug={planSlug}
                  displayAmountKes={displayKes}
                  displayAmountUsd={displayUsd}
                  method="mpesa"
                  buttonLabel={paystackLabel}
                  variant="editorial"
                />
              )}
              {selectedGateway === "card" && (
                <PaystackCheckoutButton
                  planSlug={planSlug}
                  displayAmountKes={displayKes}
                  displayAmountUsd={displayUsd}
                  method="card"
                  buttonLabel={paystackLabel}
                  variant="editorial"
                />
              )}
              {selectedGateway === "paypal" && (
                <PaypalCheckoutButton
                  planSlug={planSlug}
                  displayAmountUsd={displayUsd}
                  displayAmountKes={displayKes}
                  buttonLabel={paypalLabel}
                  variant="editorial"
                />
              )}
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-[#66615A]">
              Secure payment processing. Review your billing terms before subscribing.
            </p>
          </div>
        </div>

        {/* F. Closing brand statement */}
        <div className="mx-auto mt-16 max-w-sm text-center">
          <p className="font-serif text-lg font-semibold text-[#0B0B0B]">
            Journalism that goes deeper.
          </p>
          <p className="mt-1 text-sm text-[#66615A]">If it's health, it's here.</p>
        </div>
      </main>
    </div>
  );
}
