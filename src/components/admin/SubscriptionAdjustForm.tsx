"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adjustSubscriptionStatus } from "@/lib/actions/admin-subscriptions";
import type { SubscriptionStatus } from "@/lib/premium/types";

const STATUSES: SubscriptionStatus[] = [
  "active",
  "trial",
  "pending",
  "cancelled",
  "expired",
  "payment_failed",
  "suspended",
];

export function SubscriptionAdjustForm({
  subscriptionId,
  currentStatus,
}: {
  subscriptionId: string;
  currentStatus: SubscriptionStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<SubscriptionStatus>(currentStatus);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await adjustSubscriptionStatus(subscriptionId, status, reason);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setReason("");
      router.refresh();
    });
  }

  return (
    <div className="border border-charcoal bg-charcoal-deep p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-muted">Manual adjustment</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
          className="focus-ring border border-white/10 bg-black px-3 py-2 text-sm text-offwhite focus:border-accent"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for this change (required, logged)"
          className="focus-ring min-w-[240px] flex-1 border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent"
        />
        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="focus-ring border border-charcoal px-4 py-2 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Apply"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-live-red">{error}</p>}
      <p className="mt-2 text-xs text-gray-muted">
        Every change here is recorded in the audit log with your account, the reason, and a timestamp.
      </p>
    </div>
  );
}
