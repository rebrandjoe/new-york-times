"use client";

import Image from "next/image";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import type { CmsMedia } from "@/lib/cms/types";

function fieldClass() {
  return "focus-ring w-full border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent";
}

/** Inline image node: selecting from the media library, and its Caption/
 * Credit/Alt text, live directly beneath the image at its position in the
 * body — not as a separate field elsewhere. */
export function ArticleImageView({ node, updateAttributes, deleteNode, extension }: NodeViewProps) {
  const media = (extension.options.media as CmsMedia[]) ?? [];
  const { mediaId, url, alt, caption, credit } = node.attrs as {
    mediaId: string;
    url: string;
    alt: string;
    caption: string | null;
    credit: string | null;
  };

  function selectMedia(id: string) {
    const selected = media.find((m) => m.id === id) ?? null;
    updateAttributes({
      mediaId: selected?.id ?? "",
      url: selected?.url ?? "",
      alt: selected?.altText ?? alt,
    });
  }

  return (
    <NodeViewWrapper className="my-6 border border-charcoal bg-charcoal-deep p-4" data-drag-handle>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-muted">Image</span>
        <button
          type="button"
          onClick={() => deleteNode()}
          className="focus-ring text-xs font-semibold text-live-red hover:underline"
        >
          Remove
        </button>
      </div>

      {url ? (
        <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden bg-black">
          <Image src={url} alt={alt} fill sizes="720px" className="object-cover" />
        </div>
      ) : null}

      <div className="space-y-2">
        <select
          value={mediaId}
          onChange={(e) => selectMedia(e.target.value)}
          className={fieldClass()}
        >
          <option value="">Select from media library…</option>
          {media.map((m) => (
            <option key={m.id} value={m.id}>
              {m.altText || m.url.split("/").pop()}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={alt}
          onChange={(e) => updateAttributes({ alt: e.target.value })}
          placeholder="Alt text (required)"
          className={fieldClass()}
        />
        <input
          type="text"
          value={caption ?? ""}
          onChange={(e) => updateAttributes({ caption: e.target.value || null })}
          placeholder="Caption (optional)"
          className={fieldClass()}
        />
        <input
          type="text"
          value={credit ?? ""}
          onChange={(e) => updateAttributes({ credit: e.target.value || null })}
          placeholder="Credit (optional)"
          className={fieldClass()}
        />
      </div>
    </NodeViewWrapper>
  );
}
