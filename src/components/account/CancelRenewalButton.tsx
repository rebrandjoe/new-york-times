"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelRenewal } from "@/lib/actions/premium";

export function CancelRenewalButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Cancel renewal? You'll keep access until the end of your current paid period.")) return;
    startTransition(async () => {
      const result = await cancelRenewal();
      if ("error" in result) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className="focus-ring border border-charcoal px-4 py-2 text-sm font-semibold text-offwhite hover:border-live-red hover:text-live-red disabled:opacity-50"
    >
      {isPending ? "Cancelling…" : "Cancel renewal"}
    </button>
  );
}
