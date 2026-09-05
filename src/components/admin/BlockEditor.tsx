"use client";

import { BLOCK_TYPE_LABELS, emptyBlock, type ContentBlock } from "@/lib/cms/blocks";
import type { CmsMedia } from "@/lib/cms/types";
import { MediaPickerField } from "./MediaPickerField";

const ADDABLE_TYPES: ContentBlock["type"][] = [
  "paragraph",
  "heading",
  "list",
  "blockquote",
  "pullquote",
  "image",
  "video",
  "divider",
];

export function BlockEditor({
  blocks,
  onChange,
  media,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  media: CmsMedia[];
}) {
  function updateBlock(index: number, block: ContentBlock) {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addBlock(type: ContentBlock["type"]) {
    onChange([...blocks, emptyBlock(type)]);
  }

  return (
    <div>
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={index} className="border border-charcoal bg-charcoal-deep p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-muted">
                {BLOCK_TYPE_LABELS[block.type]}
              </span>
              <div className="flex gap-2 text-xs font-semibold">
                <button type="button" onClick={() => moveBlock(index, -1)} className="focus-ring text-gray-secondary-light hover:text-accent">
                  Up
                </button>
                <button type="button" onClick={() => moveBlock(index, 1)} className="focus-ring text-gray-secondary-light hover:text-accent">
                  Down
                </button>
                <button type="button" onClick={() => removeBlock(index)} className="focus-ring text-live-red hover:underline">
                  Remove
                </button>
              </div>
            </div>
            <BlockFields block={block} onChange={(b) => updateBlock(index, b)} media={media} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ADDABLE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="focus-ring border border-charcoal px-3 py-1.5 text-xs font-semibold text-gray-secondary-light hover:border-accent hover:text-accent"
          >
            + {BLOCK_TYPE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}

function textareaClass() {
  return "focus-ring w-full border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent";
}

function BlockFields({
  block,
  onChange,
  media,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  media: CmsMedia[];
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <textarea
          rows={4}
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Paragraph text — **bold**, *italic*, [link](https://...)"
          className={textareaClass()}
        />
      );

    case "heading":
      return (
        <div className="flex gap-3">
          <select
            value={block.level}
            onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 1 | 2 | 3 })}
            className={`${textareaClass()} w-24`}
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
          <input
            type="text"
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Heading text"
            className={textareaClass()}
          />
        </div>
      );

    case "list":
      return (
        <div>
          <select
            value={block.style}
            onChange={(e) => onChange({ ...block, style: e.target.value as "bulleted" | "numbered" })}
            className={`${textareaClass()} mb-2 w-40`}
          >
            <option value="bulleted">Bulleted</option>
            <option value="numbered">Numbered</option>
          </select>
          <textarea
            rows={4}
            value={block.items.join("\n")}
            onChange={(e) => onChange({ ...block, items: e.target.value.split("\n") })}
            placeholder="One item per line"
            className={textareaClass()}
          />
        </div>
      );

    case "blockquote":
      return (
        <textarea
          rows={3}
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Quoted text"
          className={textareaClass()}
        />
      );

    case "pullquote":
      return (
        <div className="space-y-2">
          <textarea
            rows={2}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Pull quote text"
            className={textareaClass()}
          />
          <input
            type="text"
            value={block.attribution ?? ""}
            onChange={(e) => onChange({ ...block, attribution: e.target.value })}
            placeholder="Attribution (optional)"
            className={textareaClass()}
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <MediaPickerField
            media={media.filter((m) => m.type === "image")}
            value={block.mediaId}
            onChange={(m) =>
              onChange({ ...block, mediaId: m?.id ?? "", url: m?.url ?? "", alt: m?.altText ?? block.alt })
            }
          />
          <input
            type="text"
            value={block.alt}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
            placeholder="Alt text (required)"
            className={textareaClass()}
          />
          <input
            type="text"
            value={block.caption ?? ""}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)"
            className={textareaClass()}
          />
          <input
            type="text"
            value={block.credit ?? ""}
            onChange={(e) => onChange({ ...block, credit: e.target.value })}
            placeholder="Credit (optional)"
            className={textareaClass()}
          />
        </div>
      );

    case "video":
      return (
        <div className="space-y-2">
          <input
            type="url"
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="Embed URL (e.g. YouTube embed link)"
            className={textareaClass()}
          />
          <input
            type="text"
            value={block.caption ?? ""}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)"
            className={textareaClass()}
          />
          <input
            type="text"
            value={block.credit ?? ""}
            onChange={(e) => onChange({ ...block, credit: e.target.value })}
            placeholder="Credit (optional)"
            className={textareaClass()}
          />
          <input
            type="text"
            value={block.description ?? ""}
            onChange={(e) => onChange({ ...block, description: e.target.value })}
            placeholder="Description (for accessibility, optional)"
            className={textareaClass()}
          />
        </div>
      );

    case "divider":
      return <p className="text-sm text-gray-muted">A horizontal divider — no content needed.</p>;
  }
}
