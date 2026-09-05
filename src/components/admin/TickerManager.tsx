"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  archiveTickerItem,
  createTickerItem,
  deleteTickerItem,
  publishTickerItem,
  type TickerItemRow,
} from "@/lib/actions/admin-ticker";
import { initialTickerFormState } from "@/lib/actions/form-state";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function TickerManager({ items }: { items: TickerItemRow[] }) {
  const [state, formAction, isPending] = useActionState(createTickerItem, initialTickerFormState);
  const router = useRouter();
  const [isTransitioning, startTransition] = useTransition();

  function onPublish(id: string) {
    startTransition(async () => {
      await publishTickerItem(id);
      router.refresh();
    });
  }

  function onArchive(id: string) {
    startTransition(async () => {
      await archiveTickerItem(id);
      router.refresh();
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this ticker item?")) return;
    startTransition(async () => {
      await deleteTickerItem(id);
      router.refresh();
    });
  }

  return (
    <div>
      <form action={formAction} className="flex flex-wrap gap-3 border border-charcoal bg-charcoal-deep p-6">
        <input
          type="text"
          name="headline"
          placeholder="Ticker headline text"
          required
          className="focus-ring min-w-[280px] flex-1 border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={isPending}
          className="focus-ring bg-accent px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Adding…" : "Add"}
        </button>
        {state.status === "error" && <p className="w-full text-sm text-live-red">{state.message}</p>}
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal text-xs uppercase tracking-wide text-gray-muted">
              <th className="py-3 pr-4 font-semibold">Headline</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Created</th>
              <th className="py-3 pr-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-muted">
                  No ticker items yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="max-w-sm truncate py-3 pr-4 text-white">{item.headline}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        item.status === "published" ? "border-accent text-accent" : "border-charcoal text-gray-muted"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-secondary-light">{formatDate(item.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-3 text-xs font-semibold">
                      {item.status !== "published" && (
                        <button
                          type="button"
                          disabled={isTransitioning}
                          onClick={() => onPublish(item.id)}
                          className="focus-ring text-accent hover:underline disabled:opacity-50"
                        >
                          Publish
                        </button>
                      )}
                      {item.status === "published" && (
                        <button
                          type="button"
                          disabled={isTransitioning}
                          onClick={() => onArchive(item.id)}
                          className="focus-ring text-gray-secondary-light hover:text-accent disabled:opacity-50"
                        >
                          Archive
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={isTransitioning}
                        onClick={() => onDelete(item.id)}
                        className="focus-ring text-live-red hover:underline disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
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
