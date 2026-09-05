"use client";

import Image from "next/image";
import type { CmsMedia } from "@/lib/cms/types";

export function MediaPickerField({
  media,
  value,
  onChange,
}: {
  media: CmsMedia[];
  value: string;
  onChange: (media: CmsMedia | null) => void;
}) {
  const selected = media.find((m) => m.id === value) ?? null;

  return (
    <div className="flex items-center gap-3">
      {selected && (
        <span className="relative h-12 w-16 shrink-0 overflow-hidden bg-black">
          <Image src={selected.url} alt={selected.altText ?? ""} fill sizes="64px" className="object-cover" />
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(media.find((m) => m.id === e.target.value) ?? null)}
        className="focus-ring w-full border border-white/10 bg-black px-3 py-2 text-sm text-offwhite focus:border-accent"
      >
        <option value="">Select from media library…</option>
        {media.map((m) => (
          <option key={m.id} value={m.id}>
            {m.altText || m.url.split("/").pop()}
          </option>
        ))}
      </select>
    </div>
  );
}
