"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  archiveTickerItem,
  createTickerItem,
  deleteTickerItem,
  publishTickerItem,
  updateTickerItem,
  type TickerItemRow,
} from "@/lib/actions/admin-ticker";
import { initialTickerFormState } from "@/lib/actions/form-state";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TickerManager({ items }: { items: TickerItemRow[] }) {
  const [state, formAction, isPending] = useActionState(createTickerItem, initialTickerFormState);
  const router = useRouter();
  const [isTransitioning, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHeadline, setEditHeadline] = useState("");
  const [editHref, setEditHref] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  function startEdit(item: TickerItemRow) {
    setEditingId(item.id);
    setEditHeadline(item.headline);
    setEditHref(item.href ?? "");
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditHeadline("");
    setEditHref("");
    setEditError(null);
  }

  function onSaveEdit(id: string) {
    setEditError(null);
    startTransition(async () => {
      const result = await updateTickerItem(id, {
        headline: editHeadline,
        href: editHref,
      });
      if ("error" in result) {
        setEditError(result.error);
        return;
      }
      cancelEdit();
      router.refresh();
    });
  }

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
      <form action={formAction} className="flex flex-col gap-3 border border-charcoal bg-charcoal-deep p-6">
        <div className="flex flex-wrap gap-3">
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
        </div>
        <input
          type="text"
          name="href"
          placeholder="Story link (optional) — e.g. /article/your-story-slug or full URL"
          className="focus-ring w-full border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent"
        />
        <p className="text-xs text-gray-muted">
          When set, clicking the live ticker on the site opens this story. Leave blank for text-only.
        </p>
        {state.status === "error" && <p className="text-sm text-live-red">{state.message}</p>}
        {state.status === "success" && <p className="text-sm text-accent">{state.message}</p>}
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal text-xs uppercase tracking-wide text-gray-muted">
              <th className="py-3 pr-4 font-semibold">Headline</th>
              <th className="py-3 pr-4 font-semibold">Link</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Created</th>
              <th className="py-3 pr-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-muted">
                  No ticker items yet.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id}>
                    <td className="max-w-sm py-3 pr-4 align-top">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editHeadline}
                          onChange={(e) => setEditHeadline(e.target.value)}
                          className="focus-ring w-full border border-white/10 bg-black px-2 py-1.5 text-sm font-semibold text-white focus:border-accent"
                          aria-label="Edit headline"
                        />
                      ) : (
                        <span className="font-semibold text-white">{item.headline}</span>
                      )}
                    </td>
                    <td className="max-w-[14rem] py-3 pr-4 align-top">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editHref}
                          onChange={(e) => setEditHref(e.target.value)}
                          placeholder="/article/slug"
                          className="focus-ring w-full border border-white/10 bg-black px-2 py-1.5 text-xs text-offwhite focus:border-accent"
                          aria-label="Edit story link"
                        />
                      ) : (
                        <span className="truncate text-xs text-gray-secondary-light">
                          {item.href || "—"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 align-top">
                      {item.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 border border-[#c41212]/60 bg-[#c41212]/15 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#ff4d4d]">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-[#ff2d2d] motion-safe:animate-pulse"
                          />
                          Live
                        </span>
                      ) : (
                        <span className="border border-charcoal px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-muted">
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 align-top text-gray-secondary-light">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3 pr-4 align-top">
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2 text-xs font-semibold">
                            <button
                              type="button"
                              disabled={isTransitioning || !editHeadline.trim()}
                              onClick={() => onSaveEdit(item.id)}
                              className="focus-ring bg-accent px-2.5 py-1 text-[11px] font-bold text-black disabled:opacity-50"
                            >
                              {isTransitioning ? "Saving…" : "Save"}
                            </button>
                            <button
                              type="button"
                              disabled={isTransitioning}
                              onClick={cancelEdit}
                              className="focus-ring border border-charcoal px-2.5 py-1 text-[11px] font-bold text-gray-secondary-light hover:text-white disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                          {editError && <p className="text-xs text-live-red">{editError}</p>}
                          {item.status === "published" && (
                            <p className="text-[11px] text-gray-muted">
                              Live on the site — changes apply after save.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3 text-xs font-semibold">
                          <button
                            type="button"
                            disabled={isTransitioning}
                            onClick={() => startEdit(item)}
                            className="focus-ring text-offwhite hover:text-accent disabled:opacity-50"
                          >
                            Edit
                          </button>
                          {item.status !== "published" && (
                            <button
                              type="button"
                              disabled={isTransitioning}
                              onClick={() => onPublish(item.id)}
                              className="focus-ring inline-flex items-center gap-1.5 border border-[#c41212]/50 bg-[#c41212]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#ff4d4d] transition-colors hover:bg-[#c41212]/20 disabled:opacity-50"
                            >
                              Go live
                            </button>
                          )}
                          {item.status === "published" && (
                            <button
                              type="button"
                              disabled={isTransitioning}
                              onClick={() => onArchive(item.id)}
                              className="focus-ring border border-charcoal px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-secondary-light transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
                            >
                              Take offline
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={isTransitioning}
                            onClick={() => onDelete(item.id)}
                            className="focus-ring text-gray-muted hover:text-live-red disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
