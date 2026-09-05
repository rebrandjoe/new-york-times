"use client";

import Image from "next/image";
import type { CmsMedia } from "@/lib/cms/types";
import { MediaSourcePicker } from "./MediaSourcePicker";

export function MediaPickerField({
  media,
  value,
  onChange,
  onUploaded,
}: {
  media: CmsMedia[];
  value: string;
  onChange: (media: CmsMedia | null) => void;
  onUploaded?: (media: CmsMedia) => void;
}) {
  const selected = media.find((m) => m.id === value) ?? null;

  return (
    <div className="flex items-start gap-3">
      {selected && (
        <span className="relative h-12 w-16 shrink-0 overflow-hidden bg-black">
          <Image src={selected.url} alt={selected.altText ?? ""} fill sizes="64px" className="object-cover" />
        </span>
      )}
      <div className="flex-1">
        <MediaSourcePicker media={media} value={value} onChange={onChange} onUploaded={onUploaded} />
      </div>
    </div>
  );
}
