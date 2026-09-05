"use client";

import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/react";

export function PullQuoteView({ node, updateAttributes }: NodeViewProps) {
  const attribution = (node.attrs.attribution as string | null) ?? "";

  return (
    <NodeViewWrapper className="my-6 border-y border-charcoal py-6 text-center">
      <NodeViewContent
        as="div"
        className="font-serif text-2xl font-bold leading-snug text-white sm:text-3xl"
      />
      <input
        type="text"
        value={attribution}
        onChange={(e) => updateAttributes({ attribution: e.target.value || null })}
        placeholder="Attribution (optional)"
        contentEditable={false}
        className="focus-ring mx-auto mt-3 block w-full max-w-xs border border-white/10 bg-black px-3 py-1.5 text-center text-sm text-gray-muted placeholder:text-gray-muted focus:border-accent"
      />
    </NodeViewWrapper>
  );
}
