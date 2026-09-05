"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { SubscriptionPlan } from "@/lib/premium/types";
import { formatKes, formatUsd } from "@/lib/premium/plans";
import {
  checkPaymentStatus,
  initiateCardCheckout,
  initiateMpesaCheckout,
  initiatePaypalCheckout,
} from "@/lib/actions/premium";
import { MastercardMark, MpesaMark, PaypalMark, VisaMark } from "./PaymentMethodIcons";

type Method = "mpesa" | "card" | "paypal";

function fieldClass() {
  return "focus-ring mt-2 w-full border border-white/10 bg-charcoal-deep px-4 py-3 text-sm text-offwhite placeholder:text-gray-muted transition-colors focus:border-accent";
}

export function MembershipFlow({
  plans,
  isSignedIn,
}: {
  plans: SubscriptionPlan[];
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("plan");

  const [selectedSlug, setSelectedSlug] = useState(
    plans.find((p) => p.slug === initialSlug)?.slug ?? plans[0]?.slug ?? ""
  );
  const [method, setMethod] = useState<Method | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mpesaWaiting, setMpesaWaiting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedPlan = plans.find((p) => p.slug === selectedSlug) ?? plans[0];

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function goToSignUp() {
    const redirectTo = `/premium?plan=${selectedSlug}`;
    router.push(`/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  function pollMpesaStatus(id: string) {
    setMpesaWaiting(true);
    pollRef.current = setInterval(() => {
      startTransition(async () => {
        const result = await checkPaymentStatus(id);
        if ("error" in result) return;
        if (result.activated || result.status === "successful") {
          if (pollRef.current) clearInterval(pollRef.current);
          router.push(`/premium/confirm?payment_id=${id}&result=success`);
        } else if (["failed", "cancelled", "expired"].includes(result.status)) {
          if (pollRef.current) clearInterval(pollRef.current);
          setMpesaWaiting(false);
          setError("The payment was not completed. You can try again below.");
        }
      });
    }, 3000);
  }

  function handleChooseMethod(next: Method) {
    if (!isSignedIn) {
      goToSignUp();
      return;
    }
    setError(null);
    setMethod(next);
  }

  function handleMpesaSubmit() {
    if (!phoneNumber.trim()) {
      setError("Please enter the phone number to send the M-Pesa prompt to.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await initiateMpesaCheckout(selectedSlug, phoneNumber.trim());
      if ("error" in result) {
        setError(
          result.error === "provider_error" ? result.message : "Something went wrong. Please try again."
        );
        return;
      }
      pollMpesaStatus(result.paymentId);
    });
  }

  function handleCardCheckout() {
    setError(null);
    startTransition(async () => {
      const result = await initiateCardCheckout(selectedSlug);
      if ("error" in result) {
        setError(
          result.error === "provider_error" ? result.message : "Something went wrong. Please try again."
        );
        return;
      }
      if ("checkoutUrl" in result) window.location.href = result.checkoutUrl;
    });
  }

  function handlePaypalCheckout() {
    setError(null);
    startTransition(async () => {
      const result = await initiatePaypalCheckout(selectedSlug);
      if ("error" in result) {
        setError(
          result.error === "provider_error" ? result.message : "Something went wrong. Please try again."
        );
        return;
      }
      if ("checkoutUrl" in result) window.location.href = result.checkoutUrl;
    });
  }

  if (!selectedPlan) {
    return (
      <p className="text-gray-secondary-light">
        Membership plans aren&apos;t available right now. Please check back shortly.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Premium</p>
      <h1 className="mt-3 font-serif text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl">
        Join JOSEPH MMWA
      </h1>
      <p className="mt-4 text-base text-gray-secondary-light sm:text-lg">
        A membership that supports independent health and medical journalism — full access to every
        story, with no paywall in the way once you&apos;re in.
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-lg font-bold text-white">Choose your membership</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plans.map((plan) => {
            const active = plan.slug === selectedSlug;
            return (
              <button
                key={plan.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(plan.slug);
                  setMethod(null);
                  setError(null);
                }}
                className={`focus-ring relative border p-5 text-left transition-colors ${
                  active ? "border-accent bg-charcoal-deep" : "border-charcoal bg-charcoal-deep/50 hover:border-white/20"
                }`}
              >
                {plan.discountLabel && (
                  <span className="absolute -top-3 right-4 bg-accent px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
                    {plan.discountLabel}
                  </span>
                )}
                <p className="text-sm font-bold uppercase tracking-wide text-gray-secondary-light">
                  {plan.name}
                </p>
                <p className="mt-2 font-serif text-2xl font-extrabold text-white">
                  {formatUsd(plan.priceUsd)}
                  <span className="text-sm font-normal text-gray-muted">
                    {" "}
                    / {plan.billingInterval === "monthly" ? "month" : "year"}
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-muted">or {formatKes(plan.priceKes)} via M-Pesa</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10 border-t border-charcoal pt-8">
        <h2 className="font-serif text-lg font-bold text-white">Membership benefits</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-secondary-light sm:text-base">
          {selectedPlan.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2">
              <span className="text-accent">—</span>
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border-t border-charcoal pt-8">
        <h2 className="font-serif text-lg font-bold text-white">Choose how to pay</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handleChooseMethod("mpesa")}
            className={`focus-ring flex items-center justify-center gap-2 border p-4 transition-colors ${
              method === "mpesa" ? "border-accent" : "border-charcoal hover:border-white/20"
            }`}
          >
            <MpesaMark />
          </button>
          <button
            type="button"
            onClick={() => handleChooseMethod("card")}
            className={`focus-ring flex items-center justify-center gap-3 border p-4 transition-colors ${
              method === "card" ? "border-accent" : "border-charcoal hover:border-white/20"
            }`}
          >
            <VisaMark />
            <MastercardMark />
          </button>
          <button
            type="button"
            onClick={() => handleChooseMethod("paypal")}
            className={`focus-ring flex items-center justify-center border p-4 transition-colors ${
              method === "paypal" ? "border-accent" : "border-charcoal hover:border-white/20"
            }`}
          >
            <PaypalMark />
          </button>
        </div>

        {!isSignedIn && (
          <p className="mt-4 text-sm text-gray-secondary-light">
            You&apos;ll need an account to subscribe.{" "}
            <button type="button" onClick={goToSignUp} className="text-accent underline underline-offset-2">
              Sign in or create one
            </button>{" "}
            — we&apos;ll bring you right back here.
          </p>
        )}

        {isSignedIn && method === "mpesa" && !mpesaWaiting && (
          <div className="mt-6 border border-charcoal bg-charcoal-deep p-6">
            <label htmlFor="mpesa-phone" className="text-sm font-semibold text-offwhite">
              M-Pesa phone number
            </label>
            <input
              id="mpesa-phone"
              type="tel"
              placeholder="e.g. 0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={fieldClass()}
            />
            <p className="mt-2 text-xs text-gray-muted">
              You&apos;ll pay {formatKes(selectedPlan.priceKes)}. We&apos;ll send a prompt to this number —
              enter your M-Pesa PIN to complete it.
            </p>
            <button
              type="button"
              disabled={isPending}
              onClick={handleMpesaSubmit}
              className="focus-ring mt-4 w-full bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Sending prompt…" : "Send M-Pesa prompt"}
            </button>
          </div>
        )}

        {mpesaWaiting && (
          <div className="mt-6 border border-accent/40 bg-accent/10 p-6 text-center">
            <p className="font-serif text-lg font-bold text-white">We&apos;re confirming your payment</p>
            <p className="mt-2 text-sm text-gray-secondary-light">
              Check your phone and enter your M-Pesa PIN. This page will continue automatically once
              it&apos;s confirmed.
            </p>
          </div>
        )}

        {isSignedIn && method === "card" && (
          <div className="mt-6 border border-charcoal bg-charcoal-deep p-6">
            <p className="text-sm text-gray-secondary-light">
              You&apos;ll pay {formatUsd(selectedPlan.priceUsd)} securely on our payment partner&apos;s own
              checkout page — your card details are never seen by JOSEPH MMWA.
            </p>
            <button
              type="button"
              disabled={isPending}
              onClick={handleCardCheckout}
              className="focus-ring mt-4 w-full bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Redirecting…" : "Continue to secure checkout"}
            </button>
          </div>
        )}

        {isSignedIn && method === "paypal" && (
          <div className="mt-6 border border-charcoal bg-charcoal-deep p-6">
            <p className="text-sm text-gray-secondary-light">
              You&apos;ll pay {formatUsd(selectedPlan.priceUsd)} via PayPal.
            </p>
            <button
              type="button"
              disabled={isPending}
              onClick={handlePaypalCheckout}
              className="focus-ring mt-4 w-full bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Redirecting…" : "Continue with PayPal"}
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 border border-live-red/40 bg-live-red/10 px-4 py-3 text-sm text-live-red">
            {error}
          </p>
        )}
      </section>

      <p className="mt-10 border-t border-charcoal pt-6 text-xs text-gray-muted">
        Already a member?{" "}
        <Link href="/account" className="text-accent hover:underline">
          Go to your account
        </Link>
        .
      </p>
    </div>
  );
}
