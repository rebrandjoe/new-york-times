export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
}

export interface ListBlock {
  type: "list";
  style: "bulleted" | "numbered";
  items: string[];
}

export interface BlockquoteBlock {
  type: "blockquote";
  text: string;
}

export interface PullquoteBlock {
  type: "pullquote";
  text: string;
  attribution?: string;
}

export interface ImageBlock {
  type: "image";
  mediaId: string;
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
  linkUrl?: string;
}

export interface VideoBlock {
  type: "video";
  url: string;
  caption?: string;
  credit?: string;
  description?: string;
}

export interface DividerBlock {
  type: "divider";
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | BlockquoteBlock
  | PullquoteBlock
  | ImageBlock
  | VideoBlock
  | DividerBlock;

export const BLOCK_TYPE_LABELS: Record<ContentBlock["type"], string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  list: "List",
  blockquote: "Blockquote",
  pullquote: "Pull quote",
  image: "Image",
  video: "Video",
  divider: "Divider",
};

export function emptyBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "heading":
      return { type: "heading", level: 2, text: "" };
    case "list":
      return { type: "list", style: "bulleted", items: [""] };
    case "blockquote":
      return { type: "blockquote", text: "" };
    case "pullquote":
      return { type: "pullquote", text: "" };
    case "image":
      return { type: "image", mediaId: "", url: "", alt: "" };
    case "video":
      return { type: "video", url: "" };
    case "divider":
      return { type: "divider" };
  }
}

/** Plain-text word count across all text-bearing blocks, for read-time estimation. */
export function blocksToWordCount(blocks: ContentBlock[]): number {
  let words = 0;
  for (const block of blocks) {
    if (block.type === "paragraph" || block.type === "heading" || block.type === "blockquote") {
      words += block.text.trim().split(/\s+/).filter(Boolean).length;
    } else if (block.type === "pullquote") {
      words += block.text.trim().split(/\s+/).filter(Boolean).length;
    } else if (block.type === "list") {
      words += block.items.join(" ").trim().split(/\s+/).filter(Boolean).length;
    } else if (block.type === "video") {
      words += (block.description ?? "").trim().split(/\s+/).filter(Boolean).length;
    }
  }
  return words;
}

const AVERAGE_READING_WPM = 220;

export function estimateReadTimeMinutes(blocks: ContentBlock[]): number {
  const words = blocksToWordCount(blocks);
  return Math.max(1, Math.round(words / AVERAGE_READING_WPM));
}

const PREVIEW_WORD_LIMIT = 120;

/** For the premium paywall: enough of the article to show real value, then
 * cut off — never the full body. */
export function truncateBlocksForPreview(blocks: ContentBlock[]): ContentBlock[] {
  const preview: ContentBlock[] = [];
  let words = 0;

  for (const block of blocks) {
    preview.push(block);
    if (block.type === "paragraph" || block.type === "heading" || block.type === "blockquote" || block.type === "pullquote") {
      words += block.text.trim().split(/\s+/).filter(Boolean).length;
    }
    if (words >= PREVIEW_WORD_LIMIT) break;
  }

  return preview.length > 0 ? preview : blocks.slice(0, 1);
}
