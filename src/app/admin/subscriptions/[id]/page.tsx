import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { getSubscriptionDetail } from "@/lib/actions/admin-subscriptions";
import { SubscriptionAdjustForm } from "@/components/admin/SubscriptionAdjustForm";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function AdminSubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const detail = await getSubscriptionDetail(id);
  if (!detail) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-extrabold text-white">{detail.userEmail}</h1>
      <p className="mt-1 text-sm text-gray-muted">Subscription {detail.id}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <dl className="space-y-2 border border-charcoal bg-charcoal-deep p-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-muted">Plan</dt>
            <dd className="text-offwhite">{detail.planName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-muted">Status</dt>
            <dd className="text-offwhite">{detail.status}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-muted">Provider</dt>
            <dd className="capitalize text-offwhite">{detail.provider ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-muted">Current period</dt>
            <dd className="text-offwhite">
              {formatDate(detail.currentPeriodStart)} – {formatDate(detail.currentPeriodEnd)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-muted">Cancel at period end</dt>
            <dd className="text-offwhite">{detail.cancelAtPeriodEnd ? "Yes" : "No"}</dd>
          </div>
        </dl>

        <SubscriptionAdjustForm subscriptionId={detail.id} currentStatus={detail.status} />
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-lg font-bold text-white">Payment history</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal text-xs uppercase tracking-wide text-gray-muted">
                <th className="py-2 pr-4 font-semibold">Date</th>
                <th className="py-2 pr-4 font-semibold">Provider</th>
                <th className="py-2 pr-4 font-semibold">Method</th>
                <th className="py-2 pr-4 font-semibold">Amount</th>
                <th className="py-2 pr-4 font-semibold">Status</th>
                <th className="py-2 pr-4 font-semibold">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal">
              {detail.payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-muted">
                    No payments recorded.
                  </td>
                </tr>
              ) : (
                detail.payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-2 pr-4 text-gray-secondary-light">{formatDate(payment.createdAt)}</td>
                    <td className="py-2 pr-4 capitalize text-gray-secondary-light">{payment.provider}</td>
                    <td className="py-2 pr-4 capitalize text-gray-secondary-light">{payment.method ?? "—"}</td>
                    <td className="py-2 pr-4 text-offwhite">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </td>
                    <td className="py-2 pr-4 capitalize text-gray-secondary-light">{payment.status}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-gray-muted">{payment.providerReference}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-lg font-bold text-white">History</h2>
        <div className="mt-3 space-y-2">
          {detail.history.length === 0 ? (
            <p className="text-sm text-gray-muted">No history yet.</p>
          ) : (
            detail.history.map((entry) => (
              <div key={entry.id} className="border border-charcoal bg-charcoal-deep p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-offwhite">{entry.event}</span>
                  <span className="text-xs text-gray-muted">{formatDate(entry.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-gray-muted">
                  {entry.previousStatus ?? "—"} → {entry.newStatus ?? "—"} · by {entry.actor}
                </p>
                {entry.note && <p className="mt-1 text-gray-secondary-light">{entry.note}</p>}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
