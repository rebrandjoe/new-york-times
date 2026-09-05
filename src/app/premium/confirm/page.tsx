import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Membership Confirmation",
  robots: { index: false, follow: false },
};

async function loadPaymentOutcome(paymentId: string | undefined) {
  if (!paymentId) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("payments")
    .select("status, subscription_id")
    .eq("id", paymentId)
    .eq("user_id", user.id)
    .maybeSingle();

  return data;
}

export default async function PremiumConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; result?: string }>;
}) {
  const params = await searchParams;
  const payment = await loadPaymentOutcome(params.payment_id);

  // Never trust the redirect's own "result" query param — the database row,
  // written only after independent server-side verification, is the truth.
  const activated = !!payment?.subscription_id && payment.status === "successful";

  if (activated) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-success">Success</p>
        <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
          Welcome to JOSEPH MMWA Premium
        </h1>
        <p className="mt-4 border-l-2 border-success bg-success/10 px-4 py-3 text-left text-base text-offwhite sm:text-lg">
          Your subscription is active. You now have access to premium content across JOSEPH MMWA.
        </p>
        <Link
          href="/latest"
          className="focus-ring mt-8 inline-block bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Explore Premium
        </Link>
      </div>
    );
  }

  const pending = payment?.status === "pending" || payment?.status === "processing";

  if (pending) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Pending</p>
        <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
          We&apos;re confirming your payment
        </h1>
        <p className="mt-4 text-base text-gray-secondary-light">
          This can take a moment. Your membership will activate automatically the instant it&apos;s
          confirmed — no need to pay again.
        </p>
        <Link
          href="/account"
          className="focus-ring mt-8 inline-block border border-charcoal px-6 py-3 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
        >
          Check status in your account
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-live-red">Not activated</p>
      <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
        Your subscription wasn&apos;t activated
      </h1>
      <p className="mt-4 text-base text-gray-secondary-light">
        The payment wasn&apos;t completed, so nothing was charged and no subscription was started.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/premium"
          className="focus-ring bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Try again
        </Link>
        <Link
          href="/premium"
          className="focus-ring border border-charcoal px-6 py-3 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
        >
          Choose another payment method
        </Link>
      </div>
    </div>
  );
}
