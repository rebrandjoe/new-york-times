"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMedia } from "@/lib/actions/admin-media";
import type { CmsMedia } from "@/lib/cms/types";

export function MediaLibraryGrid({ media }: { media: CmsMedia[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onDelete(id: string) {
    if (!confirm("Delete this media item? It cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteMedia(id);
      if ("error" in result) alert(result.error);
      router.refresh();
    });
  }

  if (media.length === 0) {
    return <p className="mt-8 text-gray-muted">No media uploaded yet.</p>;
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {media.map((item) => (
        <div key={item.id} className="border border-charcoal bg-charcoal-deep">
          <div className="relative aspect-video bg-black">
            {item.type === "image" ? (
              <Image src={item.url} alt={item.altText ?? ""} fill sizes="240px" className="object-cover" />
            ) : (
              <video src={item.url} className="h-full w-full object-cover" muted />
            )}
          </div>
          <div className="p-3">
            <p className="truncate text-xs text-gray-secondary-light">{item.altText || "No alt text"}</p>
            <button
              type="button"
              disabled={isPending}
              onClick={() => onDelete(item.id)}
              className="focus-ring mt-2 text-xs font-semibold text-live-red hover:underline disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
