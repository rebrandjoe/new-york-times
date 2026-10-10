import type { ContentBlock } from "@/lib/cms/blocks";

/**
 * Flatten article body blocks into spoken plain text.
 * Excludes images, video, dividers, and any UI chrome.
 */
export function blocksToSpokenText(blocks: ContentBlock[]): string {
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
      case "blockquote": {
        const t = stripMarkup(block.text).trim();
        if (t) parts.push(t);
        break;
      }
      case "heading": {
        const t = stripMarkup(block.text).trim();
        if (t) parts.push(t + ".");
        break;
      }
      case "pullquote": {
        const t = stripMarkup(block.text).trim();
        if (t) parts.push(t);
        if (block.attribution?.trim()) {
          parts.push(stripMarkup(block.attribution).trim());
        }
        break;
      }
      case "list": {
        for (const item of block.items) {
          const t = stripMarkup(item).trim();
          if (t) parts.push(t + ".");
        }
        break;
      }
      default:
        break;
    }
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function stripMarkup(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'");
}

export function buildAudioSourceText(title: string, blocks: ContentBlock[]): string {
  const body = blocksToSpokenText(blocks);
  const cleanTitle = stripMarkup(title).trim();
  if (!body) return cleanTitle;
  return `${cleanTitle}. ${body}`;
}
