"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

function fieldClass() {
  return "focus-ring w-full border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent";
}

export function ArticleVideoView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const { url, caption, credit, description } = node.attrs as {
    url: string;
    caption: string | null;
    credit: string | null;
    description: string | null;
  };

  return (
    <NodeViewWrapper className="my-6 border border-charcoal bg-charcoal-deep p-4" data-drag-handle>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-muted">Video</span>
        <button
          type="button"
          onClick={() => deleteNode()}
          className="focus-ring text-xs font-semibold text-live-red hover:underline"
        >
          Remove
        </button>
      </div>

      {url ? (
        <div className="mb-3 aspect-video w-full overflow-hidden bg-black">
          <iframe src={url} title={description ?? "Embedded video"} className="h-full w-full" allowFullScreen />
        </div>
      ) : null}

      <div className="space-y-2">
        <input
          type="url"
          value={url}
          onChange={(e) => updateAttributes({ url: e.target.value })}
          placeholder="Embed URL (e.g. YouTube embed link)"
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
        <input
          type="text"
          value={description ?? ""}
          onChange={(e) => updateAttributes({ description: e.target.value || null })}
          placeholder="Description (for accessibility, optional)"
          className={fieldClass()}
        />
      </div>
    </NodeViewWrapper>
  );
}
