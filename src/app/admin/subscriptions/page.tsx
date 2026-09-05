import Link from "next/link";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { getSubscriptionStats, listSubscriptionsAdmin } from "@/lib/actions/admin-subscriptions";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUSES = [
  { value: undefined, label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
  { value: "payment_failed", label: "Payment failed" },
  { value: "suspended", label: "Suspended" },
] as const;

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const [stats, subscriptions] = await Promise.all([
    getSubscriptionStats(),
    listSubscriptionsAdmin({ status: params.status, search: params.search }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-extrabold text-white">Subscriptions</h1>

      {!stats.configured && (
        <p className="mt-4 border-l-2 border-accent bg-accent/10 px-4 py-3 text-sm text-offwhite">
          Payment processing isn&apos;t configured yet — add <code>SUPABASE_SERVICE_ROLE_KEY</code> and your
          payment provider credentials as environment variables to start accepting real subscriptions.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Active", value: stats.active },
          { label: "Expired", value: stats.expired },
          { label: "Cancelled", value: stats.cancelled },
          { label: "Pending payments", value: stats.pendingPayments },
          { label: "Failed payments", value: stats.failedPayments },
        ].map((stat) => (
          <div key={stat.label} className="border border-charcoal bg-charcoal-deep p-4">
            <p className="font-serif text-2xl font-extrabold text-white">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {Object.keys(stats.revenueByCurrency).length > 0 && (
        <div className="mt-4 border border-charcoal bg-charcoal-deep p-4">
          <p className="text-xs uppercase tracking-wide text-gray-muted">Revenue (verified payments)</p>
          <p className="mt-1 font-serif text-xl font-extrabold text-success">
            {Object.entries(stats.revenueByCurrency)
              .map(([currency, amount]) => `${currency} ${amount.toLocaleString()}`)
              .join("  ·  ")}
          </p>
        </div>
      )}

      <form className="mt-8 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="search"
          defaultValue={params.search}
          placeholder="Search by email…"
          className="focus-ring border border-white/10 bg-charcoal-deep px-4 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="focus-ring border border-white/10 bg-charcoal-deep px-4 py-2 text-sm text-offwhite focus:border-accent"
        >
          {STATUSES.map((s) => (
            <option key={s.label} value={s.value ?? ""}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="focus-ring border border-charcoal px-4 py-2 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal text-xs uppercase tracking-wide text-gray-muted">
              <th className="py-3 pr-4 font-semibold">Member</th>
              <th className="py-3 pr-4 font-semibold">Plan</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Provider</th>
              <th className="py-3 pr-4 font-semibold">Renews / ends</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal">
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-muted">
                  No subscriptions match these filters.
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="py-3 pr-4">
                    <Link href={`/admin/subscriptions/${sub.id}`} className="focus-ring text-white hover:text-accent">
                      {sub.userEmail}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-gray-secondary-light">{sub.planName}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        sub.status === "active" ? "border-success text-success" : "border-charcoal text-gray-muted"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 capitalize text-gray-secondary-light">{sub.provider ?? "—"}</td>
                  <td className="py-3 pr-4 text-gray-secondary-light">
                    {formatDate(sub.currentPeriodEnd)}
                    {sub.cancelAtPeriodEnd && " (cancelling)"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
