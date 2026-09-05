import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyPaymentHistory, getMySubscription, isSubscriptionCurrentlyActive } from "@/lib/premium/access";
import { formatKes, formatUsd } from "@/lib/premium/plans";
import { signOutAction } from "@/lib/actions/auth";
import { CancelRenewalButton } from "@/components/account/CancelRenewalButton";

export const metadata: Metadata = {
  title: "Your Account",
  robots: { index: false, follow: false },
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  trial: "Trial",
  pending: "Pending",
  cancelled: "Cancels at period end",
  expired: "Expired",
  payment_failed: "Payment failed",
  suspended: "Suspended",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?redirectTo=/account");

  const [subscription, payments] = await Promise.all([
    getMySubscription(user.id),
    getMyPaymentHistory(user.id),
  ]);

  const fullName = (user.user_metadata?.full_name as string | undefined)?.trim();
  const isCurrentlyActive = isSubscriptionCurrentlyActive(subscription);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Account</p>
      <h1 className="mt-3 font-serif text-3xl font-extrabold text-white sm:text-4xl">Your Account</h1>

      <section className="mt-10 border border-charcoal bg-charcoal-deep p-6">
        <h2 className="font-serif text-lg font-bold text-white">Profile</h2>
        <dl className="mt-4 space-y-2 text-sm">
          {fullName && (
            <div className="flex justify-between gap-4">
              <dt className="text-gray-muted">Name</dt>
              <dd className="text-offwhite">{fullName}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-gray-muted">Email</dt>
            <dd className="text-offwhite">{user.email}</dd>
          </div>
        </dl>
        <form action={signOutAction} className="mt-4">
          <button type="submit" className="focus-ring text-sm font-semibold text-gray-secondary-light hover:text-accent">
            Sign out
          </button>
        </form>
      </section>

      <section className="mt-6 border border-charcoal bg-charcoal-deep p-6">
        <h2 className="font-serif text-lg font-bold text-white">Membership</h2>

        {!subscription ? (
          <>
            <p className="mt-3 text-sm text-gray-secondary-light">
              You don&apos;t have a JOSEPH MMWA Premium membership yet. An account gives you full access
              to free content — premium articles need a membership.
            </p>
            <Link
              href="/premium"
              className="focus-ring mt-4 inline-block bg-accent px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              Become a member
            </Link>
          </>
        ) : (
          <>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-muted">Status</dt>
                <dd className={isCurrentlyActive ? "text-success" : "text-offwhite"}>
                  {STATUS_LABELS[subscription.status] ?? subscription.status}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-muted">Plan</dt>
                <dd className="text-offwhite">
                  {subscription.plan.name} — {formatUsd(subscription.plan.priceUsd)} /{" "}
                  {subscription.plan.billingInterval === "monthly" ? "month" : "year"} (
                  {formatKes(subscription.plan.priceKes)})
                </dd>
              </div>
              {subscription.provider && (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-muted">Payment method</dt>
                  <dd className="capitalize text-offwhite">{subscription.provider}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-gray-muted">Started</dt>
                <dd className="text-offwhite">{formatDate(subscription.currentPeriodStart)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-muted">
                  {subscription.cancelAtPeriodEnd ? "Access ends" : "Renews"}
                </dt>
                <dd className="text-offwhite">{formatDate(subscription.currentPeriodEnd)}</dd>
              </div>
            </dl>

            {subscription.cancelAtPeriodEnd && (
              <p className="mt-4 border-l-2 border-accent bg-accent/10 px-4 py-3 text-sm text-offwhite">
                Your renewal is cancelled. You&apos;ll keep full access until{" "}
                {formatDate(subscription.currentPeriodEnd)}.
              </p>
            )}

            {isCurrentlyActive && !subscription.cancelAtPeriodEnd && (
              <div className="mt-4">
                <CancelRenewalButton />
              </div>
            )}
          </>
        )}
      </section>

      {payments.length > 0 && (
        <section className="mt-6 border border-charcoal bg-charcoal-deep p-6">
          <h2 className="font-serif text-lg font-bold text-white">Payment history</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-charcoal text-xs uppercase tracking-wide text-gray-muted">
                  <th className="py-2 pr-4 font-semibold">Date</th>
                  <th className="py-2 pr-4 font-semibold">Method</th>
                  <th className="py-2 pr-4 font-semibold">Amount</th>
                  <th className="py-2 pr-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-2 pr-4 text-gray-secondary-light">{formatDate(payment.createdAt)}</td>
                    <td className="py-2 pr-4 capitalize text-gray-secondary-light">{payment.method ?? "—"}</td>
                    <td className="py-2 pr-4 text-offwhite">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </td>
                    <td className="py-2 pr-4 capitalize text-gray-secondary-light">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
