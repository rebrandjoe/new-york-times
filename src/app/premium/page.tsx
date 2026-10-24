"use client";

import { useState, useEffect } from "react";
import { PaystackCheckoutButton } from "@/components/PaystackCheckoutButton";
import { PaypalCheckoutButton } from "@/components/PaypalCheckoutButton";
import { LogoMark, Tagline } from "@/components/Wordmark";

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

/** Safaricom M-PESA wordmark style (green bar). */
function MpesaBrand() {
  return (
    <span
      className="inline-flex h-7 items-center rounded bg-[#41B649] px-2.5 font-sans text-[11px] font-black tracking-tight text-white"
      aria-hidden
    >
      M-PESA
    </span>
  );
}

/** Visa + Mastercard marks side by side. */
function CardBrands() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden>
      <span className="inline-flex h-6 items-center rounded bg-[#1A1F71] px-1.5 text-[10px] font-bold italic tracking-wide text-white">
        VISA
      </span>
      <span className="relative inline-flex h-6 w-10 items-center justify-center">
        <span className="absolute left-0 h-5 w-5 rounded-full bg-[#EB001B]" />
        <span className="absolute right-0 h-5 w-5 rounded-full bg-[#F79E1B]/95" />
      </span>
    </span>
  );
}

/** PayPal wordmark (navy + blue). */
function PaypalBrand() {
  return (
    <span
      className="inline-flex h-7 items-center rounded bg-[#003087] px-2.5 font-serif text-xs font-extrabold italic tracking-tight"
      aria-hidden
    >
      <span className="text-white">Pay</span>
      <span className="text-[#009CDE]">Pal</span>
    </span>
  );
}

function PaymentBrand({ id }: { id: PaymentGateway }) {
  if (id === "mpesa") return <MpesaBrand />;
  if (id === "card") return <CardBrands />;
  return <PaypalBrand />;
}

export default function PremiumPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [tier, setTier] = useState<BillingTier>("monthly");
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("mpesa");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Display-only prices for UI. Server loads authoritative amounts from subscription_plans.
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
      <div className="mx-auto max-w-xl px-4 py-20 text-center text-gray-muted">
        Loading membership options…
      </div>
    );
  }

  return (
    <div className="bg-black text-offwhite">
      <main className="mx-auto max-w-3xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Member Access
          </p>
          <h1 className="mt-4 font-serif text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Health journalism beyond the headlines.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-secondary-light sm:text-base">
            Independent reporting. Deeper analysis. A clearer understanding of the health
            issues shaping our world.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-[420px] justify-center">
          <div
            className="inline-flex border border-charcoal bg-charcoal-deep p-0.5"
            role="group"
            aria-label="Billing period"
          >
            <button
              type="button"
              onClick={() => setTier("monthly")}
              className={`px-4 py-2 text-xs font-bold tracking-wide transition-colors ${
                tier === "monthly"
                  ? "bg-accent text-black"
                  : "bg-transparent text-gray-muted hover:text-offwhite"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setTier("annual")}
              className={`px-4 py-2 text-xs font-bold tracking-wide transition-colors ${
                tier === "annual"
                  ? "bg-accent text-black"
                  : "bg-transparent text-gray-muted hover:text-offwhite"
              }`}
            >
              Annual
              {tier !== "annual" && (
                <span className="ml-1.5 font-semibold text-accent">· Save</span>
              )}
            </button>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[420px] border border-charcoal bg-charcoal-deep">
          <div className="px-6 py-8 sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Premium membership
            </p>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-serif text-4xl font-extrabold tracking-tight text-white">
                ${displayUsd}
              </span>
              <span className="text-sm text-gray-muted">{pricing[tier].periodLabel}</span>
            </div>
            <p className="mt-1.5 text-sm text-gray-secondary-light">{pricing[tier].kesNote}</p>

            <div className="my-7 border-t border-charcoal" />

            <p className="text-xs font-bold uppercase tracking-[0.12em] text-offwhite">
              Your membership includes:
            </p>
            <ul className="mt-4 space-y-3">
              {BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex gap-3 text-sm leading-snug text-gray-secondary-light"
                >
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="my-7 border-t border-charcoal" />

            <p className="text-xs font-bold uppercase tracking-[0.12em] text-offwhite">
              Choose your payment method
            </p>

            <div
              className="mt-4 flex flex-col gap-2.5"
              role="radiogroup"
              aria-label="Payment method"
            >
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
                    subtitle: "Visa · Mastercard · Amount shown at checkout",
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
                    className={`flex w-full items-center gap-3 border px-4 py-3.5 text-left transition-colors ${
                      selected
                        ? "border-accent bg-black/40"
                        : "border-charcoal bg-black/20 hover:border-white/20"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        selected ? "border-accent" : "border-charcoal"
                      }`}
                      aria-hidden
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-accent" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-offwhite">
                        {option.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-gray-muted">
                        {option.subtitle}
                      </span>
                    </span>
                    <span className="shrink-0">
                      <PaymentBrand id={option.id} />
                    </span>
                  </button>
                );
              })}
            </div>

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

            <p className="mt-4 text-center text-[11px] leading-relaxed text-gray-muted">
              Secure payment processing. Review your billing terms before subscribing.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-sm flex-col items-center border-t border-charcoal pt-12 text-center">
          <LogoMark size={72} className="ring-1 ring-charcoal" />
          <p className="mt-4 font-serif text-lg font-bold text-white">Joseph Mmwa</p>
          <Tagline className="mt-1 text-sm text-gray-secondary sm:text-base" />
        </div>
      </main>
    </div>
  );
}
